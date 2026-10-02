import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { searched, tabled, tableOf } from "#data-table/data-table.fixtures.tsx";
import { DELAY, filterMessageOf } from "#data-table/use-filter-announcement.ts";

/**
 * Types a value into the search field.
 */
function typed(value: string): void {
  act(() => {
    fireEvent.change(screen.getByRole("searchbox", { name: "Search entries" }), {
      target: { value },
    });
  });
}

/**
 * Returns the polite live region's text a frame after the milliseconds given pass.
 */
async function announcedAfter(milliseconds: number): Promise<string> {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  });

  return document.querySelector("[aria-live=polite]")?.textContent ?? "";
}

describe("useFilterAnnouncement", () => {
  it("returns the words for the count of matching rows and every row", () => {
    const table = tableOf({ initialState: { globalFilter: "North" } });

    expect(filterMessageOf(table, (count, total) => `${String(count)}/${String(total)}`)).toBe(
      "6/12",
    );
  });

  it("waits 500 milliseconds after the last change", () => {
    expect(DELAY).toBe(500);
  });

  it("announces the count of matching rows after a change of the search", async () => {
    render(searched({}, { filteredAnnouncement: (count) => `${String(count)} found` }));
    typed("Account 1");

    await expect(announcedAfter(DELAY + 50)).resolves.toBe("3 found");
  });

  it("announces once for changes that follow each other within the delay", async () => {
    render(searched({}, { filteredAnnouncement: (count) => `${String(count)} left` }));
    typed("Account");
    typed("Account 0");

    await expect(announcedAfter(DELAY + 50)).resolves.toBe("9 left");
  });

  it("announces a change of a column's filter", async () => {
    const words = { filteredAnnouncement: (count: number): string => `${String(count)} in region` };
    const { rerender } = render(tabled({ state: { columnFilters: [] } }, words));

    rerender(tabled({ state: { columnFilters: [{ id: "region", value: "North" }] } }, words));

    await expect(announcedAfter(DELAY + 50)).resolves.toBe("6 in region");
  });

  it("announces nothing on the first render of a filtered table", async () => {
    render(
      searched(
        { initialState: { globalFilter: "North" } },
        { filteredAnnouncement: () => "Filtered on first render" },
      ),
    );

    await expect(announcedAfter(DELAY + 50)).resolves.not.toBe("Filtered on first render");
  });

  it("announces in English unless stated", async () => {
    render(searched());
    typed("Account 12");

    await expect(announcedAfter(DELAY + 50)).resolves.toBe("1 of 12 rows");
  });
});
