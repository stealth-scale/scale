import { fireEvent, render, type RenderResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { Frame } from "#heat/grid.ts";
import { FILL, LIT } from "#heat/recipe.ts";
import { type Paint } from "#heat/scale.ts";
import { type Walk, type WalkHandlers } from "#heat/walk.ts";
import { type Axes, type HeatmapCell, keyOf, resolve } from "#heatmap/cells.ts";
import { HeatmapTable, type HeatmapTableProps } from "#heatmap/table.tsx";

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
 * Resolves the fixture's readings with a third row, Wednesday, without readings.
 */
const WEDNESDAY = resolve(CELLS, {
  ...AXES,
  rows: [...(AXES.rows ?? []), { key: "wed", label: "Wed" }],
});

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
 * Returns a walk that gives every cell its key and the tab stop to Monday at 10, with a press
 * handler a case reads.
 */
function walkOf(onClick: WalkHandlers["onClick"] = vi.fn<WalkHandlers["onClick"]>()): Walk {
  return {
    cellOf: (key) => ({ "data-cell": key, tabIndex: key === keyOf("mon", "10") ? 0 : -1 }),
    handlers: {
      onBlur: vi.fn<WalkHandlers["onBlur"]>(),
      onClick,
      onFocus: vi.fn<WalkHandlers["onFocus"]>(),
      onKeyDown: vi.fn<WalkHandlers["onKeyDown"]>(),
      onPointerLeave: vi.fn<WalkHandlers["onPointerLeave"]>(),
      onPointerOver: vi.fn<WalkHandlers["onPointerOver"]>(),
    },
    shown: undefined,
    stop: undefined,
  };
}

/**
 * Renders the table with the fixture's cells and the changes a case states.
 */
function tabled(changes: Partial<HeatmapTableProps<HeatmapCell>> = {}): RenderResult {
  return render(
    charted({
      children: (
        <Frame>
          <HeatmapTable
            locale="en-US"
            paint={PAINT}
            printed={false}
            resolved={resolve(CELLS, AXES)}
            shown={undefined}
            sparse={false}
            walk={walkOf()}
            words={{ corner: "Day", label: "Orders per hour", missing: "No data", value: "Orders" }}
            write={(value) => `${String(value)} orders`}
            {...changes}
          />
        </Frame>
      ),
    }),
  );
}

/**
 * Returns the cell of a row and a column.
 */
function cellAt(row: string, column: string): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the case renders the pair's cell
  return document.querySelector(`[data-cell='${keyOf(row, column)}']`) as HTMLElement;
}

