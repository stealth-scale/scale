import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { barsOf, laidOut } from "#cartesian/cartesian.fixtures.ts";
import {
  DistributionChart,
  type DistributionChartProps,
} from "#distribution-chart/distribution-chart.tsx";

/**
 * Lists two series with a value in each of two bins 10 wide, from 0 to 20.
 */
const SERIES: DistributionChartProps["series"] = [
  { key: "alpha", label: "Alpha", values: [0, 12] },
  { key: "beta", label: "Beta", values: [3, 18] },
];

/**
 * Renders the series in two bins with the props a case changes, and returns the container.
 */
function drawn(props: Partial<DistributionChartProps> = {}): HTMLElement {
  laidOut();

  return render(
    <DistributionChart bins={2} label="Values" locale="en-US" series={SERIES} {...props} />,
  ).container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

/**
 * Returns the plot's start and width from its clip path.
 */
function plotOf(container: Element): [number, number] {
  const rect = container.querySelector("clipPath rect");

  return [Number(rect?.getAttribute("x")), Number(rect?.getAttribute("width"))];
}

describe("DistributionChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <DistributionChart caption="Beta runs later than Alpha." label="Values" series={SERIES} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a bar per series in each bin that contains its values", () => {
    expect(barsOf(drawn())).toHaveLength(4);
  });

  it("places each series' bar beside the others in a bin", () => {
    const container = drawn();
    const [start, width] = plotOf(container);
    const [alpha, , beta] = barsOf(container);

    expect([alpha?.x, beta?.x, beta?.width]).toStrictEqual([start, start + width / 4, width / 4]);
  });

  it("gives a series the whole bin while the legend hides the other", () => {
    const container = drawn({ defaultHiddenKeys: ["beta"] });
    const [, width] = plotOf(container);

    expect(barsOf(container).map((bar) => bar.width)).toStrictEqual([width / 2, width / 2]);
  });

  it("heads the tooltip with the bin's range", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__heading")).toStrictEqual(["0–10"]);
  });

  it("names each row of the tooltip by its series' label", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__name")).toStrictEqual(["Alpha", "Beta"]);
  });

  it("writes each series' count in the tooltip", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__value")).toStrictEqual(["1", "1"]);
  });

  it("writes each bin as a share of its series' total with normalize", () => {
    const container = drawn({
      defaultIndex: 0,
      normalize: true,
      series: [
        { key: "alpha", label: "Alpha", values: [0, 1, 2, 15] },
        { key: "beta", label: "Beta", values: [12] },
      ],
    });

    expect(textsOf(container, ".chart__value")).toStrictEqual(["75%", "0%"]);
  });

  it("writes the value axis in percent with normalize", () => {
    const labels = textsOf(
      drawn({ normalize: true }),
      ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
    );

    expect(labels.at(-1)).toBe("60%");
  });

  it("fills each series' bars with its series color", () => {
    const fills = [...drawn().querySelectorAll(".recharts-bar")].map((bar) =>
      bar.querySelector(".recharts-bar-rectangle path")?.getAttribute("fill"),
    );

    expect(fills).toStrictEqual(["var(--colors-series-1)", "var(--colors-series-2)"]);
  });

  it("fades a series' bars while the legend points at another", () => {
    const container = drawn();

    fireEvent.pointerEnter(within(container).getByRole("button", { name: "Beta" }));

    expect(
      container
        .querySelector(".recharts-bar .recharts-bar-rectangle path")
        ?.getAttribute("opacity"),
    ).toBe("var(--chart-faded)");
  });

  it("renders the legend for two series", () => {
    expect(textsOf(drawn(), ".chart__legend button")).toStrictEqual(["Alpha", "Beta"]);
  });

  it("renders no legend for one series", () => {
    const [alpha] = SERIES;

    expect(
      drawn({ series: alpha === undefined ? [] : [alpha] }).querySelector(".chart__legend"),
    ).toBeNull();
  });

  it("renders the legend for one series when legend is set", () => {
    const [alpha] = SERIES;
    const container = drawn({ legend: true, series: alpha === undefined ? [] : [alpha] });

    expect(container.querySelector(".chart__legend")).not.toBeNull();
  });

  it("renders no bar for a series without a finite value", () => {
    const container = drawn({
      series: [
        { key: "alpha", label: "Alpha", values: [0, 12] },
        { key: "beta", label: "Beta", values: ["n/a"] },
      ],
    });

    expect(barsOf(container)).toHaveLength(2);
  });

  it("renders no legend without a finite value", () => {
    const container = drawn({
      series: [
        { key: "alpha", label: "Alpha", values: [] },
        { key: "beta", label: "Beta", values: [] },
      ],
    });

    expect(container.querySelector(".chart__legend")).toBeNull();
  });

  it("renders No data in the plot's place without a finite value", () => {
    const container = drawn({ series: [{ key: "alpha", label: "Alpha", values: [] }] });

    expect(textsOf(container, ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders a grid line at every value tick", () => {
    const container = drawn();

    expect(
      [
        ".recharts-cartesian-grid-horizontal line",
        ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ].map((selector) => container.querySelectorAll(selector).length),
    ).toStrictEqual([5, 5]);
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe("Values");
  });

  it("names the figure by its caption", () => {
    expect(textsOf(drawn({ caption: "Beta runs later." }), "figcaption")).toStrictEqual([
      "Beta runs later.",
    ]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: false,
      defaultHiddenKeys: [],
      legend: true,
      legendLabel: "Groups",
      normalize: true,
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("renders every bar at once without animate", () => {
    vi.useFakeTimers();

    const bars = barsOf(drawn());

    vi.useRealTimers();

    expect(bars).toHaveLength(4);
  });

  it("starts every bar at no height when animate is set", () => {
    vi.useFakeTimers();

    const bars = barsOf(drawn({ animate: true }));

    vi.useRealTimers();

    expect(bars).toStrictEqual([]);
  });
});
