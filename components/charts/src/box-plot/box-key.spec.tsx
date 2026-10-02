import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BoxKey } from "#box-plot/box-key.tsx";
import { charted } from "#chart/chart.fixtures.tsx";

/**
 * Names the parts of a box.
 */
const WORDS = {
  count: "Count",
  median: "Median",
  outliers: "Outliers",
  quartiles: "Middle half",
  whiskers: "Whiskers",
};

/**
 * Renders the key in a chart's root and returns its entries.
 */
function itemsOf(outliers = true): Element[] {
  const { container } = render(
    charted({ children: <BoxKey color="red" outliers={outliers} words={WORDS} /> }),
  );

  return [...container.querySelectorAll("li")];
}

describe("BoxKey", () => {
  it("names the four parts of a box in reading order", () => {
    expect(itemsOf().map((item) => item.textContent)).toStrictEqual([
      "Middle half",
      "Median",
      "Whiskers",
      "Outliers",
    ]);
  });

  it("leaves the outliers out while outliers is false", () => {
    expect(itemsOf(false).map((item) => item.textContent)).toStrictEqual([
      "Middle half",
      "Median",
      "Whiskers",
    ]);
  });

  it("paints the box's glyph in the color", () => {
    const rect = itemsOf()[0]?.querySelector("rect");

    expect([rect?.getAttribute("fill"), rect?.getAttribute("stroke")]).toStrictEqual([
      "red",
      "red",
    ]);
  });

  it("renders the median's glyph in the median's class", () => {
    expect(itemsOf()[1]?.querySelectorAll("line.chart-median")).toHaveLength(1);
  });

  it("renders the whiskers' glyph as a stem with two caps in the whisker's class", () => {
    expect(itemsOf()[2]?.querySelectorAll("line.chart-whisker")).toHaveLength(3);
  });

  it("edges the outlier's glyph in the color", () => {
    expect(itemsOf()[3]?.querySelector("circle.chart-outlier")?.getAttribute("stroke")).toBe("red");
  });

  it("renders the key in a list with the chart's key class", () => {
    const { container } = render(
      charted({ children: <BoxKey color="red" outliers words={WORDS} /> }),
    );

    expect(container.querySelector("ul")?.classList.contains("chart__key")).toBe(true);
  });
});
