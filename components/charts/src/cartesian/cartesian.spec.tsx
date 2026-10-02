import { render } from "@testing-library/react";
import { ReferenceLine } from "recharts";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import {
  laidOut,
  LINES,
  pathsOf,
  type Row,
  ROWS,
  SERIES,
  ticksOf,
} from "#cartesian/cartesian.fixtures.ts";
import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianCoreProps, type CoreSeries } from "#cartesian/types.ts";

/**
 * Lists the fixture's series with the second on the end axis.
 */
const ENDED: readonly CoreSeries[] = [
  { key: "paid", label: "Paid" },
  { axis: "end", key: "refunded", label: "Refunded" },
];

/**
 * Shape of an upright bar chart.
 */
const BARS = { curve: "linear", direction: "vertical", mark: "bar", stack: "none" } as const;

/**
 * Lists the paid series with the refunds as its targets.
 */
const TARGETED: readonly CoreSeries[] = [{ key: "paid", label: "Paid", target: "refunded" }];

/**
 * Renders the core over the fixture rows and series, with the props a case changes.
 */
function drawn(props: Partial<CartesianCoreProps<Row>> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <Cartesian
      categoryKey="day"
      data={ROWS}
      label="Payouts per day"
      series={SERIES}
      shape={LINES}
      {...props}
    />,
  );
}

