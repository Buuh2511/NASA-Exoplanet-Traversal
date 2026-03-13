import { describe, it, expect } from "vitest";
import { buildIndex, queryIndex } from "@/lib/dataIndex";
import type { Exoplanet } from "@/types/exoplanet";

function makePlanet(overrides: Partial<Exoplanet> = {}): Exoplanet {
  return {
    pl_name: "Test-b",
    disc_year: 2000,
    disc_facility: "Test Observatory",
    pl_rade: null,
    pl_orbper: null,
    pl_masse: null,
    hostname: "Test",
    sy_pnum: null,
    sy_snum: null,
    ...overrides,
  };
}

describe("buildIndex", () => {
  it("indexes records by year with correct indices", () => {
    const planets = [
      makePlanet({ pl_name: "A", disc_year: 2010 }),
      makePlanet({ pl_name: "B", disc_year: 2010 }),
      makePlanet({ pl_name: "C", disc_year: 2015 }),
    ];
    const index = buildIndex(planets);
    expect(index.byYear.get(2010)).toEqual([0, 1]);
    expect(index.byYear.get(2015)).toEqual([2]);
  });

  it("indexes records by facility with correct indices", () => {
    const planets = [
      makePlanet({ pl_name: "A", disc_facility: "NASA" }),
      makePlanet({ pl_name: "B", disc_facility: "ESA" }),
      makePlanet({ pl_name: "C", disc_facility: "NASA" }),
    ];
    const index = buildIndex(planets);
    expect(index.byFacility.get("NASA")).toEqual([0, 2]);
    expect(index.byFacility.get("ESA")).toEqual([1]);
  });

  it("returns years sorted in ascending order", () => {
    const planets = [
      makePlanet({ disc_year: 2015 }),
      makePlanet({ disc_year: 2000 }),
      makePlanet({ disc_year: 2010 }),
    ];
    expect(buildIndex(planets).years).toEqual([2000, 2010, 2015]);
  });

  it("returns facilities sorted alphabetically", () => {
    const planets = [
      makePlanet({ disc_facility: "NASA" }),
      makePlanet({ disc_facility: "ESA" }),
      makePlanet({ disc_facility: "JAXA" }),
    ];
    expect(buildIndex(planets).facilities).toEqual(["ESA", "JAXA", "NASA"]);
  });

  it("excludes records with null disc_year from year index", () => {
    const planets = [makePlanet({ disc_year: null })];
    const index = buildIndex(planets);
    expect(index.byYear.size).toBe(0);
    expect(index.years).toEqual([]);
  });

  it("excludes records with empty disc_facility from facility index", () => {
    const planets = [makePlanet({ disc_facility: "" })];
    const index = buildIndex(planets);
    expect(index.byFacility.size).toBe(0);
    expect(index.facilities).toEqual([]);
  });

  it("preserves all records in index.records", () => {
    const planets = [makePlanet({ pl_name: "A" }), makePlanet({ pl_name: "B" })];
    expect(buildIndex(planets).records).toBe(planets);
  });
});

describe("queryIndex", () => {
  const planets = [
    makePlanet({ pl_name: "A", disc_year: 2010, disc_facility: "NASA" }),
    makePlanet({ pl_name: "B", disc_year: 2010, disc_facility: "ESA" }),
    makePlanet({ pl_name: "C", disc_year: 2015, disc_facility: "NASA" }),
  ];
  const index = buildIndex(planets);

  it("returns empty array when both params are null", () => {
    expect(queryIndex(index, { year: null, facility: null })).toEqual([]);
  });

  it("filters by year only", () => {
    const result = queryIndex(index, { year: 2010, facility: null });
    expect(result.map((p) => p.pl_name)).toEqual(["A", "B"]);
  });

  it("filters by facility only", () => {
    const result = queryIndex(index, { year: null, facility: "NASA" });
    expect(result.map((p) => p.pl_name)).toEqual(["A", "C"]);
  });

  it("filters by both year and facility (AND logic)", () => {
    const result = queryIndex(index, { year: 2010, facility: "NASA" });
    expect(result.map((p) => p.pl_name)).toEqual(["A"]);
  });

  it("returns empty for year with no matches", () => {
    expect(queryIndex(index, { year: 1999, facility: null })).toEqual([]);
  });

  it("returns empty for facility with no matches", () => {
    expect(queryIndex(index, { year: null, facility: "JAXA" })).toEqual([]);
  });

  it("returns empty when year+facility combination has no overlap", () => {
    expect(queryIndex(index, { year: 2015, facility: "ESA" })).toEqual([]);
  });
});
