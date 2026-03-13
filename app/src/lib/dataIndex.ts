import type { DataIndex, Exoplanet, QueryParams } from "@/types/exoplanet";

export function buildIndex(records: Exoplanet[]): DataIndex {
  const byYear = new Map<number, number[]>();
  const byFacility = new Map<string, number[]>();
  const yearSet = new Set<number>();
  const facilitySet = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    const r = records[i];

    if (r.disc_year !== null) {
      if (!byYear.has(r.disc_year)) byYear.set(r.disc_year, []);
      byYear.get(r.disc_year)!.push(i);
      yearSet.add(r.disc_year);
    }

    if (r.disc_facility) {
      if (!byFacility.has(r.disc_facility)) byFacility.set(r.disc_facility, []);
      byFacility.get(r.disc_facility)!.push(i);
      facilitySet.add(r.disc_facility);
    }
  }

  return {
    records,
    byYear,
    byFacility,
    years: [...yearSet].sort((a, b) => a - b),
    facilities: [...facilitySet].sort(),
  };
}

export function queryIndex(index: DataIndex, params: QueryParams): Exoplanet[] {
  const { year, facility } = params;
  if (year === null && facility === null) return [];

  let indices: number[];

  if (year !== null && facility !== null) {
    const yearIdx = index.byYear.get(year) ?? [];
    const facilityIdx = index.byFacility.get(facility) ?? [];
    if (yearIdx.length === 0 || facilityIdx.length === 0) return [];

    const [smaller, larger] =
      yearIdx.length <= facilityIdx.length
        ? [yearIdx, new Set(facilityIdx)]
        : [facilityIdx, new Set(yearIdx)];

    indices = (smaller as number[]).filter((i) => (larger as Set<number>).has(i));
  } else if (year !== null) {
    indices = index.byYear.get(year) ?? [];
  } else {
    indices = index.byFacility.get(facility!) ?? [];
  }

  return indices.map((i) => index.records[i]);
}
