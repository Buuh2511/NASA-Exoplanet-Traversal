"use client";

import { Search, X, AlertCircle } from "lucide-react";
import Select from "./Select";

interface Props {
  years: number[];
  facilities: string[];
  selectedYear: number | null;
  selectedFacility: string | null;
  error: string | null;
  loading: boolean;
  onYearChange: (v: number | null) => void;
  onFacilityChange: (v: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function QueryPanel({
  years,
  facilities,
  selectedYear,
  selectedFacility,
  error,
  loading,
  onYearChange,
  onFacilityChange,
  onSearch,
  onClear,
}: Props) {
  const yearOptions = years.map((y) => ({
    value: String(y),
    label: String(y),
  }));
  const facilityOptions = facilities.map((f) => ({ value: f, label: f }));

  return (
    <div className="card flex flex-col gap-5 p-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: "var(--color-primary-100)" }}
        >
          <Search size={18} style={{ color: "var(--color-primary-600)" }} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-surface-900)" }}>
            Query Exoplanets
          </h2>
          <p className="text-xs" style={{ color: "var(--color-surface-400)" }}>
            Filter by year and/or discovery facility
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex min-w-45 flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--color-surface-600)" }}>
            Discovery Year
          </label>
          <Select
            options={yearOptions}
            value={selectedYear !== null ? String(selectedYear) : ""}
            onChange={(v) => onYearChange(v ? Number(v) : null)}
            placeholder="All years"
          />
        </div>

        <div className="flex min-w-55 flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--color-surface-600)" }}>
            Discovery Facility
          </label>
          <Select
            options={facilityOptions}
            value={selectedFacility ?? ""}
            onChange={(v) => onFacilityChange(v || null)}
            placeholder="All facilities"
            searchable
          />
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--color-error-50)",
            border: "1px solid var(--color-error-100)",
            color: "var(--color-error-600)",
          }}
        >
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button className="btn-primary" onClick={onSearch} disabled={loading}>
          <Search size={15} />
          Search
        </button>
        <button className="btn-ghost" onClick={onClear}>
          <X size={15} />
          Clear
        </button>
      </div>
    </div>
  );
}
