import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { type Entry, PINNING, tabled } from "#data-table/data-table.fixtures.tsx";
import { pinColumn } from "#data-table/pin-column.tsx";

/**
 * Returns the pin toggle of the account with the number given.
 */
function toggleOf(at: string): HTMLElement {
  return screen.getByRole("button", { name: `Pin Account ${at}` });
}

/**
 * Returns the name of the row header of each body row, in render order.
 */
function orderOf(): string[] {
  return screen.getAllByRole("rowheader").map((header) => header.textContent);
}

describe("PinCell", () => {
  it("renders a toggle that is not pressed for a row that is not pinned", async () => {
    await drawn(tabled({ columns: PINNING }));

    expect(toggleOf("05").getAttribute("aria-pressed")).toBe("false");
  });

  it("pins the row to the top on a press", async () => {
    await drawn(tabled({ columns: PINNING }));
    await pressed(toggleOf("05"));

    expect(orderOf()[0]).toBe("Account 05");
  });

  it("states aria-pressed on the toggle of a pinned row", async () => {
    await drawn(tabled({ columns: PINNING }));
    await pressed(toggleOf("05"));

    expect(toggleOf("05").getAttribute("aria-pressed")).toBe("true");
  });

  it("unpins the row on a second press", async () => {
    await drawn(tabled({ columns: PINNING }));
    await pressed(toggleOf("05"));
    await pressed(toggleOf("05"));

    expect(orderOf()[0]).toBe("Account 01");
  });

  it("moves a row pinned to the other region on a press", async () => {
    await drawn(
      tabled({
        columns: PINNING,
        initialState: { rowPinning: { bottom: ["Account 05"], top: [] } },
      }),
    );
    await pressed(toggleOf("05"));

    expect(orderOf()[0]).toBe("Account 05");
  });

  it("pins the row to the bottom when the column states the bottom", async () => {
    const column = pinColumn<Entry>({
      label: (entry) => `Pin ${entry.account}`,
      position: "bottom",
    });

    await drawn(tabled({ columns: [column, ...PINNING.slice(1)] }));
    await pressed(toggleOf("05"));

    expect(orderOf().at(-1)).toBe("Account 05");
  });

  it("renders no toggle for a row the table does not let pin", async () => {
    await drawn(tabled({ columns: PINNING, enableRowPinning: (row) => row.id !== "Account 05" }));

    expect(screen.queryByRole("button", { name: "Pin Account 05" })).toBeNull();
  });

  it("gives each toggle an id from its row's id", async () => {
    await drawn(tabled({ columns: PINNING }));

    expect(toggleOf("05").id).toMatch(/-pin-Account%2005$/u);
  });

  it("renders the toggle in the box that keeps its row one line tall", async () => {
    await drawn(tabled({ columns: PINNING }));

    expect(toggleOf("05").parentElement?.className).toContain("data-table__toggle");
  });

  it("focuses the toggle at the row's new place after a press", async () => {
    await drawn(tabled({ columns: PINNING }));
    await pressed(toggleOf("05"));

    expect(document.activeElement).toBe(toggleOf("05"));
  });

  it("removes the toggle of an unpinned row the filters leave out", async () => {
    await drawn(
      tabled({
        columns: PINNING,
        initialState: {
          globalFilter: "Account 01",
          rowPinning: { bottom: [], top: ["Account 05"] },
        },
      }),
    );
    await pressed(toggleOf("05"));

    expect(screen.queryByRole("button", { name: "Pin Account 05" })).toBeNull();
  });
});
