import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { tabled } from "#data-table/data-table.fixtures.tsx";

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

/**
 * Presses the account column's sort button the number of times given.
 */
function sortedBy(presses: number): void {
  for (let press = 0; press < presses; press += 1) {
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Account" }));
    });
  }
}

describe("useAnnouncements", () => {
  it("announces a sort in the table's words", async () => {
    render(tabled({}, { sortedAnnouncement: (column) => `By ${column}` }));
    sortedBy(1);

    await expect(announced()).resolves.toBe("By Account");
  });

  it("announces a sort by no column in the table's words", async () => {
    render(tabled({}, { unsortedAnnouncement: "Unordered" }));
    sortedBy(3);

    await expect(announced()).resolves.toBe("Unordered");
  });

  it("announces a sort by no column in English unless stated", async () => {
    render(tabled());
    sortedBy(3);

    await expect(announced()).resolves.toBe("Not sorted");
  });
});
