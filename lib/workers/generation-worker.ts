import { generateGeometry } from "../geometry/generate-geometry";
import type { GeometryOptions, GeometryShape } from "../geometry/geometry-types";
import { generateShapeLayers, type ShapeOptions } from "../shape/generate-shape";
import { buildVolumeData } from "../shape/volume-data";

export type GenerationRequest =
  | { id: number; kind: "shape"; options: ShapeOptions }
  | { id: number; kind: "geometry"; shape: GeometryShape; options: GeometryOptions };

export type GenerationResponse =
  | {
    id: number;
    kind: "shape";
    layers: ReturnType<typeof generateShapeLayers>;
    occupancy: Uint8Array;
    surface: Int32Array;
    width: number;
    depth: number;
    layerCount: number;
  }
  | { id: number; kind: "geometry"; result: ReturnType<typeof generateGeometry> };

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<GenerationRequest>) => void) | null;
  postMessage(message: GenerationResponse, transfer?: Transferable[]): void;
};

scope.onmessage = (event) => {
  const message = event.data;
  if (message.kind === "shape") {
    const layers = generateShapeLayers(message.options);
    const volume = buildVolumeData(layers);
    scope.postMessage(
      {
        id: message.id,
        kind: "shape",
        layers,
        occupancy: volume.occupancy,
        surface: volume.surface,
        width: volume.width,
        depth: volume.depth,
        layerCount: volume.layerCount,
      },
      [volume.occupancy.buffer, volume.surface.buffer],
    );
    return;
  }
  scope.postMessage({ id: message.id, kind: "geometry", result: generateGeometry(message.shape, message.options) });
};
