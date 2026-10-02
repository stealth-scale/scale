import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { tabled, tableOf } from "#data-table/data-table.fixtures.tsx";
import { copiedOf } from "#data-table/use-grid-copy.ts";
import { untyped } from "#data-table/windowed.fixtures.ts";

/**
 * Returns the cell of a row and a column.
 */
function cellOf(row: string, column: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the cell it reads
  return document.querySelector(`[data-row="${row}"][data-column="${column}"]`) as HTMLElement;
}

/**
 * Renders the ledger as a grid and selects the first two rows' cells from the first row's account,
 * which keeps focus.
 */
async function selected(): Promise<void> {
  await drawn(tabled({}, { grid: true }));
  fireEvent.mouseDown(cellOf("Account 01", "account"));
  fireEvent.mouseDown(cellOf("Account 02", "amount"), { shiftKey: true });
}

/**
 * Copies at an element.
 *
 * @returns Whether the copy's default action proceeds, and the last data the grid wrote.
 */
function copiedAt(element: Element): [boolean, unknown] {
  const setData = vi.fn<(format: string, data: string) => void>();
  const proceeded = fireEvent.copy(element, { clipboardData: { setData } });

  return [proceeded, setData.mock.lastCall];
}

/**
 * Returns a copy without clipboard data.
 */
function bareCopy(): ClipboardEvent {
  return new ClipboardEvent("copy", { bubbles: true, cancelable: true });
}

describe("useGridCopy", () => {
  it("writes the selection as tab-separated text on a copy from the focused cell", async () => {
    await selected();

    expect(copiedAt(cellOf("Account 01", "account"))).toStrictEqual([
      false,
      ["text/plain", "Account 01\tNorth\t0\nAccount 02\tSouth\t700"],
    ]);
  });

  it("writes the selection on a copy dispatched at the body while a cell has focus", async () => {
    await selected();

    expect(copiedAt(document.body)[1]).toStrictEqual([
      "text/plain",
      "Account 01\tNorth\t0\nAccount 02\tSouth\t700",
    ]);
  });

  it("leaves a copy to the browser while no cell is selected", async () => {
    await drawn(tabled({}, { grid: true }));
    act(() => {
      cellOf("Account 01", "account").focus();
    });

    expect(copiedAt(document.body)).toStrictEqual([true, undefined]);
  });

  it("leaves a copy to the browser while focus is outside the cells", async () => {
    await selected();
    act(() => {
      screen.getByRole("button", { name: "Account" }).focus();
    });

    expect(copiedAt(document.body)).toStrictEqual([true, undefined]);
  });

  it("leaves a copy to the browser in a table that is not a grid", () => {
    render(tabled());

    expect(copiedAt(document.body)).toStrictEqual([true, undefined]);
  });

  it("leaves a copy alone while the focused element is not an element", () => {
    const event = bareCopy();

    copiedOf(event, null, untyped(tableOf()), "grid");

    expect(event.defaultPrevented).toBe(false);
  });

  it("leaves a copy without clipboard data alone", async () => {
    await selected();
    const event = bareCopy();

    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("writes only the selection of the grid whose cell has focus", async () => {
    await drawn(tabled({}, { grid: true }));
    await drawn(tabled({}, { grid: true }));
    const [, other] = document.querySelectorAll<HTMLElement>(
      '[data-row="Account 05"][data-column="amount"]',
    );

    fireEvent.mouseDown(other as HTMLElement);
    fireEvent.mouseDown(cellOf("Account 01", "account"));
    fireEvent.mouseDown(cellOf("Account 02", "amount"), { shiftKey: true });

    expect(copiedAt(document.body)[1]).toStrictEqual([
      "text/plain",
      "Account 01\tNorth\t0\nAccount 02\tSouth\t700",
    ]);
  });
});
