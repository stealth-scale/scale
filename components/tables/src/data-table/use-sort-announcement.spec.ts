import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tabled, tableOf } from "#data-table/data-table.fixtures.tsx";
import { sortMessageOf } from "#data-table/use-sort-announcement.ts";

const WORDS = {
  sorted: (column: string, direction: string): string => `${column} ${direction}`,
  unsorted: "No sort",
};

/**
 * Returns the polite live region's text one frame after the last change.
 */
async function announced(): Promise<string> {
  await act(async () => {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  });

  return document.querySelector("[aria-live=polite]")?.textContent ?? "";
}

describe("useSortAnnouncement", () => {
  it("returns the unsorted words for a table sorted by no column", () => {
    expect(sortMessageOf(tableOf(), WORDS)).toBe("No sort");
  });

  it("returns the sorted words with the column's name and the direction", () => {
    const table = tableOf({ initialState: { sorting: [{ desc: true, id: "amount" }] } });

    expect(sortMessageOf(table, WORDS)).toBe("Amount descending");
  });

  it("returns the unsorted words for a sort on a column the table does not have", () => {
    const table = tableOf({ initialState: { sorting: [{ desc: false, id: "gone" }] } });

    expect(sortMessageOf(table, WORDS)).toBe("No sort");
  });

  it("announces the sort after a press on a column's name", async () => {
    render(tabled());
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Account" }));
    });

    await expect(announced()).resolves.toBe("Sorted by Account, ascending");
  });

  it("announces nothing on the first render of a sorted table", async () => {
    render(
      tabled(
        { initialState: { sorting: [{ desc: false, id: "account" }] } },
        {
          sortedAnnouncement: () => "Sorted on first render",
        },
      ),
    );

    await expect(announced()).resolves.not.toBe("Sorted on first render");
  });

  it("announces the unsorted words after the sort is removed", async () => {
    render(tabled({}, { unsortedAnnouncement: "Order removed" }));

    for (const press of [1, 2, 3]) {
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Amount" }), { detail: press });
      });
    }

    await expect(announced()).resolves.toBe("Order removed");
  });
});
