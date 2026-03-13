"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColumnDef, ColumnKey } from "@/types/exoplanet";
import { CORE_COLUMNS, OPTIONAL_COLUMNS } from "@/types/exoplanet";

export function useColumnManager() {
  const [columns, setColumns] = useState<ColumnDef[]>(CORE_COLUMNS);

  const available = useMemo(
    () => OPTIONAL_COLUMNS.filter((c) => !columns.some((a) => a.key === c.key)),
    [columns],
  );

  const removable = useMemo(() => columns.filter((c) => c.removable), [columns]);

  const add = useCallback((col: ColumnDef) => {
    setColumns((prev) => [...prev, col]);
  }, []);

  const remove = useCallback((key: ColumnKey) => {
    setColumns((prev) => prev.filter((c) => c.key !== key));
  }, []);

  return { columns, available, removable, add, remove };
}
