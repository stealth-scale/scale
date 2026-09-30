import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { useWindowed, type WindowedOptions } from "#data-table/use-windowed.ts";
import { untyped } from "#data-table/windowed.fixtures.ts";

/**
 * Returns the options of a windowed table, each unstated.
 */
function optionsOf(given: Partial<WindowedOptions> = {}): WindowedOptions {
  return {
    estimateSize: undefined,
    onEndReached: undefined,
    overscan: undefined,
    stickyHeader: undefined,
    windowed: true,
    ...given,
  };
}

describe("useWindowed", () => {
  it("returns no row count and no windowing for a table that is not windowed", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf({ windowed: false })));

    expect(result.current).toStrictEqual({ count: undefined, scroller: {}, windowing: undefined });
  });

  it("counts the header row and every row of a windowed table", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    expect(result.current.count).toBe(13);
  });

  it("sticks the header of a windowed table", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    expect(result.current.scroller.stickyHeader).toBe(true);
  });

  it("takes an estimate of 40 and an overscan of 8 unless stated", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    expect([
      result.current.windowing?.estimateSize,
      result.current.windowing?.overscan,
    ]).toStrictEqual([40, 8]);
  });

  it("takes the estimate and the overscan the caller states", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() =>
      useWindowed(table, optionsOf({ estimateSize: 24, overscan: 2 })),
    );

    expect([
      result.current.windowing?.estimateSize,
      result.current.windowing?.overscan,
    ]).toStrictEqual([24, 2]);
  });

  it("counts the header rows before the body's rows", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    expect(result.current.windowing?.head).toBe(1);
  });

  it("states the header stuck unless the caller turns stickyHeader off", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    expect(result.current.windowing?.stuck).toBe(true);
  });

  it("states the header unstuck when the caller turns stickyHeader off", () => {
    const table = untyped(tableOf());
    const { result } = renderHook(() => useWindowed(table, optionsOf({ stickyHeader: false })));

    expect(result.current.windowing?.stuck).toBe(false);
  });

  it("passes the viewport the scroller's ref stores to the windowing", () => {
    const table = untyped(tableOf());
    const viewport = document.createElement("div");
    const { result } = renderHook(() => useWindowed(table, optionsOf()));

    act(() => {
      result.current.scroller.viewportRef?.(viewport);
    });

    expect(result.current.windowing?.viewport).toBe(viewport);
  });
});
