import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { type MatrixCell } from "#status-matrix/states.ts";
import { COLUMNS, graded, ROWS } from "#status-matrix/status-matrix.fixtures.tsx";

/**
 * Returns the hidden labels of one row's cells, the rollup last.
 */
function along(row: string): readonly string[] {
  const cells = document.querySelectorAll<HTMLElement>(
    `td[data-row="${row}"] .${slotClass("status-matrix", "name")}`,
  );

  return [...cells].map((cell) => cell.textContent ?? "");
}

/**
 * Returns the cell of the ledger row in one column.
 */
function crossing(container: HTMLElement, column: string): Element {
  const cell = container.querySelector(`td[data-row="ledger"][data-column="${column}"]`);

  if (cell === null) throw new Error(`the ledger row has no ${column} crossing`);

  return cell;
}

describe("StatusMatrix", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => graded())).resolves.toStrictEqual([]);
  });

  it("renders a column header per column plus the corner and the rollup", () => {
    render(graded());

    expect(screen.getAllByRole("columnheader")).toHaveLength(5);
  });

  it("labels a cell with the state it names", () => {
    render(graded());

    expect(along("checkout")[0]).toBe("Healthy");
  });

  it("labels a pair without a cell as unmeasured", () => {
    render(graded());

    expect(along("search")[2]).toBe("Not measured");
  });

  it("rolls a row up to its worst state", () => {
    render(graded());

    expect(along("checkout").at(-1)).toBe("Down");
  });

  it("rolls a row with a gap up to unmeasured over its passes", () => {
    render(graded());

    expect(along("search").at(-1)).toBe("Not measured");
  });

  it("rolls a row of passes up to a pass", () => {
    render(graded());

    expect(along("ledger").at(-1)).toBe("Healthy");
  });

  it("renders no rollup column without rollup", () => {
    render(graded({ rollup: undefined }));

    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
  });

  it("renders a tbody per group", () => {
    render(graded());

    expect(screen.getAllByRole("rowgroup")).toHaveLength(3);
  });

  it("heads each group with its name", () => {
    render(graded());

    expect(screen.getByRole("rowheader", { name: "Payments" })).toBeTruthy();
  });

  it("renders one tbody when a row has no group", () => {
    render(graded({ rows: [...ROWS, { id: "loose", label: "loose-api" }] }));

    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
  });

  it("renders the empty content without rows", () => {
    render(graded({ empty: "Nothing measured yet", rows: [] }));

    expect(screen.getByText("Nothing measured yet")).toBeTruthy();
  });

  it("renders only the header row without rows or empty content", () => {
    render(graded({ rows: [] }));

    expect(screen.queryAllByRole("row")).toHaveLength(1);
  });

  it("applies the size class to the legend", () => {
    const { container } = render(graded({ size: "lg" }));

    expect(slotClasses(container, "status-matrix", "legend")).toContain(
      variantClass(slotClass("status-matrix", "legend"), "size", "lg"),
    );
  });

  it("renders no caption without the prop", () => {
    const { container } = render(graded({ caption: undefined }));

    expect(container.querySelector("caption")).toBeNull();
  });

  it("labels a cell with cellLabel", () => {
    render(graded({ cellLabel: (state, row, column) => `${row.id}/${column.id}: ${state.label}` }));

    expect(along("checkout")[0]).toBe("checkout/eu: Healthy");
  });

  it("renders no button without onSelectCell", () => {
    render(graded());

    expect(screen.queryAllByRole("button")).toStrictEqual([]);
  });

  it("renders a button in every crossing with onSelectCell", () => {
    render(graded({ onSelectCell: vi.fn<() => void>() }));

    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("calls onSelectCell with the pressed pair and its cell", async () => {
    const heard = vi.fn<(row: string, column: string, cell: MatrixCell | undefined) => void>();

    render(graded({ onSelectCell: heard }));
    await pressed(screen.getByRole("button", { name: "Down" }));

    expect(heard).toHaveBeenCalledWith("checkout", "us", {
      column: "us",
      row: "checkout",
      state: "down",
    });
  });

  it("calls onSelectCell with no cell for a gap", async () => {
    const heard = vi.fn<(row: string, column: string, cell: MatrixCell | undefined) => void>();

    render(graded({ cellLabel: (state, row) => `${row.id}: ${state.label}`, onSelectCell: heard }));
    await pressed(screen.getByRole("button", { name: "search: Not measured" }));

    expect(heard).toHaveBeenCalledWith("search", "apac", undefined);
  });

  it("lists every state in the legend with unmeasured", () => {
    render(graded());

    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });

  it("lists the unmeasured state last", () => {
    render(graded());

    expect(screen.getAllByRole("listitem").at(-1)?.textContent).toBe("Not measured");
  });

  it("renders no legend without the prop", () => {
    render(graded({ legend: undefined }));

    expect(screen.queryByRole("list")).toBeNull();
  });

  it("sets data-row and data-column on a cell", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('td[data-row="ledger"][data-column="eu"]')).toHaveLength(1);
  });

  it("sets data-column on a column header", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('th[data-column="eu"]')).toHaveLength(1);
  });

  it("sets data-lit on the row and the column under the pointer", () => {
    const { container } = render(graded());

    fireEvent.pointerMove(crossing(container, "us"));

    expect(container.querySelectorAll("[data-lit]")).toHaveLength(8);
  });

  it("sets data-lit on the rollup column under the pointer", () => {
    const { container } = render(graded());

    fireEvent.pointerMove(crossing(container, "rollup"));

    expect(container.querySelectorAll('[data-column="rollup"][data-lit]')).toHaveLength(4);
  });

  it("sets data-column rollup on the rollup header and cells", () => {
    const { container } = render(graded());

    expect(container.querySelectorAll('[data-column="rollup"]')).toHaveLength(4);
  });

  it("extends the rollup identifier past a caller's column named rollup", () => {
    const { container } = render(
      graded({ columns: [...COLUMNS, { id: "rollup", label: "Rollup" }] }),
    );

    expect(container.querySelectorAll('[data-column="rollup-"]')).toHaveLength(4);
  });

  it("names the scroller by the caption", () => {
    const { container } = render(graded());
    const named = container.querySelector("[aria-labelledby]")?.getAttribute("aria-labelledby");

    expect(container.querySelector(`#${CSS.escape(named ?? "")}`)?.textContent).toBe(
      "Service health by region",
    );
  });

  it("passes none of its own props to the scroller", () => {
    const { container } = render(graded());

    expect(container.querySelector("[cells], [states], [unmeasured], [rollup]")).toBeNull();
  });
});
