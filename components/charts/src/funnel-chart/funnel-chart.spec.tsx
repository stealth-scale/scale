import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { FunnelChart, type FunnelChartProps } from "#funnel-chart/funnel-chart.tsx";
import { type FunnelStage } from "#funnel-chart/steps.ts";

/**
 * Lists four stages of a checkout, 1,000 visits down to 40 payments.
 */
const STAGES: readonly FunnelStage[] = [
  { key: "visited", label: "Visited", value: 1000 },
  { key: "viewed", label: "Viewed", value: 400 },
  { key: "basket", label: "Basket", value: 380 },
  { key: "paid", label: "Paid", value: 40 },
];

/**
 * Width of the plot in the 480 by 270 layout, inside recharts' 5px margin.
 */
const WIDTH = 470;

/**
 * Renders a funnel of the four stages, with the props a case changes.
 */
function drawn(props: Partial<FunnelChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(<FunnelChart label="Checkout funnel" locale="en-US" stages={STAGES} {...props} />);
}

/**
 * Returns every stage's path, from the top.
 */
function stagesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".recharts-trapezoid")];
}

/**
 * Returns a stage's top edge and bottom edge as their left ends and widths, from its path.
 */
function edgesOf(stage: Element | undefined): { lower: number; top: number; upper: number } {
  const numbers = [...(stage?.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) =>
    Number(match[0]),
  );
  const [left = 0, , right = 0, , , , lowerLeft = 0] = numbers;

  return { lower: (numbers[4] ?? 0) - lowerLeft, top: left, upper: right - left };
}

/**
 * Returns a width rounded to a tenth of a pixel.
 */
function rounded(width: number): number {
  return Math.round(width * 10) / 10;
}

/**
 * Returns the text of every count written on a stage, from the top.
 */
function valuesOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-text.chart-share")].map(
    (text) => text.textContent,
  );
}

/**
 * Returns the tooltip's rows as their names and values.
 */
function factsOf(container: Element): string[][] {
  return [...container.querySelectorAll(".chart__tooltip .chart__row")].map((row) => [
    row.querySelector(".chart__name")?.textContent ?? "",
    row.querySelector(".chart__value")?.textContent ?? "",
  ]);
}

