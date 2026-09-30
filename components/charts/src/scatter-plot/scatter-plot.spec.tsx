import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { drawn, MID, NAMES, textsOf } from "#scatter-plot/scatter-plot.fixtures.tsx";
import { ScatterPlot } from "#scatter-plot/scatter-plot.tsx";

describe("ScatterPlot", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <ScatterPlot
          caption="Deals take longer to close as they grow."
          label="Days to close by deal size"
          series={[{ key: "mid", label: "Mid-market", points: MID }]}
          xKey="size"
          xLabel="Deal size"
          yKey="days"
          yLabel="Days to close"
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders the legend for two series", () => {
    expect(textsOf(drawn(), ".chart__legend button")).toStrictEqual(["Mid-market", "Enterprise"]);
  });

  it("renders no legend for one series", () => {
    const container = drawn({ series: [{ key: "mid", label: "Mid-market", points: MID }] });

    expect(container.querySelector(".chart__legend")).toBeNull();
  });

  it("renders the legend for one series when legend is set", () => {
    const container = drawn({
      legend: true,
      series: [{ key: "mid", label: "Mid-market", points: MID }],
    });

    expect(container.querySelector(".chart__legend")).not.toBeNull();
  });

  it("hides the points of a series the legend hides", () => {
    expect(
      drawn({ defaultHiddenKeys: ["enterprise"] }).querySelectorAll(".recharts-symbols"),
    ).toHaveLength(3);
  });

  it("renders No data in the plot's place without points", () => {
    const container = drawn({ series: [{ key: "mid", label: "Mid-market", points: [] }] });

    expect(textsOf(container, ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: true,
      defaultHiddenKeys: [],
      legend: true,
      legendLabel: "Segments",
      quadrants: { names: NAMES },
      xEnds: ["Small", "Large"],
      yEnds: ["Fast", "Slow"],
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("names the figure by its caption", () => {
    const container = drawn({ caption: "Deals take longer to close as they grow." });

    expect(textsOf(container, "figcaption")).toStrictEqual([
      "Deals take longer to close as they grow.",
    ]);
  });
});
