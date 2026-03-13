"use client";

import { useEffect, useRef, useState } from "react";
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
    fetch("/api/exoplanets")
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
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      });
  }, []);

  function search(params: QueryParams): Exoplanet[] {
    if (!indexRef.current) return [];
    return queryIndex(indexRef.current, params);
  }

  return { status, error, years, facilities, search };
}
