import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { type MatrixCell } from "#status-matrix/states.ts";
import { COLUMNS, graded, ROWS } from "#status-matrix/status-matrix.fixtures.tsx";

/**
 * Reads the words every crossing of one row is announced by, the rollup last.
 */
function along(row: string): readonly string[] {
  const cells = document.querySelectorAll<HTMLElement>(
    `td[data-row="${row}"] .${slotClass("status-matrix", "name")}`,
  );

  return [...cells].map((cell) => cell.textContent ?? "");
}

/**
 * Finds the crossing of the ledger row and one column, for a pointer to be moved over.
 */
function crossing(container: HTMLElement, column: string): Element {
  const cell = container.querySelector(`td[data-row="ledger"][data-column="${column}"]`);

  if (cell === null) throw new Error(`the ledger row has no ${column} crossing`);

  return cell;
}

describe("StatusMatrix", () => {
  it("raises nothing an audit reports", async () => {
    await expect(accessibilityViolations(() => graded())).resolves.toStrictEqual([]);
  });

  it("draws a column per column it was given and one for the names", () => {
    render(graded());

    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
  });

  it("reads a crossing as the state the cell names", () => {
    render(graded());

    expect(along("checkout")[0]).toBe("Healthy");
  });

  it("reads a crossing nobody measured as unmeasured", () => {
    render(graded());

    expect(along("search")[2]).toBe("Not measured");
  });

  it("rolls a row up to the worst state along it", () => {
    render(graded());

    expect(along("checkout").at(-1)).toBe("Down");
  });

  it("rolls a gap up over a row that otherwise passed", () => {
    render(graded());

    expect(along("search").at(-1)).toBe("Not measured");
  });

  it("rolls a row of passes up to a pass", () => {
    render(graded());

    expect(along("ledger").at(-1)).toBe("Healthy");
  });

  it("draws no last column where no caller names one", () => {
    render(graded({ rollup: undefined }));

    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
  });

  it("gathers the rows into a section per heading", () => {
    render(graded());

    expect(screen.getAllByRole("rowgroup")).toHaveLength(3);
  });

  it("heads each section with the words its rows are gathered under", () => {
    render(graded());

    expect(screen.getByRole("rowheader", { name: "Payments" })).toBeTruthy();
  });

  it("draws one section where only some of the rows state a heading", () => {
    render(graded({ rows: [...ROWS, { id: "loose", label: "loose-api" }] }));

    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
  });

  it("says so across the grid where it holds no rows at all", () => {
    render(graded({ empty: "Nothing measured yet", rows: [] }));

    expect(screen.getByText("Nothing measured yet")).toBeTruthy();
  });

  it("draws no row at all where it holds nothing and nobody wrote the words", () => {
    render(graded({ rows: [] }));

    expect(screen.queryAllByRole("row")).toHaveLength(1);
  });

  it("draws at the step a caller asks to read it at", () => {
    const { container } = render(graded({ size: "lg" }));

    expect(slotClasses(container, "status-matrix", "legend")).toContain(
      variantClass(slotClass("status-matrix", "legend"), "size", "lg"),
    );
  });

  it("draws no caption where nobody writes one", () => {
    const { container } = render(graded({ caption: undefined }));

    expect(container.querySelector("caption")).toBeNull();
  });

  it("names a crossing by the caller's own words where they write them", () => {
    render(graded({ cellLabel: (state, row, column) => `${row.id}/${column.id}: ${state.label}` }));

    expect(along("checkout")[0]).toBe("checkout/eu: Healthy");
  });

  it("presses nothing while no caller hears a crossing picked", () => {
    render(graded());

    expect(screen.queryAllByRole("button")).toStrictEqual([]);
  });

  it("turns every crossing into a button where a caller hears them picked", () => {
    render(graded({ onSelectCell: vi.fn<() => void>() }));

    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("reports the pair a reader pressed", async () => {
    const heard = vi.fn<(row: string, column: string, cell: MatrixCell | undefined) => void>();

    render(graded({ onSelectCell: heard }));
    await pressed(screen.getByRole("button", { name: "Down" }));

    expect(heard).toHaveBeenCalledWith("checkout", "us", {
      column: "us",
      row: "checkout",
      state: "down",
    });
  });

  it("reports no cell for a pair nobody measured", async () => {
    const heard = vi.fn<(row: string, column: string, cell: MatrixCell | undefined) => void>();

    render(graded({ cellLabel: (state, row) => `${row.id}: ${state.label}`, onSelectCell: heard }));
    await pressed(screen.getByRole("button", { name: "search: Not measured" }));

    expect(heard).toHaveBeenCalledWith("search", "apac", undefined);
  });

  it("explains every state it can draw", () => {
    render(graded());

    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });

  it("writes the unmeasured state last in the legend", () => {
    render(graded());

    expect(screen.getAllByRole("listitem").at(-1)?.textContent).toBe("Not measured");
  });

  it("draws no legend where no caller names one", () => {
    render(graded({ legend: undefined }));

    expect(screen.queryByRole("list")).toBeNull();
  });

  it("says which row and which column a crossing belongs to", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('td[data-row="ledger"][data-column="eu"]')).toHaveLength(1);
  });

  it("says which column a name heads", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('th[data-column="eu"]')).toHaveLength(1);
  });

  it("lights the row and the column a pointer is over", () => {
    const { container } = render(graded());

    fireEvent.pointerMove(crossing(container, "us"));

    expect(container.querySelectorAll("[data-lit]")).toHaveLength(8);
  });

  it("lights the rollup column a pointer is over", () => {
    const { container } = render(graded());

    fireEvent.pointerMove(crossing(container, "rollup"));

    expect(container.querySelectorAll('[data-column="rollup"][data-lit]')).toHaveLength(4);
  });

  it("names the rollup column too so a pointer crossing it lights it", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('[data-column="rollup"]')).toHaveLength(4);
  });

  it("stretches the rollup's name past a column of the caller's own called rollup", () => {
    const { container } = render(
      graded({ columns: [...COLUMNS, { id: "rollup", label: "Rollup" }] }),
    );

    expect(container.querySelectorAll('[data-column="rollup-"]')).toHaveLength(4);
  });

  it("names the box it scrolls inside by its caption", () => {
    const { container } = render(graded());
    const named = container.querySelector("[aria-labelledby]")?.getAttribute("aria-labelledby");

    expect(container.querySelector(`#${CSS.escape(named ?? "")}`)?.textContent).toBe(
      "Service health by region",
    );
  });

  it("lets nothing it reads reach the document as an attribute", () => {
    const { container } = render(graded());

    expect(container.querySelector("[cells], [states], [unmeasured], [rollup]")).toBeNull();
  });
});
