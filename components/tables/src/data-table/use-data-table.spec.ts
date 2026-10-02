import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ENTRIES,
  type Entry,
  optionsOf,
  rightToLeft,
  tableOf,
} from "#data-table/data-table.fixtures.tsx";
import { type DataTableOptions, useDataTable } from "#data-table/use-data-table.ts";

/**
 * Focuses the second row's amount, passes a new data array, and returns the focused cell's id
 * after the reset TanStack schedules when it builds the core row model again, which it skips on
 * the model's first build.
 */
async function focusedAfterNewData(
  given: Partial<DataTableOptions<Entry>>,
): Promise<string | undefined> {
  const { rerender, result } = renderHook(
    ({ data }: { readonly data: readonly Entry[] }) => useDataTable(optionsOf({ data, ...given })),
    { initialProps: { data: ENTRIES } },
  );

  act(() => {
    result.current.getRowModel();
    result.current.setFocusedCell("Account 02", "amount");
  });
  act(() => {
    rerender({ data: [...ENTRIES] });
  });
  await act(async () => {
    result.current.getRowModel();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });

  return result.current.getFocusedCell()?.id;
}

describe("useDataTable", () => {
  it("shows every row on one page when no page size is stated", () => {
    expect(tableOf().getRowModel().rows).toHaveLength(ENTRIES.length);
  });

  it("shows the page size the caller states in initialState", () => {
    const table = tableOf({ initialState: { pagination: { pageIndex: 0, pageSize: 5 } } });

    expect(table.getRowModel().rows).toHaveLength(5);
  });

  it("keeps the caller's other initial state beside the page state", () => {
    const table = tableOf({ initialState: { sorting: [{ desc: true, id: "amount" }] } });

    expect(table.getRowModel().rows[0]?.original.amount).toBe(1100);
  });

  it("sorts a numeric column ascending on its first toggle", () => {
    const { result } = renderHook(() => useDataTable(optionsOf()));

    act(() => {
      result.current.getColumn("amount")?.toggleSorting();
    });

    expect(result.current.state.sorting).toStrictEqual([{ desc: false, id: "amount" }]);
  });

  it("sorts descending first when the caller states sortDescFirst", () => {
    const { result } = renderHook(() => useDataTable(optionsOf({ sortDescFirst: true })));

    act(() => {
      result.current.getColumn("amount")?.toggleSorting();
    });

    expect(result.current.state.sorting).toStrictEqual([{ desc: true, id: "amount" }]);
  });

  it("resizes no column unless the caller turns resizing on", () => {
    expect(tableOf().getColumn("amount")?.getCanResize()).toBe(false);
  });

  it("resizes a column once the caller states enableColumnResizing", () => {
    expect(tableOf({ enableColumnResizing: true }).getColumn("amount")?.getCanResize()).toBe(true);
  });

  it("resizes a column while the pointer drags", () => {
    expect(tableOf().options.columnResizeMode).toBe("onChange");
  });

  it("groups by no column unless the caller turns grouping on", () => {
    expect(tableOf().getColumn("region")?.getCanGroup()).toBe(false);
  });

  it("groups by a column once the caller states enableGrouping", () => {
    expect(tableOf({ enableGrouping: true }).getColumn("region")?.getCanGroup()).toBe(true);
  });

  it("resizes left to right outside a locale provider", () => {
    expect(tableOf().options.columnResizeDirection).toBe("ltr");
  });

  it("resizes in the locale provider's direction", () => {
    const { result } = renderHook(() => useDataTable(optionsOf()), { wrapper: rightToLeft });

    expect(result.current.options.columnResizeDirection).toBe("rtl");
  });

  it("keeps the columnResizeDirection the caller states over the locale's", () => {
    const { result } = renderHook(() => useDataTable(optionsOf({ columnResizeDirection: "ltr" })), {
      wrapper: rightToLeft,
    });

    expect(result.current.options.columnResizeDirection).toBe("ltr");
  });

  it("keeps the focused cell when data changes", async () => {
    await expect(focusedAfterNewData({})).resolves.toBe("Account 02_amount");
  });

  it("clears the focused cell when data changes under autoResetCellSelection", async () => {
    await expect(focusedAfterNewData({ autoResetCellSelection: true })).resolves.toBeUndefined();
  });

  it("returns a new table after a change of state", () => {
    const { result } = renderHook(() => useDataTable(optionsOf()));
    const before = result.current;

    act(() => {
      result.current.getColumn("amount")?.toggleSorting();
    });

    expect(result.current).not.toBe(before);
  });
});
