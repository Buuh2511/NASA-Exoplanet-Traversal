"use client";

import { Minus, Plus, ScrollText } from "lucide-react";
import type { ColumnKey } from "@/types/exoplanet";
import type { useColumnManager } from "@/hooks/useColumnManager";

const VISIBLE = 10;

interface Props {
  count: number;
  removable: { key: ColumnKey; label: string }[];
  available: ReturnType<typeof useColumnManager>["available"];
  addMenuOpen: boolean;
  onToggleAddMenu: () => void;
  onAdd: (col: ReturnType<typeof useColumnManager>["available"][number]) => void;
  onRemove: (key: ColumnKey) => void;
}

export default function TableToolbar({
  count,
  removable,
  available,
  addMenuOpen,
  onToggleAddMenu,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="badge badge-primary">{count.toLocaleString()} results</span>
        {count > VISIBLE && (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-surface-400)" }}
          >
            <ScrollText size={12} />
            scroll to see all
          </span>
        )}
      </div>

      <div className="relative flex items-center gap-1">
        {removable.map((col) => (
          <button
            key={col.key}
            className="btn-icon"
            title={`Remove "${col.label}" column`}
            onClick={() => onRemove(col.key)}
          >
            <Minus size={14} />
          </button>
        ))}

        {available.length > 0 && (
          <div className="relative">
            <button className="btn-icon" title="Add column" onClick={onToggleAddMenu}>
              <Plus size={14} />
            </button>
            {addMenuOpen && (
              <div
                className="absolute top-8 right-0 z-50 overflow-hidden rounded-lg"
                style={{
                  background: "var(--color-surface-0)",
                  border: "1px solid var(--color-surface-200)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: "150px",
                }}
              >
                {available.map((col) => (
                  <button key={col.key} onClick={() => onAdd(col)} className="dropdown-item">
                    {col.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
