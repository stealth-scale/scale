import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { BRANCHED, EXPANDING, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the detail toggle of the account with the number given.
 */
function toggleOf(at: string): HTMLElement {
  return screen.getByRole("button", { name: `Details of Account ${at}` });
}

describe("ExpandCell", () => {
  it("renders a collapsed toggle named by its record", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));

    expect(toggleOf("02").getAttribute("aria-expanded")).toBe("false");
  });

  it("states no aria-controls while the detail is closed", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));

    expect(toggleOf("02").hasAttribute("aria-controls")).toBe(false);
  });

  it("opens the detail on a press", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));
    await pressed(toggleOf("02"));

    expect(toggleOf("02").getAttribute("aria-expanded")).toBe("true");
  });

  it("points aria-controls at the detail row while it is open", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));
    await pressed(toggleOf("02"));
    const controlled = toggleOf("02").getAttribute("aria-controls") ?? "";

    expect(document.querySelector(`[id="${controlled}"]`)?.textContent).toBe(
      "Account 02 is in the South region.",
    );
  });

  it("closes the detail on a second press", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));
    await pressed(toggleOf("02"));
    await pressed(toggleOf("02"));

    expect(screen.queryByText("Account 02 is in the South region.")).toBeNull();
  });

  it("writes the open state on the indicator", async () => {
    await drawn(
      tabled({
        columns: EXPANDING,
        getRowCanExpand: () => true,
        initialState: { expanded: { "Account 02": true } },
      }),
    );

    expect(toggleOf("02").querySelector<HTMLElement>("[aria-hidden]")?.dataset["state"]).toBe(
      "open",
    );
  });

  it("renders the toggle in the box that keeps its row one line tall", async () => {
    await drawn(tabled({ columns: EXPANDING, getRowCanExpand: () => true }));

    expect(toggleOf("02").parentElement?.className).toContain("data-table__toggle");
  });

  it("renders no toggle for a row that cannot expand", async () => {
    await drawn(tabled({ columns: EXPANDING }));

    expect(screen.queryByRole("button", { name: /Details of/u })).toBeNull();
  });

  it("renders no toggle for a row with sub-rows", async () => {
    await drawn(tabled({ ...BRANCHED, columns: EXPANDING, getRowCanExpand: () => true }));

    expect(
      ["North", "Central"].map(
        (account) => screen.queryByRole("button", { name: `Details of ${account}` }) !== null,
      ),
    ).toStrictEqual([false, true]);
  });
});
