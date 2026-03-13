import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useColumnManager } from "@/hooks/useColumnManager";
import { CORE_COLUMNS, OPTIONAL_COLUMNS } from "@/types/exoplanet";

describe("useColumnManager", () => {
  it("starts with core columns", () => {
    const { result } = renderHook(() => useColumnManager());
    expect(result.current.columns).toEqual(CORE_COLUMNS);
  });

  it("all optional columns are available initially", () => {
    const { result } = renderHook(() => useColumnManager());
    expect(result.current.available).toEqual(OPTIONAL_COLUMNS);
  });

  it("no columns are removable initially (core columns are permanent)", () => {
    const { result } = renderHook(() => useColumnManager());
    expect(result.current.removable).toHaveLength(0);
  });

  it("add appends column to columns list", () => {
    const { result } = renderHook(() => useColumnManager());
    act(() => result.current.add(OPTIONAL_COLUMNS[0]));
    expect(result.current.columns).toContainEqual(OPTIONAL_COLUMNS[0]);
    expect(result.current.columns).toHaveLength(CORE_COLUMNS.length + 1);
  });

  it("add removes column from available list", () => {
    const { result } = renderHook(() => useColumnManager());
    act(() => result.current.add(OPTIONAL_COLUMNS[0]));
    expect(result.current.available).not.toContainEqual(OPTIONAL_COLUMNS[0]);
    expect(result.current.available).toHaveLength(OPTIONAL_COLUMNS.length - 1);
  });

  it("added column appears in removable", () => {
    const { result } = renderHook(() => useColumnManager());
    act(() => result.current.add(OPTIONAL_COLUMNS[0]));
    expect(result.current.removable).toContainEqual(OPTIONAL_COLUMNS[0]);
  });

  it("remove eliminates column from columns list", () => {
    const { result } = renderHook(() => useColumnManager());
    act(() => result.current.add(OPTIONAL_COLUMNS[0]));
    act(() => result.current.remove(OPTIONAL_COLUMNS[0].key));
    expect(result.current.columns).not.toContainEqual(OPTIONAL_COLUMNS[0]);
    expect(result.current.columns).toHaveLength(CORE_COLUMNS.length);
  });

  it("remove puts column back in available list", () => {
    const { result } = renderHook(() => useColumnManager());
    act(() => result.current.add(OPTIONAL_COLUMNS[0]));
    act(() => result.current.remove(OPTIONAL_COLUMNS[0].key));
    expect(result.current.available).toContainEqual(OPTIONAL_COLUMNS[0]);
  });

  it("can add all optional columns", () => {
    const { result } = renderHook(() => useColumnManager());
    OPTIONAL_COLUMNS.forEach((col) => act(() => result.current.add(col)));
    expect(result.current.available).toHaveLength(0);
    expect(result.current.columns).toHaveLength(CORE_COLUMNS.length + OPTIONAL_COLUMNS.length);
  });

  it("core columns are never in removable", () => {
    const { result } = renderHook(() => useColumnManager());
    OPTIONAL_COLUMNS.forEach((col) => act(() => result.current.add(col)));
    const removableKeys = result.current.removable.map((c) => c.key);
    CORE_COLUMNS.forEach((col) => {
      expect(removableKeys).not.toContain(col.key);
    });
  });
});
