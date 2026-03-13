"use client";

import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import Highlight from "@/components/Highlight";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchable = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered =
    searchable && debouncedQuery.trim()
      ? options.filter((o) => o.label.toLowerCase().includes(debouncedQuery.toLowerCase()))
      : options;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useClickOutside(containerRef, close);

  function handleOpen() {
    setOpen((v) => !v);
    if (!open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }

  function handleSelect(val: string) {
    onChange(val);
    close();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-all"
        style={{
          background: "var(--color-surface-0)",
          border: `1px solid ${open ? "var(--color-primary-400)" : "var(--color-surface-200)"}`,
          boxShadow: open ? "0 0 0 3px rgb(59 130 246 / 0.15)" : "var(--shadow-xs)",
          color: value ? "var(--color-surface-800)" : "var(--color-surface-400)",
          borderRadius: "0.5rem",
        }}
      >
        <span className="truncate">{value ? selectedLabel : placeholder}</span>
        <ChevronDown
          size={15}
          style={{
            color: "var(--color-surface-400)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 left-0 z-50 flex flex-col overflow-hidden"
          style={{
            top: "calc(100% + 6px)",
            background: "var(--color-surface-0)",
            border: "1px solid var(--color-surface-200)",
            borderRadius: "0.625rem",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {searchable && (
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: "1px solid var(--color-surface-100)" }}
            >
              <Search size={13} style={{ color: "var(--color-surface-400)", flexShrink: 0 }} />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--color-surface-800)" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="btn-icon"
                  style={{ width: "1.25rem", height: "1.25rem", fontSize: "0.7rem" }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
            {!debouncedQuery && (
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`dropdown-item placeholder ${value === "" ? "active" : ""}`}
                style={{ borderBottom: "1px solid var(--color-surface-100)" }}
              >
                {placeholder}
                {value === "" && <Check size={13} />}
              </button>
            )}

            {filtered.length === 0 ? (
              <div
                className="px-3 py-4 text-center text-sm"
                style={{ color: "var(--color-surface-400)" }}
              >
                No results for &ldquo;{debouncedQuery}&rdquo;
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`dropdown-item ${opt.value === value ? "active" : ""}`}
                >
                  <span className="truncate">
                    <Highlight text={opt.label} query={debouncedQuery} />
                  </span>
                  {opt.value === value && <Check size={13} style={{ flexShrink: 0 }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
