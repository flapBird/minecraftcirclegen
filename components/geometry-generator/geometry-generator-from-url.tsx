"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGeometryShape, parseGeometryUrl } from "@/lib/geometry/geometry-url-state";
import type { GeometryShape } from "@/lib/geometry/geometry-types";
import { GeometryGenerator } from "./geometry-generator";

export function GeometryGeneratorFromUrl({ shape }: { shape: GeometryShape }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const initialShape = useMemo(
    () => parseGeometryShape(query, shape),
    [query, shape],
  );
  const initialOptions = useMemo(
    () => parseGeometryUrl(initialShape, query),
    [initialShape, query],
  );

  return (
    <GeometryGenerator
      shape={initialShape}
      canonicalShape={shape}
      initialOptions={initialOptions}
    />
  );
}
