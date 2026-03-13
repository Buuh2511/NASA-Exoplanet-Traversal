import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableSort } from "@/hooks/useTableSort";
import type { Exoplanet } from "@/types/exoplanet";

function makePlanet(name: string, year: number | null, masse: number | null): Exoplanet {
  return {
    pl_name: name,
    disc_year: year,
    disc_facility: "",
    pl_rade: null,
    pl_orbper: null,
    pl_masse: masse,
    hostname: "",
    sy_pnum: null,
    sy_snum: null,
  };
}

const DATA = [makePlanet("C", 2015, 10), makePlanet("A", 2010, 30), makePlanet("B", 2020, null)];

describe("useTableSort", () => {
  it("starts with no sort and returns original data reference", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    expect(result.current.sort).toEqual({ key: null, dir: null });
    expect(result.current.sorted).toBe(DATA);
  });

  it("first toggle on a column sets direction to asc", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    expect(result.current.sort).toEqual({ key: "pl_name", dir: "asc" });
  });

  it("second toggle on same column sets direction to desc", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    act(() => result.current.toggle("pl_name"));
    expect(result.current.sort).toEqual({ key: "pl_name", dir: "desc" });
  });

  it("third toggle on same column clears the sort", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    act(() => result.current.toggle("pl_name"));
    act(() => result.current.toggle("pl_name"));
    expect(result.current.sort).toEqual({ key: null, dir: null });
  });

  it("toggling a different column resets to asc on the new column", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    act(() => result.current.toggle("disc_year"));
    expect(result.current.sort).toEqual({ key: "disc_year", dir: "asc" });
  });

  it("sorts strings ascending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    expect(result.current.sorted.map((p) => p.pl_name)).toEqual(["A", "B", "C"]);
  });

  it("sorts strings descending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    act(() => result.current.toggle("pl_name"));
    expect(result.current.sorted.map((p) => p.pl_name)).toEqual(["C", "B", "A"]);
  });

  it("sorts numbers ascending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("disc_year"));
    expect(result.current.sorted.map((p) => p.disc_year)).toEqual([2010, 2015, 2020]);
  });

  it("sorts numbers descending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("disc_year"));
    act(() => result.current.toggle("disc_year"));
    expect(result.current.sorted.map((p) => p.disc_year)).toEqual([2020, 2015, 2010]);
  });

  it("pushes null values to the end when sorting ascending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_masse"));
    expect(result.current.sorted.map((p) => p.pl_masse)).toEqual([10, 30, null]);
  });

  it("pushes null values to the end when sorting descending", () => {
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_masse"));
    act(() => result.current.toggle("pl_masse"));
    expect(result.current.sorted.map((p) => p.pl_masse)).toEqual([30, 10, null]);
  });

  it("does not mutate the original data array", () => {
    const original = [...DATA];
    const { result } = renderHook(() => useTableSort(DATA));
    act(() => result.current.toggle("pl_name"));
    expect(DATA).toEqual(original);
  });
});
