import { type ReactElement } from "react";

import { act, fireEvent, render, type RenderResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { LIT } from "#heat/recipe.ts";
import { type Paint } from "#heat/scale.ts";
import { type Axes, type HeatmapCell, keyOf, resolve } from "#heatmap/cells.ts";
import { HeatmapGrid, type HeatmapGridProps } from "#heatmap/grid.tsx";

/**
 * Lists four readings: Monday at 09 and 10, Tuesday at 10, and Tuesday at 09 missing.
 */
const CELLS: readonly HeatmapCell[] = [
  { column: "09", row: "mon", value: 10 },
  { column: "10", row: "mon", value: 30 },
  { column: "09", row: "tue", value: null },
  { column: "10", row: "tue", value: 20 },
];

/**
 * Lists the fixture's rows and columns with their words.
 */
const AXES: Axes = {
  columns: [
    { key: "09", label: "09:00" },
    { key: "10", label: "10:00" },
  ],
  rows: [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
  ],
};

/**
 * Resolves the fixture's readings on its rows and columns.
 */
const RESOLVED = resolve(CELLS, AXES);

/**
 * Colors the cells on a sequential scale from 10 to 30 in the first series color.
 */
const PAINT: Paint = {
  color: "series.1",
  colors: { negative: "orange", positive: "blue" },
  domain: { max: 30, min: 10 },
  midpoint: 0,
  scale: "sequential",
};

/**
 * Returns the grid with the fixture's cells, no readout at first and a writer that appends a unit.
 */
function tree(changes: Partial<HeatmapGridProps<HeatmapCell>> = {}): ReactElement {
  return charted({
    children: (
      <HeatmapGrid
        initial={undefined}
        locale="en-US"
        onSelect={undefined}
        paint={PAINT}
        printed={false}
        resolved={RESOLVED}
        shape={undefined}
        size={undefined}
        sparse={false}
        words={{ corner: "Day", label: "Orders per hour", missing: "No data", value: "Orders" }}
        write={(value) => `${String(value)} orders`}
        {...changes}
      />
    ),
  });
}

/**
 * Renders the grid with the fixture's cells and the changes a case states.
 */
function gridded(changes: Partial<HeatmapGridProps<HeatmapCell>> = {}): RenderResult {
  return render(tree(changes));
}

/**
 * Returns the cell of a row and a column.
 */
function cellAt(row: string, column: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture renders every pair
  return document.querySelector(`[data-cell='${keyOf(row, column)}']`) as HTMLElement;
}

describe("HeatmapGrid", () => {
  it("renders the table named by its label", () => {
    gridded();

    expect(screen.getByRole("grid", { name: "Orders per hour" })).toBeDefined();
  });

  it("lights the column heading of the cell the readout shows", () => {
    gridded({ initial: keyOf("tue", "10") });

    expect(screen.getByRole("columnheader", { name: "10:00" }).hasAttribute(LIT)).toBe(true);
  });

  it("writes the readout's heading from the row's and the column's words", () => {
    gridded({ initial: keyOf("tue", "10") });

    expect(document.querySelector(".chart__heading")?.textContent).toBe("Tue · 10:00");
  });

  it("writes the readout's heading from a reading's label", () => {
    gridded({
      initial: keyOf("mon", "09"),
      resolved: resolve([{ column: "09", label: "Monday 09:00", row: "mon", value: 4 }], AXES),
    });

    expect(document.querySelector(".chart__heading")?.textContent).toBe("Monday 09:00");
  });

  it("writes the value's name and the value in the readout", () => {
    gridded({ initial: keyOf("tue", "10") });

    expect(document.querySelector(".chart__row")?.textContent).toBe("Orders20 orders");
  });

  it("renders no readout while it shows no cell", () => {
    gridded();

    expect(document.querySelector(".heat__readout")).toBeNull();
  });

  it("calls onSelect with the reading of a pressed cell", () => {
    const onSelect = vi.fn<(cell: HeatmapCell) => void>();

    gridded({ onSelect });
    fireEvent.click(cellAt("mon", "10"));

    expect(onSelect).toHaveBeenCalledWith({ column: "10", row: "mon", value: 30 });
  });

  it("calls onSelect with a missing reading", () => {
    const onSelect = vi.fn<(cell: HeatmapCell) => void>();

    gridded({ onSelect });
    fireEvent.click(cellAt("tue", "09"));

    expect(onSelect).toHaveBeenCalledWith({ column: "09", row: "tue", value: null });
  });

  it("calls onSelect with the caller's own reading", () => {
    const onSelect = vi.fn<(cell: HeatmapCell) => void>();
    const day = { column: "09", date: "2026-03-03", row: "mon", value: 4 };

    gridded({ onSelect, resolved: resolve([day], AXES) });
    fireEvent.click(cellAt("mon", "09"));

    expect(onSelect.mock.lastCall?.[0]).toBe(day);
  });

  it("calls nothing for a pair without a reading", () => {
    const onSelect = vi.fn<(cell: HeatmapCell) => void>();

    gridded({
      onSelect,
      resolved: resolve(CELLS, {
        ...AXES,
        rows: [...(AXES.rows ?? []), { key: "wed", label: "Wed" }],
      }),
    });
    fireEvent.click(cellAt("wed", "09"));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("walks past a pair without a reading in a sparse grid", () => {
    gridded({
      resolved: resolve(CELLS, {
        columns: AXES.columns,
        rows: [
          { key: "mon", label: "Mon" },
          { key: "wed", label: "Wed" },
          { key: "tue", label: "Tue" },
        ],
      }),
      sparse: true,
    });
    act(() => {
      cellAt("mon", "09").focus();
    });
    fireEvent.keyDown(cellAt("mon", "09"), { key: "ArrowDown" });

    expect(document.activeElement).toBe(cellAt("tue", "09"));
  });

  it("scrolls the scroll area until the initial cell is inside it", () => {
    const { rerender } = gridded();
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the grid renders the table's scroll area
    const viewport = document.querySelector(".table__viewport") as HTMLElement;

    viewport.style.overflowX = "auto";
    Object.defineProperty(viewport, "clientWidth", { value: 200 });
    Object.defineProperty(viewport, "scrollWidth", { value: 600 });
    Object.defineProperty(viewport, "scrollLeft", { value: 0, writable: true });
    vi.spyOn(viewport, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 120));
    vi.spyOn(cellAt("tue", "10"), "getBoundingClientRect").mockReturnValue(
      new DOMRect(300, 60, 40, 30),
    );
    rerender(tree({ initial: keyOf("tue", "10") }));

    expect(viewport.scrollLeft).toBe(140);
  });

  it("keeps the scroll area's viewport out of the tab order", () => {
    gridded();

    expect(document.querySelector(".table__viewport")?.getAttribute("tabindex")).toBe("-1");
  });

  it("names the values in the key", () => {
    gridded();

    expect(document.querySelector(".heat__key-label")?.textContent).toBe("Orders");
  });

  it("sizes the cells at a stated size", () => {
    gridded({ size: "lg" });

    expect(cellAt("mon", "09").className).toContain("heat__cell--lg");
  });

  it("shapes the cells at a stated shape", () => {
    gridded({ shape: "square" });

    expect(cellAt("mon", "09").className).toContain("heat__cell--square");
  });
});
