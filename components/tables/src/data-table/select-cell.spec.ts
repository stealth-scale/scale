import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { BRANCHED, SELECTING, tabled } from "#data-table/data-table.fixtures.tsx";

/**
 * Returns the checkbox that selects the account with the number given.
 */
function boxOf(at: string): HTMLInputElement {
  return screen.getByRole("checkbox", { name: `Select Account ${at}` });
}

/**
 * Returns the drawn box of the account with the number given, inside the box's label.
 */
function controlOf(at: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the checkbox's root renders its control
  return boxOf(at).closest("label")?.querySelector(".checkbox__control") as HTMLElement;
}

/**
 * Presses a box with the pointer while Shift is held.
 */
async function shiftPressed(box: HTMLElement): Promise<void> {
  fireEvent.pointerDown(box, { shiftKey: true });
  fireEvent.pointerUp(box, { shiftKey: true });
  fireEvent.click(box, { shiftKey: true });
  await settled();
}

describe("SelectCell", () => {
  it("names each row's box by its record", async () => {
    await drawn(tabled({ columns: SELECTING }));

    expect(boxOf("03").checked).toBe(false);
  });

  it("selects the row on a press", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("03"));

    expect(boxOf("03").checked).toBe(true);
  });

  it("clears a selected row on a second press", async () => {
    await drawn(
      tabled({ columns: SELECTING, initialState: { rowSelection: { "Account 03": true } } }),
    );
    await pressed(boxOf("03"));

    expect(boxOf("03").checked).toBe(false);
  });

  it("selects every row from the row pressed before on a press with Shift held", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("02"));
    await shiftPressed(boxOf("05"));

    expect(["02", "03", "04", "05", "06"].map((at) => boxOf(at).checked)).toStrictEqual([
      true,
      true,
      true,
      true,
      false,
    ]);
  });

  it("selects every row from the row pressed before on a Shift press of the box's label", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("02"));
    fireEvent.click(controlOf("05"), { shiftKey: true });
    await settled();

    expect(["03", "04", "05", "06"].map((at) => boxOf(at).checked)).toStrictEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("focuses the box after a Shift press of its label", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("02"));
    fireEvent.click(controlOf("05"), { shiftKey: true });
    await settled();

    expect(document.activeElement).toBe(boxOf("05"));
  });

  it("cancels the label's default on a Shift press", async () => {
    await drawn(tabled({ columns: SELECTING }));
    const proceeded = fireEvent.click(controlOf("05"), { shiftKey: true });

    await settled();

    expect(proceeded).toBe(false);
  });

  it("selects every row from the row pressed before on Space with Shift held", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("02"));
    fireEvent.keyDown(boxOf("04"), { key: " ", shiftKey: true });
    fireEvent.click(boxOf("04"));
    await settled();

    expect(boxOf("03").checked).toBe(true);
  });

  it("toggles one row on a press without Shift after a range", async () => {
    await drawn(tabled({ columns: SELECTING }));
    await pressed(boxOf("02"));
    await shiftPressed(boxOf("04"));
    await pressed(boxOf("06"));

    expect(boxOf("05").checked).toBe(false);
  });

  it("renders the box in the span that keeps its row one line tall", async () => {
    await drawn(tabled({ columns: SELECTING }));

    expect(boxOf("03").closest("label")?.parentElement?.className).toContain(
      "data-table__select-box",
    );
  });

  it("disables the box of a row that cannot be selected", async () => {
    await drawn(
      tabled({ columns: SELECTING, enableRowSelection: (row) => row.id !== "Account 03" }),
    );

    expect(boxOf("03").disabled).toBe(true);
  });

  it("renders the caller's glyph inside a checked box", () => {
    render(tabled({ columns: SELECTING, initialState: { rowSelection: { "Account 03": true } } }));
    const row = screen.getByRole("row", { name: /Account 03/u });

    expect(within(row).getByText("✓").closest("[hidden]")).toBeNull();
  });

  it("partly checks the box of a row while some rows under it are selected", async () => {
    await drawn(
      tabled({ ...BRANCHED, columns: SELECTING, initialState: { rowSelection: { Bergen: true } } }),
    );

    expect(
      screen.getByRole<HTMLInputElement>("checkbox", { name: "Select North" }).indeterminate,
    ).toBe(true);
  });

  it("checks the box of a row while every row under it is selected", async () => {
    await drawn(
      tabled({
        ...BRANCHED,
        columns: SELECTING,
        initialState: {
          expanded: { North: true },
          rowSelection: { "Oslo East": true, "Oslo West": true },
        },
      }),
    );

    expect(screen.getByRole<HTMLInputElement>("checkbox", { name: "Select Oslo" }).checked).toBe(
      true,
    );
  });

  it("renders the caller's partly-on glyph inside a partly-on box", () => {
    render(
      tabled({ ...BRANCHED, columns: SELECTING, initialState: { rowSelection: { Bergen: true } } }),
    );
    const row = screen.getByRole("row", { name: /North/u });

    expect(within(row).getByText("–").closest("[hidden]")).toBeNull();
  });
});
