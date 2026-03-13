"use client";

import { useState } from "react";
import type { ColumnDef, ColumnKey } from "@/types/exoplanet";
import { CORE_COLUMNS, OPTIONAL_COLUMNS } from "@/types/exoplanet";

export function useColumnManager() {
  const [columns, setColumns] = useState<ColumnDef[]>(CORE_COLUMNS);

  const available = OPTIONAL_COLUMNS.filter((c) => !columns.some((a) => a.key === c.key));

  const removable = columns.filter((c) => c.removable);

  function add(col: ColumnDef) {
    setColumns((prev) => [...prev, col]);
  }

  function remove(key: ColumnKey) {
    setColumns((prev) => prev.filter((c) => c.key !== key));
  }

  return { columns, available, removable, add, remove };
}
