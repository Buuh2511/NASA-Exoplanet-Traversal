"use client";

import { useState } from "react";
import { Satellite } from "lucide-react";
import QueryPanel from "@/components/QueryPanel";
import DataTable from "@/components/DataTable";
import PlanetVisualization from "@/components/PlanetVisualization";
import { useExoplanetData } from "@/hooks/useExoplanetData";
import type { Exoplanet } from "@/types/exoplanet";

export default function Home() {
  const { status, error: fetchError, years, facilities, search } = useExoplanetData();

  const [selectedYear, setYear] = useState<number | null>(null);
  const [selectedFacility, setFacility] = useState<string | null>(null);
  const [results, setResults] = useState<Exoplanet[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  function handleSearch() {
    if (selectedYear === null && selectedFacility === null) {
      setQueryError("Please select at least one filter before searching.");
      return;
    }
    setQueryError(null);
    setResults(search({ year: selectedYear, facility: selectedFacility }));
  }

  function handleClear() {
    setYear(null);
    setFacility(null);
    setResults(null);
    setQueryError(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface-50)" }}>
      <header
        style={{
          background: "var(--color-primary-700)",
          borderBottom: "1px solid var(--color-primary-800)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "var(--color-primary-600)",
              boxShadow: "var(--shadow-primary)",
            }}
          >
            <Satellite size={20} color="#fff" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "#fff" }}>
              NASA Exoplanet Traversal
            </h1>
            <p className="text-xs" style={{ color: "var(--color-primary-200)" }}>
              4,000+ confirmed exoplanets since 1992
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {status === "loading" && (
              <span className="badge badge-accent animate-pulse">Loading data…</span>
            )}
            {status === "ready" && <span className="badge badge-secondary">Data ready</span>}
            {status === "error" && (
              <span
                className="badge"
                style={{
                  background: "var(--color-error-100)",
                  color: "var(--color-error-600)",
                }}
              >
                {fetchError}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <QueryPanel
          years={years}
          facilities={facilities}
          selectedYear={selectedYear}
          selectedFacility={selectedFacility}
          error={queryError}
          loading={status === "loading"}
          onYearChange={setYear}
          onFacilityChange={setFacility}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {results !== null && (
          <>
            <div className="card p-6">
              <h2
                className="mb-4 text-base font-semibold"
                style={{ color: "var(--color-surface-800)" }}
              >
                Results
              </h2>
              <DataTable data={results} />
            </div>

            {results.length > 0 && <PlanetVisualization planets={results.slice(0, 10)} />}
          </>
        )}

        {results === null && status === "ready" && (
          <div
            className="card flex flex-col items-center justify-center gap-3 py-16"
            style={{ color: "var(--color-surface-400)" }}
          >
            <Satellite size={40} strokeWidth={1.2} />
            <p className="text-sm">Select filters above and click Search to explore exoplanets.</p>
          </div>
        )}
      </main>
    </div>
  );
}
