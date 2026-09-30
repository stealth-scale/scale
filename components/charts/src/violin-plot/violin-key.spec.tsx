import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { ViolinKey } from "#violin-plot/violin-key.tsx";

/**
 * Names the parts of a violin.
 */
const WORDS = {
  count: "Count",
  density: "Density",
  median: "Median",
  peaks: "Peaks",
  quartiles: "Middle half",
  range: "Range",
};

/**
 * Renders the key in a chart's root and returns its entries.
 */
function itemsOf(quartiles = true): Element[] {
  const { container } = render(
    charted({ children: <ViolinKey color="red" quartiles={quartiles} words={WORDS} /> }),
  );

  return [...container.querySelectorAll("li")];
}

describe("ViolinKey", () => {
  it("names the density the middle half and the median in reading order", () => {
    expect(itemsOf().map((item) => item.textContent)).toStrictEqual([
      "Density",
      "Middle half",
      "Median",
    ]);
  });

  it("names the density alone while quartiles is false", () => {
    expect(itemsOf(false).map((item) => item.textContent)).toStrictEqual(["Density"]);
  });

  it("paints the density's glyph in the color", () => {
    const path = itemsOf()[0]?.querySelector("path");

    expect([path?.getAttribute("fill"), path?.getAttribute("stroke")]).toStrictEqual([
      "red",
      "red",
    ]);
  });

  it("renders the middle half's glyph in the quartile bar's class", () => {
    expect(itemsOf()[1]?.querySelectorAll("rect.chart-quartiles")).toHaveLength(1);
  });

  it("renders the median's glyph in the median's class", () => {
    expect(itemsOf()[2]?.querySelectorAll("circle.chart-median")).toHaveLength(1);
  });
});