describe("FunnelChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <FunnelChart
          caption="Viewing a product loses the most people."
          label="Checkout funnel"
          stages={STAGES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a trapezoid per stage", () => {
    const { container } = drawn();

    expect(stagesOf(container)).toHaveLength(4);
  });

  it("sizes each stage's top edge to its share of the first stage", () => {
    const { container } = drawn();

    expect(stagesOf(container).map((stage) => edgesOf(stage).upper)).toStrictEqual([
      expect.closeTo(WIDTH, 1),
      expect.closeTo(WIDTH * 0.4, 1),
      expect.closeTo(WIDTH * 0.38, 1),
      expect.closeTo(WIDTH * 0.04, 1),
    ]);
  });

  it("narrows each stage to the next stage's width", () => {
    const { container } = drawn();
    const edges = stagesOf(container).map((stage) => edgesOf(stage));

    expect(edges.slice(0, 3).map((edge) => rounded(edge.lower))).toStrictEqual(
      edges.slice(1).map((edge) => rounded(edge.upper)),
    );
  });

  it("renders the last stage as a rectangle", () => {
    const { container } = drawn();
    const last = edgesOf(stagesOf(container).at(-1));

    expect(last.lower).toBeCloseTo(last.upper, 1);
  });

  it("centres every stage on the plot's middle", () => {
    const { container } = drawn();

    expect(
      stagesOf(container).map((stage) => {
        const edge = edgesOf(stage);

        return Math.round(edge.top + edge.upper / 2);
      }),
    ).toStrictEqual([240, 240, 240, 240]);
  });

  it("fills the first stage with the whole color over the panel", () => {
    const { container } = drawn();

    expect(stagesOf(container)[0]?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 100%, var(--colors-bg-panel))",
    );
  });

  it("fills the last stage with 35% of the color over the panel", () => {
    const { container } = drawn();

    expect(stagesOf(container).at(-1)?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 35%, var(--colors-bg-panel))",
    );
  });

  it("steps the fills evenly between the first stage and the last", () => {
    const { container } = drawn();

    expect(
      stagesOf(container).map((stage) => /(\d+)%/u.exec(stage.getAttribute("fill") ?? "")?.[1]),
    ).toStrictEqual(["100", "78", "57", "35"]);
  });

  it("fills a single stage with the whole color", () => {
    const { container } = drawn({ stages: STAGES.slice(0, 1) });

    expect(stagesOf(container)[0]?.getAttribute("fill")).toContain("100%");
  });

  it("fills the stages from the stated palette", () => {
    const { container } = drawn({ color: "teal" });

    expect(stagesOf(container)[0]?.getAttribute("fill")).toContain("var(--colors-teal-chart)");
  });

  it("writes each stage's count on it", () => {
    const { container } = drawn();

    expect(valuesOf(container)).toStrictEqual(["1,000", "400", "380", "40"]);
  });

  it("writes the counts on the stages with valueOptions", () => {
    const { container } = drawn({ valueOptions: { notation: "compact" } });

    expect(valuesOf(container)[0]).toBe("1K");
  });

  it("writes no count on the stages when values is off", () => {
    const { container } = drawn({ values: false });

    expect(valuesOf(container)).toStrictEqual([]);
  });

  it("renders the table of the steps after the plot", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot + .table__scroller table")).not.toBeNull();
  });

  it("heads the table's columns in English unless stated", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll("thead th")].map((heading) => heading.textContent),
    ).toStrictEqual(["Stage", "Count", "Of previous", "Of first"]);
  });

  it("heads the table's columns with the stated words", () => {
    const { container } = drawn({
      overallLabel: "Of visits",
      stageLabel: "Step",
      stepLabel: "Of the step before",
      valueLabel: "People",
    });

    expect(
      [...container.querySelectorAll("thead th")].map((heading) => heading.textContent),
    ).toStrictEqual(["Step", "People", "Of the step before", "Of visits"]);
  });

  it("writes a rate in the table to two significant digits", () => {
    const { container } = drawn({
      stages: [
        { key: "seen", value: 1000 },
        { key: "bought", value: 3 },
      ],
    });

    expect(container.querySelector("tbody tr:last-child td:last-child")?.textContent).toBe("0.3%");
  });

  it("writes the counts in the table with valueOptions", () => {
    const { container } = drawn({ valueOptions: { notation: "compact" } });

    expect(container.querySelector("tbody td")?.textContent).toBe("1K");
  });

  it("names the table's scroll area Conversion by stage unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".table__viewport")?.getAttribute("aria-label")).toBe(
      "Conversion by stage",
    );
  });

  it("names the table's scroll area by stepsLabel", () => {
    const { container } = drawn({ stepsLabel: "Checkout steps" });

    expect(container.querySelector(".table__viewport")?.getAttribute("aria-label")).toBe(
      "Checkout steps",
    );
  });

  it("renders no table when steps is off", () => {
    const { container } = drawn({ steps: false });

    expect(container.querySelector("table")).toBeNull();
  });

  it("renders No data in the plot's place without stages", () => {
    const { container } = drawn({ stages: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without stages", () => {
    const { container } = drawn({ empty: "No sessions this week.", stages: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No sessions this week.");
  });

  it("renders no table without stages", () => {
    const { container } = drawn({ stages: [] });

    expect(container.querySelector("table")).toBeNull();
  });

  it("names the keyboard layer by the label", () => {
    const { getByRole } = drawn();

    expect(getByRole("application", { name: "Checkout funnel" })).toBeDefined();
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Viewing a product loses the most people." });

    expect(getByRole("figure", { name: "Viewing a product loses the most people." })).toBeDefined();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders no legend", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__legend")).toBeNull();
  });

  it("heads the tooltip with the stage's name", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(container.querySelector(".chart__tooltip .chart__heading")?.textContent).toBe("Basket");
  });

  it("heads the tooltip with the stage's key without a label", () => {
    const { container } = drawn({ defaultIndex: 0, stages: [{ key: "visited", value: 10 }] });

    expect(container.querySelector(".chart__tooltip .chart__heading")?.textContent).toBe("visited");
  });

  it("writes the stage's count and both rates in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(factsOf(container)).toStrictEqual([
      ["Count", "380"],
      ["Of previous", "95%"],
      ["Of first", "38%"],
    ]);
  });

  it("writes no share of the stage before in the first stage's tooltip", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(factsOf(container)).toStrictEqual([
      ["Count", "1,000"],
      ["Of first", "100%"],
    ]);
  });

  it("walks the stages with the arrow keys", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Checkout funnel" });
    const heading = (): string =>
      container.querySelector(".chart__tooltip .chart__heading")?.textContent ?? "";

    act(() => {
      surface.focus();
    });
    const first = heading();
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const second = heading();
    fireEvent.keyDown(surface, { key: "ArrowRight" });

    expect([first, second, heading()]).toStrictEqual(["Visited", "Viewed", "Basket"]);
  });

  it("names the tooltip's rows with the stated words", () => {
    const { container } = drawn({
      defaultIndex: 1,
      overallLabel: "Of visits",
      stepLabel: "Of the step before",
      valueLabel: "People",
    });

    expect(factsOf(container).map(([name]) => name)).toStrictEqual([
      "People",
      "Of the step before",
      "Of visits",
    ]);
  });

  it("renders the children inside the chart", () => {
    const { container } = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".recharts-surface .probe")).not.toBeNull();
  });

  it("gives the plot the video ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--video")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "square" });

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });
});
