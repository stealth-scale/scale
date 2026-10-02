import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";

import { type Entry, SELECTING, tabled, tableOf } from "#data-table/data-table.fixtures.tsx";
import {
  cellIdOf,
  gridCellOf,
  gridStepOf,
  revealCorner,
  type Stroke,
  tsvOf,
} from "#data-table/grid.ts";
import { type TableProps } from "#data-table/table.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";
import { untyped } from "#data-table/windowed.fixtures.ts";

/**
 * A keystroke without modifiers in a left-to-right grid of ranges.
 */
const PLAIN: Stroke = { modified: false, ranged: true, rtl: false, shift: false };

/**
 * Renders the ledger as a grid.
 */
async function gridded(
  options: Partial<DataTableOptions<Entry>> = {},
  table: Partial<TableProps> = {},
): Promise<void> {
  await drawn(tabled(options, { grid: true, ...table }));
}

/**
 * Returns the cell of a row and a column written `row/column`, or `null` while it has no marks.
 */
function cellOr(at: string): HTMLElement | null {
  const [row = "", column = ""] = at.split("/");

  return document.querySelector<HTMLElement>(`[data-row="${row}"][data-column="${column}"]`);
}

/**
 * Returns the cell of a row and a column written `row/column`.
 */
function cellOf(at: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the cell it reads
  return cellOr(at) as HTMLElement;
}

/**
 * Returns a cell element's row and column written `row/column`.
 */
function nameOf(cell: HTMLElement): string {
  return `${cell.dataset["row"] ?? ""}/${cell.dataset["column"] ?? ""}`;
}

/**
 * Returns the cell with focus written `row/column`.
 */
function focusedCell(): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a grid case leaves focus on an element
  return nameOf(document.activeElement as HTMLElement);
}

/**
 * Returns the selected cells written `row/column`, in the order they render.
 */
function selectedCells(): string[] {
  return [...document.querySelectorAll<HTMLElement>("[data-column][aria-selected=true]")].map(
    (cell) => nameOf(cell),
  );
}

/**
 * Focuses a cell and presses a key on it.
 *
 * @returns Whether the key's default action proceeds.
 */
function keyedOn(at: string, key: string, init: KeyboardEventInit = {}): boolean {
  act(() => {
    cellOf(at).focus();
  });

  return fireEvent.keyDown(cellOf(at), { key, ...init });
}

/**
 * Presses a cell with the pointer.
 *
 * @returns Whether the press's default action proceeds.
 */
function pressedOn(at: string, init: MouseEventInit = {}): boolean {
  return fireEvent.mouseDown(cellOf(at), init);
}

