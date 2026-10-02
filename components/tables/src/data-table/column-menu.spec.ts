import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { createColumnHelper } from "#data-table/column-helper.ts";
import { COLUMNS, type Entry, menued } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the menu button of the column named.
 */
function buttonOf(column: string): HTMLElement {
  return screen.getByRole("button", { name: `Options for ${column}` });
}

/**
 * Opens the menu of the column named.
 */
async function opened(column: string): Promise<void> {
  fireEvent.click(buttonOf(column));
  await settled();
}

/**
 * Returns the names of the open menu's rows.
 */
function rowsShown(): string[] {
  return screen.getAllByRole("menuitem").map((row) => row.textContent);
}

/**
 * Chooses a row of the open menu and waits for the menu to leave.
 */
async function chosen(row: string): Promise<void> {
  await pressed(screen.getByRole("menuitem", { name: row }));
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

/**
 * Returns the header cell of the column named, by the name its header states.
 */
function headerOf(column: string): HTMLElement | null {
  return screen.queryByRole("columnheader", { name: column });
}

describe("ColumnMenu", () => {
  it("names the button by the column", async () => {
    await drawn(menued());

    expect(buttonOf("Amount").getAttribute("aria-haspopup")).toBe("menu");
  });

  it("lists both directions both regions and the hide for a column at rest", async () => {
    await drawn(menued());
    await opened("Amount");

    expect(rowsShown()).toStrictEqual([
      "Sort ascending",
      "Sort descending",
      "Pin to start",
      "Pin to end",
      "Hide column",
    ]);
  });

  it("lists the other direction and a clear for a sorted column", async () => {
    await drawn(menued({ initialState: { sorting: [{ desc: false, id: "amount" }] } }));
    await opened("Amount");

    expect(rowsShown().slice(0, 2)).toStrictEqual(["Sort descending", "Clear sort"]);
  });

  it("lists the other region and an unpin for a pinned column", async () => {
    await drawn(menued({ initialState: { columnPinning: { end: [], start: ["amount"] } } }));
    await opened("Amount");

    expect(rowsShown().slice(2, 4)).toStrictEqual(["Pin to end", "Unpin"]);
  });

  it("leaves out the sort rows for a column that does not sort", async () => {
    await drawn(menued());
    await opened("Region");

    expect(rowsShown()[0]).toBe("Pin to start");
  });

  it("lists a group by the column while the table groups", async () => {
    await drawn(menued({ enableGrouping: true }));
    await opened("Region");

    expect(rowsShown()[0]).toBe("Group by column");
  });

  it("groups the rows by the column on a press", async () => {
    await drawn(menued({ enableGrouping: true }));
    await opened("Region");
    await chosen("Group by column");

    expect(document.querySelector('tr[data-key="record:region:North"]')).not.toBeNull();
  });

  it("lists an ungroup for a column that groups the rows", async () => {
    await drawn(menued({ initialState: { grouping: ["region"] } }));
    await opened("Region");

    expect(rowsShown()[0]).toBe("Ungroup");
  });

  it("stops grouping by the column on a press", async () => {
    await drawn(menued({ initialState: { grouping: ["region"] } }));
    await opened("Region");
    await chosen("Ungroup");

    expect(screen.queryByRole("treegrid")).toBeNull();
  });

  it("lists no grouping while the table does not group", async () => {
    await drawn(menued());
    await opened("Region");

    expect(rowsShown()).not.toContain("Group by column");
  });

  it("names the group row by the caller's words", async () => {
    await drawn(menued({ enableGrouping: true }, "region", { groupedLabel: "Group rows" }));
    await opened("Region");

    expect(rowsShown()[0]).toBe("Group rows");
  });

  it("names the ungroup row by the caller's words", async () => {
    await drawn(
      menued({ initialState: { grouping: ["region"] } }, "region", {
        ungroupedLabel: "Stop grouping",
      }),
    );
    await opened("Region");

    expect(rowsShown()[0]).toBe("Stop grouping");
  });

  it.each([
    { row: "Sort ascending", want: "ascending" },
    { row: "Sort descending", want: "descending" },
  ])("sorts the column $want from the row $row", async ({ row, want }) => {
    await drawn(menued());
    await opened("Amount");
    await chosen(row);

    expect(headerOf("Amount")?.getAttribute("aria-sort")).toBe(want);
  });

  it("clears the sort of a sorted column", async () => {
    await drawn(menued({ initialState: { sorting: [{ desc: false, id: "amount" }] } }));
    await opened("Amount");
    await chosen("Clear sort");

    expect(headerOf("Amount")?.getAttribute("aria-sort")).toBeNull();
  });

  it.each([
    { row: "Pin to start", want: "start" },
    { row: "Pin to end", want: "end" },
  ])("pins the column to the $want from the row $row", async ({ row, want }) => {
    await drawn(menued());
    await opened("Amount");
    await chosen(row);

    expect(headerOf("Amount")?.dataset["pinned"]).toBe(want);
  });

  it("unpins a pinned column", async () => {
    await drawn(menued({ initialState: { columnPinning: { end: [], start: ["amount"] } } }));
    await opened("Amount");
    await chosen("Unpin");

    expect(headerOf("Amount")?.dataset["pinned"]).toBeUndefined();
  });

  it("hides the column once the menu has left", async () => {
    await drawn(menued());
    await opened("Region");
    await chosen("Hide column");

    expect(headerOf("Region")).toBeNull();
  });

  it("moves focus to the next column's button after a hide", async () => {
    await drawn(menued());
    await opened("Region");
    await chosen("Hide column");

    expect(document.activeElement).toBe(buttonOf("Amount"));
  });

  it("moves focus to the last button after the last column hides", async () => {
    await drawn(menued());
    await opened("Amount");
    await chosen("Hide column");

    expect(document.activeElement).toBe(buttonOf("Region"));
  });

  it("hides a column whose table renders no other menu button", async () => {
    await drawn(menued({}, "region"));
    await opened("Region");
    await chosen("Hide column");

    expect(screen.queryByRole("button", { name: /Options for/u })).toBeNull();
  });

  it("names the button by the caller's label", async () => {
    await drawn(menued({}, "amount", { label: (column) => `${column} menu` }));

    expect(screen.getByRole("button", { name: "Amount menu" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("writes the caller's words on the rows", async () => {
    const words = {
      ascendingLabel: "Aufsteigend",
      descendingLabel: "Absteigend",
      endLabel: "Ans Ende",
      hideLabel: "Ausblenden",
      startLabel: "An den Anfang",
      unpinnedLabel: "Lösen",
      unsortedLabel: "Unsortiert",
    };

    await drawn(
      menued(
        {
          initialState: {
            columnPinning: { end: [], start: ["amount"] },
            sorting: [{ desc: false, id: "amount" }],
          },
        },
        "amount",
        words,
      ),
    );
    await opened("Amount");

    expect(rowsShown()).toStrictEqual([
      "Absteigend",
      "Unsortiert",
      "Ans Ende",
      "Lösen",
      "Ausblenden",
    ]);
  });

  it("leads each row with the caller's glyph for its action", async () => {
    await drawn(
      menued({}, "amount", { actionIndicators: { ascending: "↑", descending: "↓", hide: "∅" } }),
    );
    await opened("Amount");

    expect(rowsShown()).toStrictEqual([
      "↑Sort ascending",
      "↓Sort descending",
      "Pin to start",
      "Pin to end",
      "∅Hide column",
    ]);
  });

  it("leaves out the hide while no other column can hide", async () => {
    await drawn(menued({ initialState: { columnVisibility: { account: false, region: false } } }));
    await opened("Amount");

    expect(rowsShown()).not.toContain("Hide column");
  });

  it("renders no button for a column without an action", async () => {
    const column = createColumnHelper<Entry>();
    const fixed = column.accessor("account", {
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
      header: "Account",
    });

    await drawn(menued({ columns: column.columns([fixed, ...COLUMNS.slice(1)]) }));

    expect(screen.queryByRole("button", { name: "Options for Account" })).toBeNull();
  });
});
