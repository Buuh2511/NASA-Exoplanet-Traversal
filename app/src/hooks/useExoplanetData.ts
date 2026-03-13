"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildIndex, queryIndex } from "@/lib/dataIndex";
import type { DataIndex, Exoplanet, QueryParams } from "@/types/exoplanet";

type Status = "idle" | "loading" | "ready" | "error";

export function useExoplanetData() {
  const indexRef = useRef<DataIndex | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/exoplanets", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Exoplanet[]>;
      })
      .then((data) => {
        const index = buildIndex(data);
        indexRef.current = index;
        setYears(index.years);
        setFacilities(index.facilities);
        setStatus("ready");
      })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const search = useCallback((params: QueryParams): Exoplanet[] => {
    if (!indexRef.current) return [];
    return queryIndex(indexRef.current, params);
  }, []);

  return { status, error, years, facilities, search };
}
