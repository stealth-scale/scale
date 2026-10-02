import { fireEvent, render, type RenderResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { FILL } from "#heat/recipe.ts";
import { type HeatmapCell, keyOf } from "#heatmap/cells.ts";
import { Heatmap, type HeatmapProps } from "#heatmap/heatmap.tsx";

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
 * Renders a heatmap of the fixture's readings in American English.
 */
function rendered(props: Partial<HeatmapProps> = {}): RenderResult {
  return render(<Heatmap cells={CELLS} label="Orders per hour" locale="en-US" {...props} />);
}

/**
 * Returns the fill of the cell of a row and a column.
 */
function fillAt(row: string, column: string): string | undefined {
  return document
    .querySelector<HTMLElement>(`[data-cell='${keyOf(row, column)}']`)
    ?.style.getPropertyValue(FILL);
}

/**
 * Returns the CSS value of a color mixed over the panel at a share in percent.
 */
function mixed(color: string, share: number): string {
  return `color-mix(in oklab, var(--colors-${color}) ${String(share)}%, var(--colors-bg-panel))`;
}

describe("Heatmap", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => (
        <Heatmap
          caption="Monday at 10:00 is the busiest hour."
          cells={CELLS}
          corner="Day"
          label="Orders per hour"
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the figure by its caption", () => {
    rendered({ caption: "Monday at 10:00 is the busiest hour." });

    expect(
      screen.getByRole("figure", { name: "Monday at 10:00 is the busiest hour." }),
    ).toBeDefined();
  });

  it("renders no caption without one", () => {
    const { container } = rendered();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("names the grid by its label", () => {
    rendered();

    expect(screen.getByRole("grid", { name: "Orders per hour" })).toBeDefined();
  });

  it("renders the empty state without a reading or an axis", () => {
    rendered({ cells: [] });

    expect(screen.getByText("No data")).toBeDefined();
  });

  it("renders no grid without a reading or an axis", () => {
    rendered({ cells: [] });

    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("renders the stated empty message", () => {
    rendered({ cells: [], empty: "No orders this week." });

    expect(screen.getByText("No orders this week.")).toBeDefined();
  });

  it("renders a grid of missing cells for stated axes without readings", () => {
    rendered({
      cells: [],
      columns: [{ key: "09", label: "09" }],
      rows: [{ key: "mon", label: "Mon" }],
    });

    expect(screen.getByRole("grid").querySelector("[data-state=missing]")).not.toBeNull();
  });

  it("takes the wide ratio for its empty state", () => {
    const { container } = rendered({ cells: [] });

    expect(container.querySelector(".chart__empty")?.className).toContain(
      variantClass("chart__empty", "ratio", "wide"),
    );
  });

  it("takes a stated ratio for its empty state", () => {
    const { container } = rendered({ cells: [], ratio: "video" });

    expect(container.querySelector(".chart__empty")?.className).toContain(
      variantClass("chart__empty", "ratio", "video"),
    );
  });

  it("writes No data in a cell without a value", () => {
    rendered();

    expect(document.querySelector("[data-state=missing]")?.textContent).toBe("No data");
  });

  it("writes the stated missing words in a cell without a value", () => {
    rendered({ missingLabel: "Not counted" });

    expect(document.querySelector("[data-state=missing]")?.textContent).toBe("Not counted");
  });

  it("names the values Value in the key", () => {
    rendered();

    expect(document.querySelector(".heat__key-label")?.textContent).toBe("Value");
  });

  it("names the values with the stated words in the key", () => {
    rendered({ valueLabel: "Orders" });

    expect(document.querySelector(".heat__key-label")?.textContent).toBe("Orders");
  });

  it("writes the words over the row headings", () => {
    rendered({ corner: "Day" });

    expect(screen.getByRole("columnheader", { name: "Day" })).toBeDefined();
  });

  it("colors the cells in the first series color", () => {
    rendered();

    expect(fillAt("mon", "10")).toBe(mixed("series-1", 100));
  });

  it("colors the cells in a stated color", () => {
    rendered({ color: "teal" });

    expect(fillAt("mon", "10")).toBe(mixed("teal-chart", 100));
  });

  it("spans the readings' values", () => {
    rendered();

    expect(fillAt("mon", "09")).toBe(mixed("series-1", 12));
  });

  it("spans a stated domain", () => {
    rendered({ domain: { max: 60, min: 0 } });

    expect(fillAt("mon", "10")).toBe(mixed("series-1", 56));
  });

  it("colors a diverging scale's values over the midpoint blue", () => {
    rendered({ scale: "diverging" });

    expect(fillAt("mon", "10")).toBe(mixed("blue-chart", 100));
  });

  it("colors a diverging scale about a midpoint of 0", () => {
    rendered({ scale: "diverging" });

    expect(fillAt("tue", "10")).toBe(mixed("blue-chart", 67));
  });

  it("colors a diverging scale's values under the midpoint orange", () => {
    rendered({ midpoint: 20, scale: "diverging" });

    expect(fillAt("mon", "09")).toBe(mixed("orange-chart", 100));
  });

  it("colors a diverging scale in stated colors", () => {
    rendered({ colors: { negative: "pink", positive: "teal" }, midpoint: 20, scale: "diverging" });

    expect(fillAt("mon", "09")).toBe(mixed("pink-chart", 100));
  });

  it("fills the strongest cell with the whole color while values print", () => {
    rendered({ values: true });

    expect(fillAt("mon", "10")).toBe(mixed("series-1", 100));
  });

  it("prints each value while values print", () => {
    rendered({ values: true });

    expect(document.querySelector(".heat__value")?.textContent).toBe("10");
  });

  it("writes the values with the stated options in the chart's locale", () => {
    rendered({ locale: "de-DE", valueOptions: { minimumFractionDigits: 1 } });

    expect(document.querySelector("[data-state=measured]")?.textContent).toBe("10,0");
  });

  it("opens the readout at the reading defaultIndex names", () => {
    rendered({ defaultIndex: 3 });

    expect(document.querySelector(".chart__heading")?.textContent).toBe("tue · 10");
  });

  it("opens no readout for a defaultIndex past the readings", () => {
    rendered({ defaultIndex: 9 });

    expect(document.querySelector(".heat__readout")).toBeNull();
  });

  it("opens no readout for a reading off the stated rows", () => {
    rendered({ defaultIndex: 3, rows: [{ key: "mon", label: "Mon" }] });

    expect(document.querySelector(".heat__readout")).toBeNull();
  });

  it("gives the tab stop to the reading defaultIndex names", () => {
    rendered({ defaultIndex: 3 });

    expect(
      document.querySelector<HTMLElement>(`[data-cell='${keyOf("tue", "10")}']`)?.tabIndex,
    ).toBe(0);
  });

  it("sizes the cells at a stated size", () => {
    rendered({ size: "sm" });

    expect(document.querySelector("[data-state=measured]")?.className).toContain("heat__cell--sm");
  });

  it("shapes the cells at a stated shape", () => {
    rendered({ shape: "square" });

    expect(document.querySelector("[data-state=measured]")?.className).toContain(
      "heat__cell--square",
    );
  });

  it("prints no value in square cells", () => {
    rendered({ shape: "square", values: true });

    expect(document.querySelector(".heat__value")).toBeNull();
  });

  it("renders a pair without a reading as missing", () => {
    rendered({ cells: CELLS.slice(0, 3) });

    expect(document.querySelectorAll("[data-cell]")).toHaveLength(4);
  });

  it("renders a pair without a reading outside the walk in a sparse grid", () => {
    rendered({ cells: CELLS.slice(0, 3), sparse: true });

    expect(document.querySelectorAll("[data-cell]")).toHaveLength(3);
  });

  it("renders the stated groups over their columns", () => {
    rendered({
      columns: [
        { group: "am", key: "09", label: "09:00" },
        { group: "am", key: "10", label: "10:00" },
      ],
      groups: [{ key: "am", label: "Morning" }],
    });

    expect(screen.getByRole("columnheader", { name: "Morning" }).getAttribute("colspan")).toBe("2");
  });

  it("calls onSelect with the caller's own reading", () => {
    const days = [{ column: "w1", date: "2026-03-03", row: "tue", value: 4 }];
    const onSelect = vi.fn<(day: (typeof days)[number]) => void>();

    render(<Heatmap cells={days} label="Days" locale="en-US" onSelect={onSelect} />);
    fireEvent.click(document.querySelector("[data-cell]") ?? document.body);

    expect(onSelect.mock.lastCall?.[0]).toBe(days[0]);
  });

  it("reads a reading's label before its value with the locale's list separator", () => {
    rendered({ cells: [{ column: "w1", label: "3月3日", row: "tue", value: 4 }], locale: "ja-JP" });

    expect(document.querySelector("[data-cell]")?.textContent).toBe("3月3日、4");
  });

  it("passes the figure's props to the figure", () => {
    rendered({ id: "orders" });

    expect(screen.getByRole("figure").id).toBe("orders");
  });
});
