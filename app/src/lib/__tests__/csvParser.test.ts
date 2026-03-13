import { describe, it, expect } from "vitest";
import { parseCSV, rowToExoplanet } from "@/lib/csvParser";

describe("parseCSV", () => {
  it("returns empty array when input is empty", () => {
    expect(parseCSV("")).toEqual([]);
  });

  it("returns empty array when only header row exists", () => {
    expect(parseCSV("name,year")).toEqual([]);
  });

  it("parses basic CSV into array of objects", () => {
    const csv = "name,year\nEarth b,2020\nMars c,2021";
    expect(parseCSV(csv)).toEqual([
      { name: "Earth b", year: "2020" },
      { name: "Mars c", year: "2021" },
    ]);
  });

  it("handles Windows line endings (CRLF)", () => {
    const csv = "name,year\r\nEarth b,2020\r\nMars c,2021";
    expect(parseCSV(csv)).toEqual([
      { name: "Earth b", year: "2020" },
      { name: "Mars c", year: "2021" },
    ]);
  });

  it("handles quoted fields containing commas", () => {
    const csv = 'name,facility\n"Planet X","Big, Observatory"';
    expect(parseCSV(csv)).toEqual([{ name: "Planet X", facility: "Big, Observatory" }]);
  });

  it("handles escaped quotes inside quoted fields", () => {
    const csv = 'name\n"Planet ""X"""';
    expect(parseCSV(csv)).toEqual([{ name: 'Planet "X"' }]);
  });

  it("skips empty lines between data rows", () => {
    const csv = "name\nEarth b\n\nMars c";
    expect(parseCSV(csv)).toHaveLength(2);
  });

  it("trims whitespace from field values", () => {
    const csv = "name , year\n Earth b , 2020 ";
    const result = parseCSV(csv);
    expect(result[0]["name"]).toBe("Earth b");
    expect(result[0]["year"]).toBe("2020");
  });
});

describe("rowToExoplanet", () => {
  const fullRow = {
    pl_name: "Kepler-1b",
    disc_facility: "Kepler",
    hostname: "Kepler-1",
    disc_year: "2009",
    pl_rade: "1.5",
    pl_orbper: "3.22",
    pl_masse: "10.0",
    sy_pnum: "3",
    sy_snum: "1",
  };

  it("maps all fields to correct types", () => {
    expect(rowToExoplanet(fullRow)).toEqual({
      pl_name: "Kepler-1b",
      disc_facility: "Kepler",
      hostname: "Kepler-1",
      disc_year: 2009,
      pl_rade: 1.5,
      pl_orbper: 3.22,
      pl_masse: 10.0,
      sy_pnum: 3,
      sy_snum: 1,
    });
  });

  it("returns null for empty numeric fields", () => {
    const row = { ...fullRow, disc_year: "", pl_rade: "", pl_orbper: "", pl_masse: "" };
    const planet = rowToExoplanet(row);
    expect(planet.disc_year).toBeNull();
    expect(planet.pl_rade).toBeNull();
    expect(planet.pl_orbper).toBeNull();
    expect(planet.pl_masse).toBeNull();
  });

  it("returns null for non-numeric string values", () => {
    const row = { ...fullRow, disc_year: "N/A", pl_rade: "unknown" };
    expect(rowToExoplanet(row).disc_year).toBeNull();
    expect(rowToExoplanet(row).pl_rade).toBeNull();
  });

  it("returns empty string for missing pl_name", () => {
    const row = { ...fullRow, pl_name: "" };
    expect(rowToExoplanet(row).pl_name).toBe("");
  });
});
