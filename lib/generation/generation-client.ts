import { generateGeometry, getLayerCount, normalizeSize } from "@/lib/geometry/generate-geometry";
import type { GeometryOptions, GeometryResult, GeometryShape } from "@/lib/geometry/geometry-types";
import {
  generateShapeLayers,
  getShapeLayerCount,
  normalizeShapeOptions,
  THREE_D_SHAPES,
  type ShapeBlueprint,
  type ShapeOptions,
} from "@/lib/shape/generate-shape";
import { buildVolumeData, type VolumeData } from "@/lib/shape/volume-data";

/** Estimated cell visits above which generation moves to the worker thread. */
const HEAVY_VOLUME_OPS = 1_000_000;

export interface ShapeVolumePayload {
  layers: ShapeBlueprint[];
  /** Present for 3D shapes; null for planar shapes. */
  volume: VolumeData | null;
}

function estimatedVolumeOps(cells: number, filled: boolean): number {
  // Hollow volumes run six neighbor checks per cell; filled volumes run one.
  return cells * (filled ? 1 : 7);
}

export function isHeavyShapeWork(rawOptions: ShapeOptions): boolean {
  const options = normalizeShapeOptions(rawOptions);
  if (!THREE_D_SHAPES.includes(options.shape)) return false;
  const layerCount = getShapeLayerCount(options.shape, options.width, options.height, options.depth);
  return estimatedVolumeOps(options.width * options.depth * layerCount, options.filled) >= HEAVY_VOLUME_OPS;
}

export function isHeavyGeometryWork(shape: GeometryShape, rawOptions: GeometryOptions): boolean {
  if (shape !== "sphere" && shape !== "dome") return false;
  const diameter = normalizeSize(rawOptions.diameter, shape);
  const cells = diameter * diameter * getLayerCount(shape, diameter);
  return estimatedVolumeOps(cells, rawOptions.mode === "filled") >= HEAVY_VOLUME_OPS;
}

let workerInstance: Worker | null = null;
let workerUnavailable = false;

let nextRequestId = 1;
const pending = new Map<number, (response: { id: number } & Record<string, unknown>) => void>();

function getWorker(): Worker | null {
  if (workerUnavailable || typeof Worker === "undefined") return null;
  if (!workerInstance) {
    try {
      const worker = new Worker(new URL("../workers/generation-worker.ts", import.meta.url));
      worker.onmessage = (event: MessageEvent<{ id: number } & Record<string, unknown>>) => {
        const resolve = pending.get(event.data.id);
        if (resolve) {
          pending.delete(event.data.id);
          resolve(event.data);
        }
      };
      worker.onerror = () => {
        workerUnavailable = true;
        pending.forEach((resolve) => resolve({ id: -1 }));
        pending.clear();
      };
      workerInstance = worker;
    } catch {
      workerUnavailable = true;
      return null;
    }
  }
  return workerInstance;
}

function postRequest(request: Record<string, unknown>, transfer: Transferable[]): Promise<{ id: number } & Record<string, unknown>> | null {
  const worker = getWorker();
  if (!worker) return null;
  return new Promise((resolve) => {
    const id = nextRequestId;
    nextRequestId += 1;
    pending.set(id, resolve);
    worker.postMessage({ ...request, id }, transfer);
  });
}

function cacheGet<T>(key: string): T | null {
  return (cache.get(key) as T | undefined) ?? null;
}

const cache = new Map<string, unknown>();
const CACHE_LIMIT = 6;

function cacheSet(key: string, value: unknown) {
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

function shapeCacheKey(rawOptions: ShapeOptions): string {
  const options = normalizeShapeOptions(rawOptions);
  // The layer list is independent of the selected layer, so the cache key omits it.
  return `shape:${options.shape}|${options.width}|${options.height}|${options.depth}|${options.sides}|${options.thickness}|${options.filled}`;
}

/** Cache key for a shape volume; exported for components to match loaded results to options. */
export const shapeWorkKey = shapeCacheKey;

function computeShapePayload(rawOptions: ShapeOptions): ShapeVolumePayload {
  const layers = generateShapeLayers(rawOptions);
  const is3d = THREE_D_SHAPES.includes(normalizeShapeOptions(rawOptions).shape);
  return { layers, volume: is3d ? buildVolumeData(layers) : null };
}

export function loadShapeLayers(rawOptions: ShapeOptions): Promise<ShapeVolumePayload> {
  const key = shapeCacheKey(rawOptions);
  const cached = cacheGet<ShapeVolumePayload>(key);
  if (cached) return Promise.resolve(cached);
  if (!isHeavyShapeWork(rawOptions)) {
    const payload = computeShapePayload(rawOptions);
    cacheSet(key, payload);
    return Promise.resolve(payload);
  }
  const response = postRequest({ kind: "shape", options: rawOptions }, []);
  if (!response) {
    const payload = computeShapePayload(rawOptions);
    cacheSet(key, payload);
    return Promise.resolve(payload);
  }
  return response.then((data) => {
    if (data.id === -1 || data.kind !== "shape") {
      const payload = computeShapePayload(rawOptions);
      cacheSet(key, payload);
      return payload;
    }
    const payload: ShapeVolumePayload = {
      layers: data.layers as ShapeBlueprint[],
      volume: {
        width: data.width as number,
        depth: data.depth as number,
        layerCount: data.layerCount as number,
        occupancy: data.occupancy as Uint8Array,
        surface: data.surface as Int32Array,
      },
    };
    cacheSet(key, payload);
    return payload;
  });
}

function geometryCacheKey(shape: GeometryShape, options: GeometryOptions): string {
  return `geometry:${shape}:${JSON.stringify(options)}`;
}

export function loadGeometry(shape: GeometryShape, options: GeometryOptions): Promise<GeometryResult> {
  const key = geometryCacheKey(shape, options);
  const cached = cacheGet<GeometryResult>(key);
  if (cached) return Promise.resolve(cached);
  const compute = () => {
    const result = generateGeometry(shape, options);
    cacheSet(key, result);
    return result;
  };
  if (!isHeavyGeometryWork(shape, options)) return Promise.resolve(compute());
  const response = postRequest({ kind: "geometry", shape, options }, []);
  if (!response) return Promise.resolve(compute());
  return response.then((data) => {
    if (data.id === -1 || data.kind !== "geometry") return compute();
    const result = data.result as GeometryResult;
    cacheSet(key, result);
    return result;
  });
}