describe("HeatmapTable", () => {
  it("names the grid by its label", () => {
    tabled();

    expect(screen.getByRole("grid", { name: "Orders per hour" })).toBeDefined();
  });

  it("renders a heading per column with its words", () => {
    tabled();

    expect(screen.getAllByRole("columnheader").map((heading) => heading.textContent)).toStrictEqual(
      ["Day", "09:00", "10:00"],
    );
  });

  it("renders a cell in the corner without corner words", () => {
    tabled({ words: { corner: undefined, label: "Orders", missing: "No data", value: "Orders" } });

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  it("renders a heading per row with its words", () => {
    tabled();

    expect(screen.getAllByRole("rowheader").map((heading) => heading.textContent)).toStrictEqual([
      "Mon",
      "Tue",
    ]);
  });

  it("fills a cell with a value from the scale", () => {
    tabled();

    expect(cellAt("mon", "10").style.getPropertyValue(FILL)).toBe(
      "color-mix(in oklab, var(--colors-series-1) 100%, var(--colors-bg-panel))",
    );
  });

  it("writes a cell's value in its words", () => {
    tabled();

    expect(cellAt("mon", "10").textContent).toBe("30 orders");
  });

  it("writes the missing words in a cell without a value", () => {
    tabled();

    expect(cellAt("tue", "09").textContent).toBe("No data");
  });

  it("prints a cell's value while the grid prints values", () => {
    tabled({ printed: true });

    expect(cellAt("mon", "10").querySelector(".heat__value")?.textContent).toBe("30 orders");
  });

  it("gives each cell the walk's props", () => {
    tabled();

    expect(cellAt("mon", "10").tabIndex).toBe(0);
  });

  it("puts the walk's handlers on the grid", () => {
    const onClick = vi.fn<WalkHandlers["onClick"]>();

    tabled({ walk: walkOf(onClick) });
    fireEvent.click(cellAt("mon", "10"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("lights the column heading of the shown place", () => {
    tabled({ shown: resolve(CELLS, AXES).byKey.get(keyOf("tue", "10")) });

    expect(screen.getByRole("columnheader", { name: "10:00" }).hasAttribute(LIT)).toBe(true);
  });

  it("lights the row heading of the shown place", () => {
    tabled({ shown: resolve(CELLS, AXES).byKey.get(keyOf("tue", "10")) });

    expect(screen.getByRole("rowheader", { name: "Tue" }).hasAttribute(LIT)).toBe(true);
  });

  it("lights no heading of another row", () => {
    tabled({ shown: resolve(CELLS, AXES).byKey.get(keyOf("tue", "10")) });

    expect(screen.getByRole("rowheader", { name: "Mon" }).hasAttribute(LIT)).toBe(false);
  });

  it("renders a pair without a reading as a missing cell", () => {
    tabled({ resolved: WEDNESDAY });

    expect(cellAt("wed", "09").dataset["state"]).toBe("missing");
  });

  it("renders a pair without a reading in a sparse grid as a cell outside the walk", () => {
    tabled({ resolved: WEDNESDAY, sparse: true });

    expect(document.querySelectorAll("[data-cell]")).toHaveLength(4);
  });

  it("renders a pair without a reading in a sparse grid without words", () => {
    tabled({ resolved: WEDNESDAY, sparse: true });

    expect(screen.getByRole("rowheader", { name: "Wed" }).nextElementSibling?.textContent).toBe("");
  });

  it("renders a missing reading in a sparse grid as a missing cell", () => {
    tabled({ sparse: true });

    expect(cellAt("tue", "09").dataset["state"]).toBe("missing");
  });

  it("writes a reading's text in place of its value", () => {
    tabled({
      resolved: resolve([{ column: "09", row: "mon", text: "4 of 40", value: 0.1 }], AXES),
    });

    expect(cellAt("mon", "09").textContent).toBe("4 of 40");
  });

  it("reads a reading's label and the locale's list separator before its value", () => {
    tabled({
      resolved: resolve([{ column: "09", label: "Monday 09:00", row: "mon", value: 4 }], AXES),
    });

    expect(cellAt("mon", "09").textContent).toBe("Monday 09:00, 4 orders");
  });

  it("separates a reading's label from its value in the stated locale", () => {
    tabled({
      locale: "ja-JP",
      resolved: resolve([{ column: "09", label: "月曜日", row: "mon", value: 4 }], AXES),
    });

    expect(cellAt("mon", "09").textContent).toBe("月曜日、4 orders");
  });

  it("renders a group's heading over its columns", () => {
    tabled({
      resolved: resolve(CELLS, {
        columns: [
          { group: "am", key: "09", label: "09:00" },
          { group: "am", key: "10", label: "10:00" },
        ],
        groups: [{ key: "am", label: "Morning" }],
        rows: AXES.rows,
      }),
    });

    expect(screen.getByRole("columnheader", { name: "Morning" }).getAttribute("colspan")).toBe("2");
  });

  it("renders no row of groups without groups", () => {
    tabled();

    expect(document.querySelectorAll("thead tr")).toHaveLength(1);
  });

  it("renders a place over the columns in no group", () => {
    tabled({
      resolved: resolve(CELLS, {
        columns: [
          { key: "08", label: "08:00" },
          { key: "09", label: "09:00" },
          { group: "am", key: "10", label: "10:00" },
        ],
        groups: [{ key: "am", label: "Morning" }],
        rows: AXES.rows,
      }),
    });

    expect(document.querySelector<HTMLTableCellElement>("thead tr td + td")?.colSpan).toBe(2);
  });

  it("renders a hidden group's words for a screen reader alone", () => {
    tabled({
      resolved: resolve(CELLS, {
        columns: (AXES.columns ?? []).map(({ key, label }) => ({ group: "am", key, label })),
        groups: [{ hidden: true, key: "am", label: "Morning" }],
        rows: AXES.rows,
      }),
    });

    expect(
      screen.getByRole("columnheader", { name: "Morning" }).firstElementChild?.className,
    ).toContain("heat__name");
  });

  it("renders a hidden column heading's words for a screen reader alone", () => {
    tabled({
      resolved: resolve(CELLS, {
        columns: [
          { hidden: true, key: "09", label: "09:00" },
          { key: "10", label: "10:00" },
        ],
        rows: AXES.rows,
      }),
    });

    expect(
      screen.getByRole("columnheader", { name: "09:00" }).firstElementChild?.className,
    ).toContain("heat__name");
  });

  it("renders a hidden row heading's words for a screen reader alone", () => {
    tabled({
      resolved: resolve(CELLS, {
        columns: AXES.columns,
        rows: [
          { hidden: true, key: "mon", label: "Mon" },
          { key: "tue", label: "Tue" },
        ],
      }),
    });

    expect(screen.getByRole("rowheader", { name: "Mon" }).firstElementChild?.className).toContain(
      "heat__name",
    );
  });
});
