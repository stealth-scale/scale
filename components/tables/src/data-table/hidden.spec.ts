import { type Column, type RowData } from "@tanstack/react-table";
import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Features } from "#data-table/features.ts";
import { hid, TRIGGER } from "#data-table/hidden.ts";

/**
 * Renders a table whose header row has a menu button per column name, and returns the table.
 */
function headerWith(names: readonly string[]): HTMLTableElement {
  const table = document.createElement("table");
  const row = table.createTHead().insertRow();

  for (const name of names) {
    const cell = document.createElement("th");
    const button = document.createElement("button");

    button.setAttribute(TRIGGER, "");
    button.textContent = name;
    cell.append(button);
    row.append(cell);
  }

  document.body.append(table);

  return table;
}

/**
 * Returns a column whose hide removes the header cell of the button given.
 */
function columnOf(button: HTMLElement): Column<Features, RowData> {
  const column = {
    toggleVisibility: (): void => {
      button.closest("th")?.remove();
    },
  };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hide calls only toggleVisibility
  return column as unknown as Column<Features, RowData>;
}

/**
 * Hides the column of the button named in the table given.
 */
function hiding(table: HTMLTableElement, name: string): void {
  const button = within(table).getByRole("button", { name });

  hid(columnOf(button), button);
}

describe("hid", () => {
  it("focuses the button that takes the hidden column's place", () => {
    const table = headerWith(["Account", "Region", "Amount"]);

    hiding(table, "Region");

    expect(document.activeElement).toBe(within(table).getByRole("button", { name: "Amount" }));
  });

  it("focuses the last button after the last column hides", () => {
    const table = headerWith(["Account", "Region", "Amount"]);

    hiding(table, "Amount");

    expect(document.activeElement).toBe(within(table).getByRole("button", { name: "Region" }));
  });

  it("hides a column whose header has no other button", () => {
    const table = headerWith(["Region"]);

    hiding(table, "Region");

    expect(table.querySelectorAll(`[${TRIGGER}]`)).toHaveLength(0);
  });
});
