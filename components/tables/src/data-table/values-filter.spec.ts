import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { filtered } from "#data-table/data-table.fixtures.tsx";

/**
 * Opens the region column's filter.
 */
async function opened(name = "Filter Region"): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name }));
  await settled();
}

/**
 * Returns the words of each box's label, in render order.
 */
function boxesShown(): Array<string | undefined> {
  return screen
    .getAllByRole("checkbox")
    .map((box) => box.closest("label")?.querySelector("[data-part=label]")?.textContent);
}

/**
 * Returns the region column's cells in the body, in render order.
 */
function regionsShown(): string[] {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.children[1]?.textContent ?? "");
}

describe("ValuesFilter", () => {
  it("renders a box per value with its count", async () => {
    await drawn(filtered());
    await opened();

    expect(boxesShown()).toStrictEqual(["North 6", "South 6"]);
  });

  it("keeps the rows whose value is checked", async () => {
    await drawn(filtered());
    await opened();
    await pressed(screen.getByRole("checkbox", { name: "North 6" }));

    expect(new Set(regionsShown())).toStrictEqual(new Set(["North"]));
  });

  it("removes the filter when every box is cleared", async () => {
    await drawn(
      filtered({ initialState: { columnFilters: [{ id: "region", value: ["North"] }] } }),
    );
    await opened("Filter Region, active");
    await pressed(screen.getByRole("checkbox", { name: "North 6" }));

    expect(regionsShown()).toHaveLength(12);
  });

  it("keeps a chosen value no row has any more with a count of zero", async () => {
    await drawn(
      filtered({
        initialState: {
          columnFilters: [
            { id: "account", value: "Account 02" },
            { id: "region", value: ["North"] },
          ],
        },
      }),
    );
    await opened("Filter Region, active");

    expect(boxesShown()).toStrictEqual(["North 0", "South 1"]);
  });
});
