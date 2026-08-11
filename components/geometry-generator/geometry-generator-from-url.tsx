"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGeometryUrl } from "@/lib/geometry/geometry-url-state";
import type { GeometryShape } from "@/lib/geometry/geometry-types";
import { GeometryGenerator } from "./geometry-generator";

export function GeometryGeneratorFromUrl({ shape }: { shape: GeometryShape }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const initialOptions = useMemo(
    () => parseGeometryUrl(shape, query),
    [query, shape],
  );

  return (
    <GeometryGenerator
      key={`${shape}:${query}`}
      shape={shape}
      initialOptions={initialOptions}
    />
  );
}
