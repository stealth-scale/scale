import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  CHOOSING,
  COLUMNS,
  EDITING,
  ENTRIES,
  type Entry,
  SELECTING,
  tabled,
} from "#data-table/data-table.fixtures.tsx";
import { type TableProps } from "#data-table/table.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";
import { type CellEditEvent } from "#data-table/use-grid.tsx";

/**
 * Returns the cell of a row and a column.
 */
function cellOf(row: string, column: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the cell it reads
  return document.querySelector(`[data-row="${row}"][data-column="${column}"]`) as HTMLElement;
}

/**
 * Renders the ledger as a grid whose region and amount edit, and returns the edit spy.
 */
async function edited(
  options: Partial<DataTableOptions<Entry>> = {},
  table: Partial<TableProps> = {},
): Promise<ReturnType<typeof vi.fn<(edit: CellEditEvent) => void>>> {
  const onCellEdit = vi.fn<(edit: CellEditEvent) => void>();

  await drawn(tabled({ columns: EDITING, ...options }, { grid: true, onCellEdit, ...table }));

  return onCellEdit;
}

/**
 * Focuses a cell and presses a key on it.
 *
 * @returns Whether the key's default action proceeds.
 */
function keyedOn(row: string, column: string, key: string, init: KeyboardEventInit = {}): boolean {
  act(() => {
    cellOf(row, column).focus();
  });

  return fireEvent.keyDown(cellOf(row, column), { key, ...init });
}

/**
 * Returns the open editor's text field.
 */
function field(name = "Edit Amount"): HTMLInputElement {
  return screen.getByRole("textbox", { name });
}

/**
 * Returns the cell with focus written `row/column`.
 */
function focusedCell(): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a grid case leaves focus on an element
  const { dataset } = document.activeElement as HTMLElement;

  return `${dataset["row"] ?? ""}/${dataset["column"] ?? ""}`;
}

/**
 * Opens the second row's amount, types a text and presses a key in the field.
 */
function typedInto(text: string, key: string, init: KeyboardEventInit = {}): void {
  keyedOn("Account 02", "amount", "Enter");
  fireEvent.change(field(), { target: { value: text } });
  fireEvent.keyDown(field(), { key, ...init });
}

