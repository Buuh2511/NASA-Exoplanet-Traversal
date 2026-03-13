"use client";

import { useState } from "react";
import type { Exoplanet } from "@/types/exoplanet";
import { useColumnManager } from "@/hooks/useColumnManager";
import { useTableSort } from "@/hooks/useTableSort";
import SortIcon from "@/components/icons/SortIcon";
import TableToolbar from "@/components/TableToolbar";

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
      <TableToolbar
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
