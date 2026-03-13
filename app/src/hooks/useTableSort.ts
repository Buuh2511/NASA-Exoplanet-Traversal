"use client";

import { useMemo, useState } from "react";
import type { ColumnKey, Exoplanet, SortState } from "@/types/exoplanet";

export function useTableSort(data: Exoplanet[]) {
  const [sort, setSort] = useState<SortState>({ key: null, dir: null });

  function toggle(key: ColumnKey) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: null };
    });
  }

  const sorted = useMemo(() => {
    if (!sort.key || !sort.dir) return data;
    return [...data].sort((a, b) => {
      const av = a[sort.key!];
      const bv = b[sort.key!];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [data, sort]);

  return { sort, toggle, sorted };
}