describe("grid", () => {
  it("returns no accessibility violation for a grid", async () => {
    await expect(
      accessibilityViolations(() => tabled({ columns: SELECTING }, { grid: true })),
    ).resolves.toStrictEqual([]);
  });

  it("states aria-multiselectable on a grid of ranges", async () => {
    await gridded();

    expect(screen.getByRole("grid").getAttribute("aria-multiselectable")).toBe("true");
  });

  it("states aria-multiselectable false while both range options are off", async () => {
    await gridded({ enableCellRangeSelection: false, enableMultiCellRangeSelection: false });

    expect(screen.getByRole("grid").getAttribute("aria-multiselectable")).toBe("false");
  });

  it("gives the first selectable cell the tab stop", async () => {
    await gridded();

    expect([
      cellOf("Account 01/account").tabIndex,
      cellOf("Account 01/region").tabIndex,
    ]).toStrictEqual([0, -1]);
  });

  it("states aria-selected false on a cell at rest", async () => {
    await gridded();

    expect(cellOf("Account 01/account").getAttribute("aria-selected")).toBe("false");
  });

  it("gives the select column's cells no marks", async () => {
    await gridded({ columns: SELECTING });

    expect([cellOr("Account 01/select"), cellOf("Account 01/account").tabIndex]).toStrictEqual([
      null,
      0,
    ]);
  });

  it("gives no cell marks while no cell can be selected", async () => {
    await gridded({ enableCellSelection: false });

    expect(document.querySelector("[data-column]")).toBeNull();
  });

  it("gives no cell marks in a grid without rows", async () => {
    await gridded({ data: [] });

    expect(document.querySelector("[data-column]")).toBeNull();
  });

  it("gives the first rendered cell the tab stop while a filter removes the focused cell's row", async () => {
    await gridded({
      initialState: {
        cellSelection: [
          {
            anchorColumnId: "account",
            anchorRowId: "Account 05",
            focusColumnId: "account",
            focusRowId: "Account 05",
          },
        ],
        globalFilter: "Account 1",
      },
    });

    expect(cellOf("Account 10/account").tabIndex).toBe(0);
  });

  it("gives the pressed cell the tab stop", async () => {
    await gridded();
    pressedOn("Account 03/region");

    expect([
      cellOf("Account 01/account").tabIndex,
      cellOf("Account 03/region").tabIndex,
    ]).toStrictEqual([-1, 0]);
  });

  it.each([
    { from: "Account 01/account", key: "ArrowDown", want: "Account 02/account" },
    { from: "Account 02/account", key: "ArrowUp", want: "Account 01/account" },
    { from: "Account 01/account", key: "ArrowRight", want: "Account 01/region" },
    { from: "Account 01/region", key: "ArrowLeft", want: "Account 01/account" },
    { from: "Account 01/amount", key: "Home", want: "Account 01/account" },
    { from: "Account 01/account", key: "End", want: "Account 01/amount" },
    { from: "Account 01/region", key: "PageDown", want: "Account 11/region" },
    { from: "Account 12/region", key: "PageUp", want: "Account 02/region" },
    { from: "Account 05/region", key: "PageDown", want: "Account 12/region" },
    { from: "Account 03/region", key: "PageUp", want: "Account 01/region" },
  ])("focuses $want on $key from $from", async ({ from, key, want }) => {
    await gridded();
    keyedOn(from, key);

    expect(focusedCell()).toBe(want);
  });

  it.each([
    { init: { ctrlKey: true }, key: "Home", label: "Control", want: "Account 01/account" },
    { init: { metaKey: true }, key: "Home", label: "Meta", want: "Account 01/account" },
    { init: { ctrlKey: true }, key: "End", label: "Control", want: "Account 12/amount" },
  ])("focuses $want on $key with $label", async ({ init, key, want }) => {
    await gridded();
    keyedOn("Account 05/region", key, init);

    expect(focusedCell()).toBe(want);
  });

  it("selects the cell a key moves to", async () => {
    await gridded();
    keyedOn("Account 01/account", "ArrowDown");

    expect(selectedCells()).toStrictEqual(["Account 02/account"]);
  });

  it("moves the tab stop with focus", async () => {
    await gridded();
    keyedOn("Account 01/account", "ArrowDown");

    expect([
      cellOf("Account 01/account").tabIndex,
      cellOf("Account 02/account").tabIndex,
    ]).toStrictEqual([-1, 0]);
  });

  it("cancels a key the grid takes", async () => {
    await gridded();

    expect(keyedOn("Account 01/account", "ArrowDown")).toBe(false);
  });

  it.each([
    { key: "ArrowRight", want: "Account 01/account" },
    { key: "ArrowLeft", want: "Account 01/amount" },
  ])("focuses $want on $key from the region right to left", async ({ key, want }) => {
    await gridded({ columnResizeDirection: "rtl" });
    keyedOn("Account 01/region", key);

    expect(focusedCell()).toBe(want);
  });

  it("moves from the cell with focus while the focused cell is another", async () => {
    await gridded();
    pressedOn("Account 01/account");
    keyedOn("Account 01/region", "ArrowDown");

    expect(focusedCell()).toBe("Account 02/region");
  });

  it("extends the range on Shift with ArrowDown", async () => {
    await gridded();
    keyedOn("Account 01/account", "ArrowDown", { shiftKey: true });

    expect(selectedCells()).toStrictEqual(["Account 01/account", "Account 02/account"]);
  });

  it("keeps focus on the focused cell while the range extends", async () => {
    await gridded();
    keyedOn("Account 01/account", "ArrowDown", { shiftKey: true });

    expect(focusedCell()).toBe("Account 01/account");
  });

  it("extends the range from the pressed cell", async () => {
    await gridded();
    pressedOn("Account 01/account");
    fireEvent.keyDown(cellOf("Account 01/account"), { key: "ArrowRight", shiftKey: true });

    expect(selectedCells()).toStrictEqual(["Account 01/account", "Account 01/region"]);
  });

  it("scrolls the range's moving corner into view", async () => {
    await gridded();
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");

    keyedOn("Account 01/account", "ArrowDown", { shiftKey: true });

    expect(scroll.mock.contexts.at(-1)).toBe(cellOf("Account 02/account"));
    expect(scroll.mock.lastCall).toStrictEqual([{ block: "nearest", inline: "nearest" }]);
  });

  it("moves on Shift with ArrowDown in a grid without ranges", async () => {
    await gridded({ enableCellRangeSelection: false });
    keyedOn("Account 01/account", "ArrowDown", { shiftKey: true });

    expect(selectedCells()).toStrictEqual(["Account 02/account"]);
  });

  it.each(["a", "A"])("selects every cell on Control with %s", async (key) => {
    await gridded();
    keyedOn("Account 05/region", key, { ctrlKey: true });

    expect(selectedCells()).toHaveLength(36);
  });

  it("focuses the first cell on Control with A", async () => {
    await gridded();
    keyedOn("Account 05/region", "a", { ctrlKey: true });

    expect(focusedCell()).toBe("Account 01/account");
  });

  it("collapses the range to the focused cell on Escape", async () => {
    await gridded();
    keyedOn("Account 01/account", "ArrowDown", { shiftKey: true });
    fireEvent.keyDown(cellOf("Account 01/account"), { key: "Escape" });

    expect(selectedCells()).toStrictEqual(["Account 01/account"]);
  });

  it.each([
    { init: { altKey: true }, key: "ArrowDown", label: "ArrowDown with Alt" },
    { init: { ctrlKey: true }, key: "ArrowDown", label: "ArrowDown with Control" },
    { init: {}, key: "a", label: "A without Control" },
    { init: {}, key: "x", label: "a key the grid does not take" },
  ])("leaves $label to the browser", async ({ init, key }) => {
    await gridded();

    expect(keyedOn("Account 01/account", key, init)).toBe(true);
  });

  it("leaves Control with A to the browser in a grid without ranges", async () => {
    await gridded({ enableCellRangeSelection: false });

    expect(keyedOn("Account 01/account", "a", { ctrlKey: true })).toBe(true);
  });

  it("leaves a key outside the cells to the browser", async () => {
    await gridded();
    const header = screen.getByRole("columnheader", { name: "Region" });

    expect(fireEvent.keyDown(header, { key: "ArrowDown" })).toBe(true);
  });

  it("selects the pressed cell", async () => {
    await gridded();
    pressedOn("Account 03/region");

    expect(selectedCells()).toStrictEqual(["Account 03/region"]);
  });

  it("focuses the pressed cell without scrolling", async () => {
    await gridded();
    const focus = vi.spyOn(HTMLElement.prototype, "focus");

    pressedOn("Account 03/region");

    expect([focusedCell(), focus.mock.lastCall]).toStrictEqual([
      "Account 03/region",
      [{ preventScroll: true }],
    ]);
  });

  it("cancels the default action of a press", async () => {
    await gridded();

    expect(pressedOn("Account 03/region")).toBe(false);
  });

  it("clears the page's text selection on a press", async () => {
    await gridded();
    const words = document.createRange();

    words.selectNodeContents(screen.getByText("Ledger"));
    document.getSelection()?.addRange(words);
    pressedOn("Account 03/region");

    expect(document.getSelection()?.rangeCount).toBe(0);
  });

  it("extends the range on Shift with a press", async () => {
    await gridded();
    pressedOn("Account 01/account");
    pressedOn("Account 02/region", { shiftKey: true });

    expect(selectedCells()).toStrictEqual([
      "Account 01/account",
      "Account 01/region",
      "Account 02/account",
      "Account 02/region",
    ]);
  });

  it("keeps focus on the range's anchor on Shift with a press", async () => {
    await gridded();
    pressedOn("Account 01/account");
    pressedOn("Account 02/region", { shiftKey: true });

    expect(focusedCell()).toBe("Account 01/account");
  });

  it("adds a range on Control with a press", async () => {
    await gridded();
    pressedOn("Account 01/account");
    pressedOn("Account 03/amount", { ctrlKey: true });

    expect(selectedCells()).toStrictEqual(["Account 01/account", "Account 03/amount"]);
  });

  it("extends a dragged range to the cell the pointer enters", async () => {
    await gridded();
    pressedOn("Account 01/account");
    fireEvent.mouseEnter(cellOf("Account 02/region"));

    expect(selectedCells()).toHaveLength(4);
  });

  it("states the sides of the selected cells on the selection's edge", async () => {
    await gridded();
    pressedOn("Account 01/account");
    pressedOn("Account 02/region", { shiftKey: true });

    expect([
      cellOf("Account 01/account").dataset["edges"],
      cellOf("Account 02/region").dataset["edges"],
    ]).toStrictEqual(["block-start inline-start", "inline-end block-end"]);
  });

  it("states all four sides of a lone selected cell", async () => {
    await gridded();
    pressedOn("Account 03/region");

    expect(cellOf("Account 03/region").dataset["edges"]).toBe(
      "block-start inline-end block-end inline-start",
    );
  });

  it("states no side of a cell inside the selection", async () => {
    await gridded();
    pressedOn("Account 01/account");
    pressedOn("Account 03/amount", { shiftKey: true });

    expect([
      cellOf("Account 02/region").getAttribute("aria-selected"),
      cellOf("Account 02/region").dataset["edges"],
    ]).toStrictEqual(["true", undefined]);
  });

  it.each([
    { give: [[["=SUM(A1)"]]], label: "a formula after a quote", want: "'=SUM(A1)" },
    { give: [[["+1"]]], label: "a text that opens with + after a quote", want: "'+1" },
    { give: [[["-2"]]], label: "a text that opens with - after a quote", want: "'-2" },
    { give: [[["@name"]]], label: "a text that opens with @ after a quote", want: "'@name" },
    { give: [[[" =1"]]], label: "a formula after a space after a quote", want: "' =1" },
    { give: [[[-2]]], label: "a negative number without a quote", want: "-2" },
    { give: [[["a\tb"]]], label: "a text with a tab in quotes", want: '"a\tb"' },
    { give: [[["one\ntwo"]]], label: "a text with a line break in quotes", want: '"one\ntwo"' },
    { give: [[['say "hi"']]], label: "a quote inside quotes twice", want: '"say ""hi"""' },
    { give: [[[null, 3]]], label: "a missing value as an empty field", want: "\t3" },
    { give: [[["a"], ["b"]]], label: "a line break between rows", want: "a\nb" },
    { give: [[["a"]], [["b"]]], label: "a blank line between regions", want: "a\n\nb" },
  ])("writes $label", ({ give, want }) => {
    expect(tsvOf(give)).toBe(want);
  });

  it.each([
    { key: "End", stroke: { ...PLAIN, modified: true } },
    { key: "PageDown", stroke: PLAIN },
  ])("leaves the focused cell unset on $key in a table without rows", ({ key, stroke }) => {
    const table = untyped(tableOf({ data: [] }));

    act(() => {
      gridStepOf(key, stroke)?.run(table, { columnId: "account", rowId: "Account 01" });
    });

    expect(table.getFocusedCell()).toBeUndefined();
  });

  it("leaves the focused cell unset on Home in a row without a selectable cell", () => {
    const table = untyped(tableOf({ enableCellSelection: false }));

    act(() => {
      gridStepOf("Home", PLAIN)?.run(table, { columnId: "account", rowId: "Account 01" });
    });

    expect(table.getFocusedCell()).toBeUndefined();
  });

  it("returns no step for a key the grid does not take", () => {
    expect(gridStepOf("x", PLAIN)).toBeUndefined();
  });

  it.each([
    { label: "a target that is not an element", target: null },
    { label: "an element outside a cell", target: document.body },
  ])("returns no cell for $label", ({ target }) => {
    expect(gridCellOf(target)).toBeUndefined();
  });

  it("returns no cell for a control inside a cell", async () => {
    await gridded();
    const control = document.createElement("input");

    cellOf("Account 01/region").append(control);

    expect([gridCellOf(control), gridCellOf(cellOf("Account 01/region"))]).toStrictEqual([
      undefined,
      { columnId: "region", rowId: "Account 01" },
    ]);
  });

  it("scrolls nothing without a selection", () => {
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");

    revealCorner(untyped(tableOf()), document, "grid");

    expect(scroll).not.toHaveBeenCalled();
  });

  it("scrolls nothing while the corner's row does not render", () => {
    const table = untyped(tableOf());
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");

    act(() => {
      table.setFocusedCell("Account 03", "amount");
    });
    revealCorner(table, document, "grid");

    expect(scroll).not.toHaveBeenCalled();
  });

  it("encodes the colons inside ids so two cells never share an id", () => {
    expect([
      cellIdOf("p", { columnId: "b", rowId: "a:1" }),
      cellIdOf("p", { columnId: "1:b", rowId: "a" }),
    ]).toStrictEqual(["p-cell-a%3A1:b", "p-cell-a:1%3Ab"]);
  });
});
