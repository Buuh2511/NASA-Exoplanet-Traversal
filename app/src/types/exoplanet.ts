export interface Exoplanet {
  pl_name: string;
  disc_year: number | null;
  disc_facility: string;
  pl_rade: number | null;
  pl_orbper: number | null;
  pl_masse: number | null;
  hostname: string;
  sy_pnum: number | null;
  sy_snum: number | null;
}

export type ColumnKey = keyof Exoplanet;

export interface ColumnDef {
  key: ColumnKey;
  label: string;
  align?: "left" | "right" | "center";
  format?: (val: number | string | null) => string;
  removable?: boolean;
}

export const CORE_COLUMNS: ColumnDef[] = [
  { key: "disc_year", label: "Year", align: "center" },
  { key: "disc_facility", label: "Facility", align: "left" },
  { key: "pl_name", label: "Planet", align: "left" },
  {
    key: "pl_rade",
    label: "Radius (R⊕)",
    align: "right",
    format: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "pl_orbper",
    label: "Orb. Period (d)",
    align: "right",
    format: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
  {
    key: "pl_masse",
    label: "Mass (M⊕)",
    align: "right",
    format: (v) => (v == null ? "—" : Number(v).toFixed(2)),
  },
];

export const OPTIONAL_COLUMNS: ColumnDef[] = [
  { key: "hostname", label: "Host Star", align: "left", removable: true },
  { key: "sy_pnum", label: "# Planets", align: "center", removable: true },
  { key: "sy_snum", label: "# Stars", align: "center", removable: true },
];

export interface DataIndex {
  records: Exoplanet[];
  byYear: Map<number, number[]>;
  byFacility: Map<string, number[]>;
  years: number[];
  facilities: string[];
}

export interface QueryParams {
  year: number | null;
  facility: string | null;
}

export type SortDir = "asc" | "desc" | null;

export interface SortState {
  key: ColumnKey | null;
  dir: SortDir;
}
