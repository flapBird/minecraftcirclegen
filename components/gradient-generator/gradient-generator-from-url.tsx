"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGradientOptions } from "@/lib/gradient/gradient-url-state";
import { GradientGenerator } from "./gradient-generator";

export function GradientGeneratorFromUrl() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const initialOptions = useMemo(() => parseGradientOptions(query), [query]);

  return <GradientGenerator key={query} initialOptions={initialOptions} />;
}