describe("Cartesian", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <Cartesian
          caption="Payouts rose on Tuesday."
          categoryKey="day"
          data={ROWS}
          label="Payouts per day"
          series={SERIES}
          shape={LINES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the keyboard layer by the label", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface title")?.textContent).toBe("Payouts per day");
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Payouts rose on Tuesday." });

    expect(getByRole("figure", { name: "Payouts rose on Tuesday." })).toBeDefined();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders the legend while two or more series have rows", () => {
    const { getByRole } = drawn({ legendLabel: "Kinds" });

    expect(getByRole("group", { name: "Kinds" })).toBeDefined();
  });

  it("renders no legend for one series", () => {
    const { container } = drawn({ series: [{ key: "paid", label: "Paid" }] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders the legend for one series when legend is set", () => {
    const { container } = drawn({ legend: true, series: [{ key: "paid", label: "Paid" }] });

    expect(container.querySelector("fieldset")).not.toBeNull();
  });

  it("renders no legend without rows", () => {
    const { container } = drawn({ data: [] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders No data in the plot's place without rows", () => {
    const { container } = drawn({ data: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without rows", () => {
    const { container } = drawn({ data: [], empty: "No payouts this week." });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No payouts this week.");
  });

  it("renders grid lines across the value axis of an upright chart", () => {
    const { container } = drawn();

    expect(
      [".recharts-cartesian-grid-horizontal", ".recharts-cartesian-grid-vertical"].map(
        (grid) => container.querySelector(grid) !== null,
      ),
    ).toStrictEqual([true, false]);
  });

  it("renders grid lines across the value axis of bars on their side", () => {
    const { container } = drawn({ shape: { ...LINES, direction: "horizontal", mark: "bar" } });

    expect(
      [".recharts-cartesian-grid-horizontal", ".recharts-cartesian-grid-vertical"].map(
        (grid) => container.querySelector(grid) !== null,
      ),
    ).toStrictEqual([false, true]);
  });

  it("renders a grid line at every value tick", () => {
    const { container } = drawn();

    expect(
      [
        ".recharts-cartesian-grid-horizontal line",
        ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ].map((selector) => container.querySelectorAll(selector).length),
    ).toStrictEqual([5, 5]);
  });

  it("renders no grid when grid is off", () => {
    const { container } = drawn({ grid: false });

    expect(container.querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("writes the category ticks with the label options", () => {
    const { container } = drawn({ labelOptions: { timeZone: "UTC", weekday: "short" } });

    expect(ticksOf(container)).toContain("Wed");
  });

  it("writes the value ticks as percentages for a stack summed to 100%", () => {
    const { container } = drawn({ shape: { ...LINES, mark: "bar", stack: "percent" } });

    expect(ticksOf(container).at(-1)).toBe("100%");
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "square" });

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });

  it("renders recharts children inside the chart", () => {
    const { container } = drawn({ children: <ReferenceLine y={100} /> });

    expect(container.querySelector(".recharts-reference-line")).not.toBeNull();
  });

  it("fills an overlapping area with the gradient the chart renders for its series", () => {
    const { container } = drawn({ shape: { ...LINES, mark: "area" } });
    const gradient = container.querySelector(".recharts-surface defs linearGradient");

    expect(container.querySelector(".recharts-area-area")?.getAttribute("fill")).toBe(
      `url(#${gradient?.id ?? "missing"})`,
    );
  });

  it("renders the tooltip at the row defaultIndex names on the first render", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(container.querySelector(".chart__heading")?.textContent).toBe("2026-09-22");
  });

  it("renders no tooltip on the first render without defaultIndex", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("writes a bar's target after its value in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 1, series: TARGETED, shape: BARS });

    expect(container.querySelector(".chart__value")?.textContent).toBe("180, Target 30");
  });

  it("writes the zone a bar's value is in in the tooltip", () => {
    const { container } = drawn({
      defaultIndex: 1,
      series: [{ key: "paid", label: "Paid" }],
      shape: BARS,
      zones: [
        { label: "Low", upTo: 150 },
        { label: "High", upTo: 200 },
      ],
    });

    expect(container.querySelector(".chart__value")?.textContent).toBe("180, High");
  });

  it("names the target in the tooltip with targetLabel", () => {
    const { container } = drawn({
      defaultIndex: 1,
      series: TARGETED,
      shape: BARS,
      targetLabel: "Refunds",
    });

    expect(container.querySelector(".chart__value")?.textContent).toBe("180, Refunds 30");
  });

  it("names the target in the key with targetLabel", () => {
    const { container } = drawn({ series: TARGETED, shape: BARS, targetLabel: "Refunds" });

    expect(container.querySelector(".chart__key")?.textContent).toBe("Refunds");
  });

  it("renders the key while a series reads targets", () => {
    const { container } = drawn({ series: TARGETED, shape: BARS });

    expect(container.querySelector(".chart__key")?.textContent).toBe("Target");
  });

  it("renders the key while a zone has a name", () => {
    const { container } = drawn({ shape: BARS, zones: [{ label: "Low", upTo: 150 }] });

    expect(container.querySelector(".chart__key")?.textContent).toBe("Low");
  });

  it("renders no key without targets or named zones", () => {
    const { container } = drawn({ shape: BARS, zones: [{ upTo: 150 }] });

    expect(container.querySelector(".chart__key")).toBeNull();
  });

  it("renders no key without rows", () => {
    const { container } = drawn({ data: [], series: TARGETED, shape: BARS });

    expect(container.querySelector(".chart__key")).toBeNull();
  });

  it("renders each series of a mixed shape as the mark it states", () => {
    const { container } = drawn({
      series: [
        { key: "paid", label: "Paid", mark: "bar" },
        { key: "refunded", label: "Refunded", mark: "line" },
      ],
      shape: { ...LINES, mark: "mixed" },
    });

    expect(
      [".recharts-bar-rectangle", ".recharts-line-curve"].map(
        (mark) => container.querySelectorAll(mark).length,
      ),
    ).toStrictEqual([3, 1]);
  });

  it("renders an end axis while a series reads it", () => {
    const { container } = drawn({ series: ENDED });

    expect(container.querySelectorAll(".recharts-yAxis")).toHaveLength(2);
  });

  it("renders no end axis while no series reads it", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".recharts-yAxis")).toHaveLength(1);
  });

  it("writes the end axis' ticks with the end options", () => {
    const { container } = drawn({ endOptions: { style: "percent" }, series: ENDED });

    expect(ticksOf(container).at(-1)).toBe("3,200%");
  });

  it("renders no value axis for a stack about a moving baseline", () => {
    const { container } = drawn({ shape: { ...LINES, mark: "area", stack: "wiggle" } });

    expect(container.querySelector(".recharts-yAxis")).toBeNull();
  });

  it("fits the stack about a moving baseline to the plot's height", () => {
    const { container } = drawn({
      shape: { curve: "linear", direction: "vertical", mark: "area", stack: "wiggle" },
    });
    const plot = container.querySelector("clipPath rect");
    const ys = [...container.querySelectorAll(".recharts-area-area")].flatMap((area) =>
      [...(area.getAttribute("d") ?? "").matchAll(/,(-?\d+(?:\.\d+)?)/gu)].map((match) =>
        Number(match[1]),
      ),
    );
    const top = Number(plot?.getAttribute("y"));

    expect([Math.min(...ys), Math.max(...ys)]).toStrictEqual([
      top,
      top + Number(plot?.getAttribute("height")),
    ]);
  });

  it("moves the baseline of a stack for wiggle", () => {
    const stacked = pathsOf(
      drawn({ shape: { ...LINES, mark: "area", stack: "stacked" } }).container,
    );
    const wiggled = pathsOf(
      drawn({ shape: { ...LINES, mark: "area", stack: "wiggle" } }).container,
    );

    expect(wiggled).not.toStrictEqual(stacked);
  });

  it("centres a stack on a straight line for silhouette", () => {
    const wiggled = pathsOf(
      drawn({ shape: { ...LINES, mark: "area", stack: "wiggle" } }).container,
    );
    const centred = pathsOf(
      drawn({ shape: { ...LINES, mark: "area", stack: "silhouette" } }).container,
    );

    expect(centred).not.toStrictEqual(wiggled);
  });

  it("stacks the marks in the order stackOrder states", () => {
    const { container } = drawn({
      shape: { ...LINES, mark: "area", stack: "stacked" },
      stackOrder: ["refunded", "paid"],
    });

    expect(
      [...container.querySelectorAll(".recharts-area-area")].map((area) =>
        area.getAttribute("fill"),
      ),
    ).toStrictEqual(["var(--colors-series-2)", "var(--colors-series-1)"]);
  });

  it("lists the series in the legend in their order whatever stackOrder states", () => {
    const { getByRole } = drawn({
      legendLabel: "Kinds",
      shape: { ...LINES, mark: "area", stack: "stacked" },
      stackOrder: ["refunded", "paid"],
    });

    expect(
      [...getByRole("group", { name: "Kinds" }).querySelectorAll("button")].map(
        (button) => button.textContent,
      ),
    ).toStrictEqual(["Paid", "Refunded"]);
  });

  it("renders a mark per annotation", () => {
    const { container } = drawn({
      annotations: [
        { at: "2026-09-22", key: "deploy", label: "Deploy" },
        { at: "2026-09-21", key: "freeze", label: "Freeze", until: "2026-09-22" },
        { at: "2026-09-23", key: "spike", label: "Spike", value: 150 },
      ],
    });

    expect(container.querySelectorAll(".chart-annotation")).toHaveLength(3);
  });

  it("writes an annotation's words on the plot", () => {
    const { container } = drawn({
      annotations: [{ at: "2026-09-22", key: "deploy", label: "Deploy 4.12" }],
    });

    expect(container.querySelector(".chart-annotation-label")?.textContent).toBe("Deploy 4.12");
  });

  it("lists the annotations at the category in the tooltip", () => {
    const { container } = drawn({
      annotations: [{ at: "2026-09-22", key: "deploy", label: "Deploy 4.12" }],
      defaultIndex: 1,
    });

    expect(
      [...container.querySelectorAll(".chart__row")].at(-1)?.querySelector(".chart__name")
        ?.textContent,
    ).toBe("Deploy 4.12");
  });

  it("dashes an earlier period in the neutral palette's chart color", () => {
    const { container } = drawn({
      series: [
        { key: "paid", label: "Paid" },
        { key: "refunded", label: "Earlier", previousOf: "paid" },
      ],
    });
    const earlier = container.querySelectorAll(".recharts-line-curve")[1];

    expect([
      earlier?.getAttribute("stroke"),
      earlier?.getAttribute("stroke-dasharray"),
    ]).toStrictEqual(["var(--colors-neutral-chart)", "6 4"]);
  });

  it("writes the change from the earlier period in the tooltip", () => {
    const { container } = drawn({
      defaultIndex: 1,
      locale: "en-US",
      series: [
        { key: "paid", label: "Paid" },
        { key: "refunded", label: "Earlier", previousOf: "paid" },
      ],
    });

    expect(container.querySelector(".chart__value")?.textContent).toBe("180, +500%");
  });
});
