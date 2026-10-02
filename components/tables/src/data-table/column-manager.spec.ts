import { act, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Sortable } from "@stealthscale/component-collections";
import { drawn, pressed } from "@stealthscale/testing-react";

import { managed, SELECTING } from "#data-table/data-table.fixtures.tsx";

vi.mock(import("@stealthscale/component-collections"), async (importOriginal) => {
  const original = await importOriginal();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the mock renders the kit's own root and records its props
  const Root = vi.fn(original.Sortable.Root) as unknown as typeof original.Sortable.Root;

  return { ...original, Sortable: { ...original.Sortable, Root } };
});

/**
 * Returns the manager's list.
 */
function list(): HTMLElement {
  return screen.getByRole("list", { name: "Columns" });
}

/**
 * Returns the words of each row's box, in render order.
 */
function rowsListed(): Array<string | undefined> {
  return within(list())
    .getAllByRole("checkbox")
    .map((box) => box.closest("label")?.querySelector("[data-part=label]")?.textContent);
}

/**
 * Returns the box of the column named.
 */
function boxOf(name: string): HTMLInputElement {
  return within(list()).getByRole<HTMLInputElement>("checkbox", { name });
}

/**
 * Returns the names of the table's column headers, in render order.
 */
function headersShown(): string[] {
  return screen.getAllByRole("columnheader").map((header) => header.textContent);
}

describe("ColumnManager", () => {
  it("lists the columns a person can hide in the table's order", async () => {
    await drawn(managed({ columns: SELECTING }));

    expect(rowsListed()).toStrictEqual(["Account", "Region", "Amount"]);
  });

  it("checks the box of a visible column", async () => {
    await drawn(managed());

    expect(boxOf("Region").checked).toBe(true);
  });

  it("renders the list in the sortable kit's plain look", async () => {
    await drawn(managed());

    expect(vi.mocked(Sortable.Root).mock.lastCall?.[0].variant).toBe("plain");
  });

  it("hides the column whose box a press clears", async () => {
    await drawn(managed());
    await pressed(boxOf("Region"));

    expect(headersShown()).toStrictEqual(["Account", "Amount"]);
  });

  it("shows the hidden column whose box a press checks", async () => {
    await drawn(managed({ initialState: { columnVisibility: { region: false } } }));
    await pressed(boxOf("Region"));

    expect(headersShown()).toStrictEqual(["Account", "Region", "Amount"]);
  });

  it("disables the box of the last visible column", async () => {
    await drawn(managed({ initialState: { columnVisibility: { account: false, region: false } } }));

    expect([boxOf("Amount").disabled, boxOf("Region").disabled]).toStrictEqual([true, false]);
  });

  it("orders the table's columns as the list after a move", async () => {
    await drawn(managed({ columns: SELECTING }));
    act(() => {
      vi.mocked(Sortable.Root).mock.lastCall?.[0].onItemsChange?.([
        { id: "amount" },
        { id: "account" },
        { id: "region" },
      ]);
    });

    expect(headersShown()).toStrictEqual(["✓–Select every entry", "Amount", "Account", "Region"]);
  });

  it("restores the order and the visibility from the reset button", async () => {
    await drawn(managed());
    await pressed(boxOf("Region"));
    act(() => {
      vi.mocked(Sortable.Root).mock.lastCall?.[0].onItemsChange?.([
        { id: "amount" },
        { id: "account" },
        { id: "region" },
      ]);
    });
    await pressed(screen.getByRole("button", { name: "Reset" }));

    expect(headersShown()).toStrictEqual(["Account", "Region", "Amount"]);
  });

  it("names the list and the reset button by the caller's words", async () => {
    await drawn(managed({}, { label: "Spalten", resetLabel: "Zurücksetzen" }));

    expect(
      screen.getByRole("button", { name: "Zurücksetzen" }).closest(".data-table__manager"),
    ).toBe(screen.getByRole("list", { name: "Spalten" }).closest(".data-table__manager"));
  });
});
