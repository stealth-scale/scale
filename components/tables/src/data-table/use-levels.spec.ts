import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";

import { BRANCHED, type Entry, SELECTING, tabled } from "#data-table/data-table.fixtures.tsx";
import { type DataTableOptions } from "#data-table/use-data-table.ts";
import { entriesOf, laidOut, observer } from "#data-table/windowed.fixtures.ts";

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
 * Renders the tree with North open, focuses the row of the account named and presses the key.
 */
async function keyed(
  account: string,
  key: string,
  options: Partial<DataTableOptions<Entry>> = {},
): Promise<boolean> {
  await drawn(tabled({ ...BRANCHED, initialState: { expanded: { North: true } }, ...options }));
  act(() => {
    rowOf(account).focus();
  });

  return fireEvent.keyDown(rowOf(account), { key });
}

/**
 * Returns the `data-key` of the element with focus.
 */
function focusedKey(): string | undefined {
  const { activeElement } = document;

  return activeElement instanceof HTMLElement ? activeElement.dataset["key"] : undefined;
}

describe("useLevels", () => {
  it("renders a table of sub-rows as a treegrid", async () => {
    await drawn(tabled(BRANCHED));

    expect(screen.getByRole("treegrid").tagName).toBe("TABLE");
  });

  it("renders a table that groups its rows as a treegrid", async () => {
    await drawn(tabled({ initialState: { grouping: ["region"] } }));

    expect(screen.getByRole("treegrid").tagName).toBe("TABLE");
  });

  it("renders a table without levels without a role", async () => {
    await drawn(tabled());

    expect(screen.getByRole("table").hasAttribute("role")).toBe(false);
  });

  it("states aria-multiselectable while a column selects rows", async () => {
    await drawn(tabled({ ...BRANCHED, columns: SELECTING }));

    expect(screen.getByRole("treegrid").getAttribute("aria-multiselectable")).toBe("true");
  });

  it("states no aria-multiselectable while no column selects rows", async () => {
    await drawn(tabled(BRANCHED));

    expect(screen.getByRole("treegrid").hasAttribute("aria-multiselectable")).toBe(false);
  });

  it("gives the first row the tab stop", async () => {
    await drawn(tabled(BRANCHED));

    expect([rowOf("North").tabIndex, rowOf("South").tabIndex]).toStrictEqual([0, -1]);
  });

  it("moves the tab stop to the row that takes focus", async () => {
    await drawn(tabled(BRANCHED));
    act(() => {
      rowOf("South").focus();
    });

    expect([rowOf("North").tabIndex, rowOf("South").tabIndex]).toStrictEqual([-1, 0]);
  });

  it("keeps the tab stop while a control inside a row takes focus", async () => {
    await drawn(tabled({ ...BRANCHED, columns: SELECTING }));
    act(() => {
      screen.getByRole("checkbox", { name: "Select South" }).focus();
    });
    await settled();

    expect(rowOf("North").tabIndex).toBe(0);
  });

  it("gives no row the tab stop in a table without rows", async () => {
    await drawn(tabled({ ...BRANCHED, data: [] }));

    expect(document.querySelector("tbody [tabindex]")).toBeNull();
  });

  it.each([
    { from: "North", key: "ArrowDown", want: "record:Oslo" },
    { from: "Oslo", key: "ArrowUp", want: "record:North" },
    { from: "Bergen", key: "Home", want: "record:North" },
    { from: "North", key: "End", want: "record:Central" },
    { from: "North", key: "ArrowRight", want: "record:Oslo" },
    { from: "Bergen", key: "ArrowLeft", want: "record:North" },
  ])("focuses $want on $key from $from", async ({ from, key, want }) => {
    await keyed(from, key);

    expect(focusedKey()).toBe(want);
  });

  it("moves the tab stop with focus", async () => {
    await keyed("North", "End");

    expect([rowOf("North").tabIndex, rowOf("Central").tabIndex]).toStrictEqual([-1, 0]);
  });

  it.each([
    { from: "South", key: "ArrowRight", want: "true" },
    { from: "North", key: "ArrowLeft", want: "false" },
    { from: "South", key: "Enter", want: "true" },
    { from: "North", key: " ", want: "false" },
  ])("sets aria-expanded $want on $key on $from", async ({ from, key, want }) => {
    await keyed(from, key);

    expect(rowOf(from).getAttribute("aria-expanded")).toBe(want);
  });

  it("keeps focus on a row that opens", async () => {
    await keyed("South", "ArrowRight");

    expect(focusedKey()).toBe("record:South");
  });

  it("cancels Space on a row that opens nothing", async () => {
    await expect(keyed("Central", " ")).resolves.toBe(false);
  });

  it("opens a row on ArrowLeft right to left", async () => {
    await keyed("South", "ArrowLeft", { columnResizeDirection: "rtl" });

    expect(rowOf("South").getAttribute("aria-expanded")).toBe("true");
  });

  it("leaves a keystroke with Control pressed to the browser", async () => {
    await drawn(tabled(BRANCHED));
    act(() => {
      rowOf("North").focus();
    });
    const proceeded = fireEvent.keyDown(rowOf("North"), { ctrlKey: true, key: "ArrowDown" });

    expect([proceeded, focusedKey()]).toStrictEqual([true, "record:North"]);
  });

  it("leaves a keystroke on a control inside a row to the control", async () => {
    await drawn(tabled({ ...BRANCHED, columns: SELECTING }));
    const box = screen.getByRole("checkbox", { name: "Select North" });

    act(() => {
      box.focus();
    });
    fireEvent.keyDown(box, { key: "ArrowDown" });
    await settled();

    expect(document.activeElement).toBe(box);
  });

  it("leaves a key the rows do not take to the browser", async () => {
    await expect(keyed("North", "a")).resolves.toBe(true);
  });

  it("renders a row out of view to focus it on End in a windowed table", () => {
    observer();
    laidOut();
    render(
      tabled({ data: entriesOf(100), getSubRows: (entry) => entry.children }, { windowed: true }),
    );
    act(() => {
      rowOf("Entry 001").focus();
    });
    fireEvent.keyDown(rowOf("Entry 001"), { key: "End" });

    expect(focusedKey()).toBe("record:Entry 100");
  });

  it("returns no accessibility violation for a treegrid", async () => {
    await expect(
      accessibilityViolations(() =>
        tabled({ ...BRANCHED, columns: SELECTING, initialState: { expanded: true } }),
      ),
    ).resolves.toStrictEqual([]);
  });
});
