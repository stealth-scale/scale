import { type VirtualItem } from "@tanstack/react-virtual";
import { describe, expect, it } from "vitest";

import { BRANCHED, EXPANDING, FOOTED, GROUPED, tableOf } from "#data-table/data-table.fixtures.tsx";
import { boxed, untyped } from "#data-table/windowed.fixtures.ts";
import {
  endedOf,
  focusedKeyOf,
  keeping,
  lineAt,
  placementOf,
  regionLinesOf,
  replaced,
  rowCountOf,
  sheetOf,
  slotsOf,
  UNPLACED,
} from "#data-table/windowed.ts";

/**
 * Returns the window's items at the indexes given, each 40 pixels tall after the margin.
 */
function itemsAt(indexes: readonly number[], margin = 0): VirtualItem[] {
  return indexes.map((index) => ({
    end: margin + (index + 1) * 40,
    index,
    key: index,
    lane: 0,
    size: 40,
    start: margin + index * 40,
  }));
}

/**
 * Returns each slot as a line's index or a spacer's size.
 */
function readOf(items: readonly VirtualItem[], margin: number, total: number): string[] {
  return slotsOf(items, margin, total).map((slot) =>
    slot.kind === "line" ? `line ${String(slot.item.index)}` : `spacer ${String(slot.size)}`,
  );
}

