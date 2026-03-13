"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Minus, Plus, ScrollText } from "lucide-react";
import type { ColumnKey, Exoplanet } from "@/types/exoplanet";
import { useColumnManager } from "@/hooks/useColumnManager";
import { useTableSort } from "@/hooks/useTableSort";

const ROW_H = 44;
const HEADER_H = 46;
const VISIBLE = 10;

interface Props {
  data: Exoplanet[];
}

export default function DataTable({ data }: Props) {
  const { sort, toggle, sorted } = useTableSort(data);
  const { columns, available, removable, add, remove } = useColumnManager();
  const [addMenuOpen, setAddMenu] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Toolbar
        count={sorted.length}
        removable={removable.map((c) => ({ key: c.key, label: c.label }))}
        available={available}
        addMenuOpen={addMenuOpen}
        onToggleAddMenu={() => setAddMenu((v) => !v)}
        onAdd={(col) => {
          add(col);
          setAddMenu(false);
        }}
        onRemove={remove}
      />

      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--color-surface-200)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="overflow-auto" style={{ maxHeight: `${HEADER_H + ROW_H * VISIBLE}px` }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <tr style={{ background: "var(--color-primary-600)" }}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="cursor-pointer px-4 font-semibold whitespace-nowrap select-none"
                    style={{
                      textAlign: col.align ?? "left",
                      color: "var(--color-primary-100)",
                      borderBottom: "2px solid var(--color-primary-700)",
                      height: `${HEADER_H}px`,
                    }}
                    onClick={() => toggle(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon colKey={col.key} sort={sort} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm"
                    style={{ color: "var(--color-surface-400)" }}
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <tr key={`${row.pl_name}-${i}`} className="table-row">
                    {columns.map((col) => {
                      const raw = row[col.key];
                      const display = col.format
                        ? col.format(raw as number | string | null)
                        : (raw ?? "—");
                      return (
                        <td
                          key={col.key}
                          className="px-4 whitespace-nowrap"
                          style={{
                            height: `${ROW_H}px`,
                            textAlign: col.align ?? "left",
                            color:
                              raw == null || raw === ""
                                ? "var(--color-surface-300)"
                                : "var(--color-surface-800)",
                          }}
                        >
                          {String(display)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortIcon({
  colKey,
  sort,
}: {
  colKey: ColumnKey;
  sort: ReturnType<typeof useTableSort>["sort"];
}) {
  if (sort.key !== colKey)
    return <ChevronsUpDown size={13} style={{ color: "var(--color-primary-300)" }} />;
  return sort.dir === "asc" ? (
    <ChevronUp size={13} style={{ color: "#fff" }} />
  ) : (
    <ChevronDown size={13} style={{ color: "#fff" }} />
  );
}

interface ToolbarProps {
  count: number;
  removable: { key: ColumnKey; label: string }[];
  available: ReturnType<typeof useColumnManager>["available"];
  addMenuOpen: boolean;
  onToggleAddMenu: () => void;
  onAdd: (col: ReturnType<typeof useColumnManager>["available"][number]) => void;
  onRemove: (key: ColumnKey) => void;
}

function Toolbar({
  count,
  removable,
  available,
  addMenuOpen,
  onToggleAddMenu,
  onAdd,
  onRemove,
}: ToolbarProps) {
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