describe("useGrid", () => {
  it.each(["Enter", "F2"])("opens an editor with the cell's value on %s", async (key) => {
    await edited();
    keyedOn("Account 02", "amount", key);

    expect([field().value, document.activeElement]).toStrictEqual(["700", field()]);
  });

  it("opens an editor with the character typed on a cell", async () => {
    await edited();
    keyedOn("Account 02", "amount", "5");

    expect(field().value).toBe("5");
  });

  it("opens an empty editor on Backspace", async () => {
    await edited();
    keyedOn("Account 02", "amount", "Backspace");

    expect(field().value).toBe("");
  });

  it("opens the editor on a double click", async () => {
    await edited();
    fireEvent.doubleClick(cellOf("Account 02", "amount"));

    expect(field().value).toBe("700");
  });

  it("cancels a key that opens an editor", async () => {
    await edited();

    expect(keyedOn("Account 02", "amount", "Enter")).toBe(false);
  });

  it("opens no editor on a read-only column", async () => {
    await edited();

    expect([
      keyedOn("Account 01", "account", "Enter"),
      screen.queryByRole("textbox"),
    ]).toStrictEqual([true, null]);
  });

  it("marks a read-only column's cells aria-readonly in a grid that edits", async () => {
    await edited();

    expect([
      cellOf("Account 01", "account").getAttribute("aria-readonly"),
      cellOf("Account 01", "amount").getAttribute("aria-readonly"),
    ]).toStrictEqual(["true", null]);
  });

  it("marks no cell aria-readonly in a grid that edits nothing", async () => {
    await edited({ columns: COLUMNS });

    expect(document.querySelector("[aria-readonly]")).toBeNull();
  });

  it("gives the select column's cells no edit marks", async () => {
    await edited({ columns: [...SELECTING.slice(0, 1), ...EDITING] });

    expect(document.querySelectorAll("[aria-readonly]")).toHaveLength(12);
  });

  it("marks the open cell data-editing", async () => {
    await edited();
    keyedOn("Account 02", "amount", "Enter");

    expect(cellOf("Account 02", "amount").dataset["editing"]).toBe("");
  });

  it("passes a changed value to onCellEdit on Enter", async () => {
    const onCellEdit = await edited();

    typedInto("800", "Enter");

    expect(onCellEdit.mock.lastCall).toStrictEqual([
      { columnId: "amount", record: ENTRIES[1], rowId: "Account 02", value: "800" },
    ]);
  });

  it("moves the focused cell down after Enter", async () => {
    await edited();
    typedInto("800", "Enter");

    expect([focusedCell(), screen.queryByRole("textbox")]).toStrictEqual([
      "Account 03/amount",
      null,
    ]);
  });

  it("moves to the next cell after Tab", async () => {
    await edited();
    keyedOn("Account 01", "region", "Enter");
    fireEvent.keyDown(field("Edit Region"), { key: "Tab" });

    expect(focusedCell()).toBe("Account 01/amount");
  });

  it("moves to the previous cell after Shift with Tab", async () => {
    await edited();
    typedInto("700", "Tab", { shiftKey: true });

    expect(focusedCell()).toBe("Account 02/region");
  });

  it("saves and moves down on ArrowDown in type mode", async () => {
    const onCellEdit = await edited();

    keyedOn("Account 01", "amount", "5");
    fireEvent.keyDown(field(), { key: "ArrowDown" });

    expect([onCellEdit.mock.lastCall?.[0]?.value, focusedCell()]).toStrictEqual([
      "5",
      "Account 02/amount",
    ]);
  });

  it("moves to the next column after ArrowLeft in type mode right to left", async () => {
    await edited({ columnResizeDirection: "rtl" });
    keyedOn("Account 01", "region", "N");
    fireEvent.keyDown(field("Edit Region"), { key: "ArrowLeft" });

    expect(focusedCell()).toBe("Account 01/amount");
  });

  it("passes nothing to onCellEdit for an unchanged value", async () => {
    const onCellEdit = await edited();

    typedInto("700", "Enter");

    expect(onCellEdit).not.toHaveBeenCalled();
  });

  it("keeps the editor open with the reason for a refused value", async () => {
    const onCellEdit = await edited();

    typedInto("abc", "Enter");

    expect([
      screen.getByRole("alert").textContent,
      field().value,
      onCellEdit.mock.calls,
    ]).toStrictEqual(["Enter a whole number", "abc", []]);
  });

  it("clears the reason when the editor opens again", async () => {
    await edited();
    typedInto("abc", "Enter");
    fireEvent.keyDown(field(), { key: "Escape" });
    keyedOn("Account 02", "amount", "Enter");

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("abandons the edit on Escape", async () => {
    const onCellEdit = await edited();

    typedInto("800", "Escape");

    expect([onCellEdit.mock.calls, screen.queryByRole("textbox")]).toStrictEqual([[], null]);
  });

  it("returns focus to the cell after Escape", async () => {
    await edited();
    typedInto("800", "Escape");

    expect(focusedCell()).toBe("Account 02/amount");
  });

  it("saves the draft when focus leaves the editor for another element", async () => {
    const onCellEdit = await edited();
    const sorter = screen.getByRole("button", { name: "Account" });

    keyedOn("Account 02", "amount", "Enter");
    fireEvent.change(field(), { target: { value: "800" } });
    act(() => {
      sorter.focus();
    });

    expect([onCellEdit.mock.lastCall?.[0]?.value, document.activeElement]).toStrictEqual([
      "800",
      sorter,
    ]);
  });

  it("leaves focus with the element a person moves it to while saving", async () => {
    await edited();
    const sorter = screen.getByRole("button", { name: "Account" });

    keyedOn("Account 02", "amount", "Enter");
    const focus = vi.spyOn(HTMLElement.prototype, "focus");

    act(() => {
      sorter.focus();
    });

    expect(focus.mock.contexts).toStrictEqual([sorter]);
  });

  it("passes a column's control's choice to onCellEdit at once", async () => {
    const onCellEdit = await edited({ columns: CHOOSING });

    keyedOn("Account 01", "region", "Enter");
    fireEvent.change(screen.getByRole("combobox", { name: "Edit Region" }), {
      target: { value: "South" },
    });

    expect(onCellEdit.mock.lastCall?.[0]?.value).toBe("South");
  });

  it("returns focus to the cell after a column's control saves", async () => {
    await edited({ columns: CHOOSING });
    keyedOn("Account 01", "region", "Enter");
    fireEvent.change(screen.getByRole("combobox", { name: "Edit Region" }), {
      target: { value: "South" },
    });

    expect(focusedCell()).toBe("Account 01/region");
  });

  it("marks a cell the caller names unsaved", async () => {
    await edited({}, { unsaved: (row, column) => row === "Account 03" && column === "amount" });

    expect([
      cellOf("Account 03", "amount").dataset["unsaved"],
      cellOf("Account 03", "amount").textContent,
      cellOf("Account 04", "amount").dataset["unsaved"],
    ]).toStrictEqual(["", "200Unsaved change", undefined]);
  });

  it("names an unsaved change by unsavedLabel", async () => {
    await edited({}, { unsaved: () => true, unsavedLabel: "Not saved" });

    expect(cellOf("Account 01", "amount").textContent).toBe("0Not saved");
  });

  it("names the editor by editLabel", async () => {
    await edited({}, { editLabel: (column) => `Change ${column}` });
    keyedOn("Account 02", "amount", "Enter");

    expect(field("Change Amount").value).toBe("700");
  });

  it("closes the editor after a saved value without onCellEdit", async () => {
    await drawn(tabled({ columns: EDITING }, { grid: true }));
    typedInto("800", "Enter");

    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