describe("windowed", () => {
  it("returns a record line per row between the pinned regions", () => {
    const { center } = regionLinesOf(untyped(tableOf()));

    expect([center.length, center[0]?.key]).toStrictEqual([12, "record:Account 01"]);
  });

  it("adds a detail line under an expanded row while a column renders details", () => {
    const table = tableOf({
      columns: EXPANDING,
      initialState: { expanded: { "Account 02": true } },
    });

    expect(
      regionLinesOf(untyped(table))
        .center.slice(1, 3)
        .map((line) => line.key),
    ).toStrictEqual(["record:Account 02", "detail:Account 02"]);
  });

  it("marks a detail line as the detail", () => {
    const table = tableOf({
      columns: EXPANDING,
      initialState: { expanded: { "Account 02": true } },
    });

    expect(regionLinesOf(untyped(table)).center[2]?.detail).toBe(true);
  });

  it("adds no detail line while no column renders details", () => {
    const table = tableOf({ initialState: { expanded: { "Account 02": true } } });

    expect(regionLinesOf(untyped(table)).center).toHaveLength(12);
  });

  it("adds the sub-rows of an expanded row as record lines", () => {
    const table = tableOf({ ...BRANCHED, initialState: { expanded: { North: true } } });

    expect(regionLinesOf(untyped(table)).center.map((line) => line.key)).toStrictEqual([
      "record:North",
      "record:Oslo",
      "record:Bergen",
      "record:South",
      "record:Central",
    ]);
  });

  it("adds a line under an expanded row that waits for its sub-rows", () => {
    const table = tableOf({
      ...BRANCHED,
      getRowCanExpand: () => true,
      initialState: { expanded: { Central: true } },
    });

    expect(
      regionLinesOf(untyped(table))
        .center.slice(-2)
        .map((line) => line.key),
    ).toStrictEqual(["record:Central", "detail:Central"]);
  });

  it("puts the rows pinned to the top and to the bottom in their regions", () => {
    const table = tableOf({
      initialState: { rowPinning: { bottom: ["Account 01"], top: ["Account 05"] } },
    });
    const { bottom, center, top } = regionLinesOf(untyped(table));

    expect([top[0]?.key, center.length, bottom[0]?.key]).toStrictEqual([
      "record:Account 05",
      10,
      "record:Account 01",
    ]);
  });

  it("counts the header row and every line", () => {
    const table = untyped(tableOf());

    expect(rowCountOf(table, regionLinesOf(table))).toBe(13);
  });

  it("counts the empty row of a table without rows", () => {
    const table = untyped(tableOf({ data: [] }));

    expect(rowCountOf(table, regionLinesOf(table))).toBe(2);
  });

  it("counts the footer row while a column states a footer", () => {
    const table = untyped(tableOf({ columns: FOOTED }));

    expect(rowCountOf(table, regionLinesOf(table))).toBe(14);
  });

  it("counts every header row of grouped columns", () => {
    const table = untyped(tableOf({ columns: GROUPED }));

    expect(rowCountOf(table, regionLinesOf(table))).toBe(14);
  });

  it("returns the line at an index", () => {
    expect(lineAt(regionLinesOf(untyped(tableOf())).center, 3).key).toBe("record:Account 04");
  });

  it("returns the key of the line that contains an element", () => {
    const row = document.createElement("tr");
    const control = document.createElement("button");

    row.dataset["key"] = "record:Account 04";
    row.append(control);

    expect(focusedKeyOf(control)).toBe("record:Account 04");
  });

  it("returns undefined for an element outside every line", () => {
    expect(focusedKeyOf(document.createElement("button"))).toBeUndefined();
  });

  it.each([
    { kept: [-1], want: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
    { kept: [12], want: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
    { kept: [3], want: [3, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    { kept: [40], want: [8, 9, 10, 11, 12, 13, 14, 15, 16, 40] },
    { kept: [40, 3], want: [3, 8, 9, 10, 11, 12, 13, 14, 15, 16, 40] },
    { kept: [3, 3], want: [3, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  ])("returns $want for lines 10 to 14 when lines $kept are kept", ({ kept, want }) => {
    expect(keeping(kept)({ count: 100, endIndex: 14, overscan: 2, startIndex: 10 })).toStrictEqual(
      want,
    );
  });

  it("returns false before the window measures the viewport", () => {
    expect(endedOf(null, 8, 100)).toBe(false);
  });

  it.each([
    { endIndex: 91, want: true },
    { endIndex: 90, want: false },
  ])("returns $want when the lines in view end at $endIndex", ({ endIndex, want }) => {
    expect(endedOf({ endIndex }, 8, 100)).toBe(want);
  });

  it("renders the lines from the first without a spacer before them", () => {
    expect(readOf(itemsAt([0, 1, 2]), 0, 400)).toStrictEqual([
      "line 0",
      "line 1",
      "line 2",
      "spacer 280",
    ]);
  });

  it("renders one spacer before a line of an odd index", () => {
    expect(readOf(itemsAt([3, 4]), 0, 400)).toStrictEqual([
      "spacer 120",
      "line 3",
      "line 4",
      "spacer 200",
    ]);
  });

  it("renders a second spacer 0 pixels tall before a line of an even index", () => {
    expect(readOf(itemsAt([4, 5]), 0, 400)).toStrictEqual([
      "spacer 160",
      "spacer 0",
      "line 4",
      "line 5",
      "spacer 160",
    ]);
  });

  it("renders the spacers between a kept line and the lines in view", () => {
    expect(readOf(itemsAt([1, 10, 11]), 0, 480)).toStrictEqual([
      "spacer 40",
      "line 1",
      "spacer 320",
      "spacer 0",
      "line 10",
      "line 11",
    ]);
  });

  it("subtracts the margin from each line's start", () => {
    expect(readOf(itemsAt([3, 4], 37), 37, 400)).toStrictEqual([
      "spacer 120",
      "line 3",
      "line 4",
      "spacer 200",
    ]);
  });

  it("renders no spacer after the last line", () => {
    expect(readOf(itemsAt([8, 9]), 0, 400).at(-1)).toBe("line 9");
  });

  it("keys the spacer after the lines apart from the spacers before them", () => {
    const slots = slotsOf(itemsAt([3]), 0, 400);

    expect(slots.map((slot) => (slot.kind === "spacer" ? slot.key : "line"))).toStrictEqual([
      "spacer:0",
      "line",
      "spacer:end",
    ]);
  });

  it("returns the table a row group renders in", () => {
    const sheet = document.createElement("table");
    const body = sheet.createTBody();

    expect(sheetOf(body)).toBe(sheet);
  });

  it("measures the header's height and the region's offset in the viewport's content", () => {
    const viewport = document.createElement("div");
    const sheet = document.createElement("table");

    sheet.createTHead();
    viewport.append(sheet);
    viewport.scrollTop = 100;
    boxed({
      div: new DOMRect(0, 20, 400, 400),
      tbody: new DOMRect(0, 60, 400, 400),
      thead: new DOMRect(0, 20, 400, 37.5),
    });

    expect(placementOf(sheet.createTBody(), viewport)).toStrictEqual({ head: 37.5, margin: 140 });
  });

  it("returns the placement in state while a new measure equals it", () => {
    expect(replaced(UNPLACED, { head: 0, margin: 0 })).toBe(UNPLACED);
  });

  it("returns the new measure while it differs from the placement in state", () => {
    const measured = { head: 37, margin: 37 };

    expect(replaced(UNPLACED, measured)).toBe(measured);
  });
});
