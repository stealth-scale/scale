import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { BRANCHED, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the row of the account named, or `null` while it does not render.
 */
function rowOr(account: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`tr[data-key="record:${account}"]`);
}

/**
 * Returns the row of the account named.
 */
function rowOf(account: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the row it reads
  return rowOr(account) as HTMLElement;
}

/**
 * Returns the toggle in the row of the account named.
 */
function toggleIn(account: string): HTMLButtonElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a row with sub-rows renders its toggle
  return rowOf(account).querySelector("button") as HTMLButtonElement;
}

describe("TreeToggle", () => {
  it("names the toggle of a closed row by the words that open it", async () => {
    await drawn(tabled(BRANCHED));

    expect(toggleIn("North").getAttribute("aria-label")).toBe("Expand");
  });

  it("names the toggle of an open row by the words that close it", async () => {
    await drawn(tabled({ ...BRANCHED, initialState: { expanded: { North: true } } }));

    expect(toggleIn("North").getAttribute("aria-label")).toBe("Collapse");
  });

  it("names the toggles by the caller's words", async () => {
    await drawn(tabled(BRANCHED, { collapseLabel: "Hide", expandLabel: "Show" }));

    expect(toggleIn("South").getAttribute("aria-label")).toBe("Show");
  });

  it("keeps the toggle out of the tab order", async () => {
    await drawn(tabled(BRANCHED));

    expect(toggleIn("North").tabIndex).toBe(-1);
  });

  it("opens its row on a press", async () => {
    await drawn(tabled(BRANCHED));
    await pressed(toggleIn("North"));

    expect(rowOf("North").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes its row on a second press", async () => {
    await drawn(tabled(BRANCHED));
    await pressed(toggleIn("North"));
    await pressed(toggleIn("North"));

    expect(rowOr("Oslo")).toBeNull();
  });

  it("focuses its row after a press", async () => {
    await drawn(tabled(BRANCHED));
    await pressed(toggleIn("South"));

    expect(document.activeElement).toBe(rowOf("South"));
  });

  it("renders the caller's glyph with the row's open state", async () => {
    await drawn(
      tabled(
        { ...BRANCHED, initialState: { expanded: { North: true } } },
        { expandIndicator: "›" },
      ),
    );
    const glyph = screen.getAllByText("›")[0];

    expect([glyph?.dataset["state"], glyph?.getAttribute("aria-hidden")]).toStrictEqual([
      "open",
      "true",
    ]);
  });
});
