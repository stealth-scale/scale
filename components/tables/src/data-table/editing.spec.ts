import { describe, expect, it } from "vitest";

import { COLUMNS, EDITING, tableOf } from "#data-table/data-table.fixtures.tsx";
import { editOf, editsOf, editStartOf, leaveOf, textAt } from "#data-table/editing.ts";
import { untyped } from "#data-table/windowed.fixtures.ts";

/**
 * A keystroke without modifiers.
 */
const PLAIN = { altKey: false, ctrlKey: false, metaKey: false };

describe("editing", () => {
  it.each([
    { key: "Enter", want: { mode: "caret", text: undefined } },
    { key: "F2", want: { mode: "caret", text: undefined } },
    { key: "Backspace", want: { mode: "type", text: "" } },
    { key: "Delete", want: { mode: "type", text: "" } },
    { key: "7", want: { mode: "type", text: "7" } },
    { key: " ", want: { mode: "type", text: " " } },
    { key: "é", want: { mode: "type", text: "é" } },
    { key: "😀", want: { mode: "type", text: "😀" } },
  ])("opens the editor in $want.mode mode on $key", ({ key, want }) => {
    expect(editStartOf({ ...PLAIN, key })).toStrictEqual(want);
  });

  it.each(["ArrowDown", "Shift", "Dead", "Escape"])("opens no editor on %s", (key) => {
    expect(editStartOf({ ...PLAIN, key })).toBeUndefined();
  });

  it.each([{ altKey: true }, { ctrlKey: true }, { metaKey: true }])(
    "opens no editor on a character with $0",
    (modifier) => {
      expect(editStartOf({ ...PLAIN, ...modifier, key: "7" })).toBeUndefined();
    },
  );

  it("returns the edit an editable column states", () => {
    expect(editOf(untyped(tableOf({ columns: EDITING })), "region")).toStrictEqual({});
  });

  it.each([
    { columnId: "account", label: "a column that states no edit" },
    { columnId: "missing", label: "a column the table does not have" },
  ])("returns no edit for $label", ({ columnId }) => {
    expect(editOf(untyped(tableOf({ columns: EDITING })), columnId)).toBeUndefined();
  });

  it("returns no edit for a column without meta", () => {
    const table = tableOf({ columns: [{ accessorKey: "account", header: "Account" }] });

    expect(editOf(untyped(table), "account")).toBeUndefined();
  });

  it.each([
    { columns: EDITING, label: "a table with an editable column", want: true },
    { columns: COLUMNS, label: "a table without one", want: false },
  ])("returns $want for $label", ({ columns, want }) => {
    expect(editsOf(untyped(tableOf({ columns })))).toBe(want);
  });

  it("returns a cell's value as text", () => {
    expect(textAt(untyped(tableOf()), { columnId: "amount", rowId: "Account 02" })).toBe("700");
  });

  it.each([
    { key: "Enter", rtl: false, shift: false, want: "down" },
    { key: "Tab", rtl: false, shift: false, want: "right" },
    { key: "Tab", rtl: false, shift: true, want: "left" },
    { key: "Tab", rtl: true, shift: false, want: "right" },
    { key: "ArrowUp", rtl: false, shift: false, want: "up" },
    { key: "ArrowLeft", rtl: false, shift: false, want: "left" },
    { key: "ArrowLeft", rtl: true, shift: false, want: "right" },
    { key: "ArrowRight", rtl: true, shift: false, want: "left" },
  ])("moves $want after $key with shift $shift and rtl $rtl", ({ key, rtl, shift, want }) => {
    expect(leaveOf(key, shift, rtl)).toBe(want);
  });

  it("moves nowhere after a key that saves without moving", () => {
    expect(leaveOf("x", false, false)).toBeUndefined();
  });
});
