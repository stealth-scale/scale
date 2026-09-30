import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { SELECTING, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the header's checkbox.
 */
function everyBox(): HTMLInputElement {
  return screen.getByRole("checkbox", { name: "Select every entry" });
}

describe("SelectAll", () => {
  it("renders the header's box unchecked while no row is selected", async () => {
    await drawn(tabled({ columns: SELECTING }));

    expect([everyBox().checked, everyBox().indeterminate]).toStrictEqual([false, false]);
  });

  it("renders the header's box partly on while some rows are selected", async () => {
    await drawn(
      tabled({ columns: SELECTING, initialState: { rowSelection: { "Account 01": true } } }),
    );

    expect(everyBox().indeterminate).toBe(true);
  });

  it("renders the header's box in the span that keeps the header one line tall", async () => {
    await drawn(tabled({ columns: SELECTING }));

    expect(everyBox().closest("label")?.parentElement?.className).toContain(
      "data-table__select-box",
    );
  });

  it("selects every row on a press", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(everyBox());

    expect(screen.getAllByRole("checkbox").every((box) => (box as HTMLInputElement).checked)).toBe(
      true,
    );
  });

  it("selects every row on a press while some rows are selected", async () => {
    await drawn(
      tabled({ columns: SELECTING, initialState: { rowSelection: { "Account 01": true } } }),
    );
    await pressed(everyBox());

    expect(everyBox().checked).toBe(true);
  });

  it("clears every row on a press while every row is selected", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(everyBox());
    await pressed(everyBox());

    expect(screen.getAllByRole("checkbox").some((box) => (box as HTMLInputElement).checked)).toBe(
      false,
    );
  });
});
