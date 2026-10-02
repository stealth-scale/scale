import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuadrantLayer } from "#scatter-plot/quadrant-layer.tsx";
import { NAMES, scored } from "#scatter-plot/scatter-plot.fixtures.tsx";

/**
 * Returns the names of the quadrants a container renders, in document order.
 */
function namesOf(container: Element): Element[] {
  return [...container.querySelectorAll("text.chart-quadrant")];
}

describe("QuadrantLayer", () => {
  it("writes each quadrant's name in reading order", () => {
    expect(namesOf(scored()).map((name) => name.textContent)).toStrictEqual([
      "Challengers",
      "Leaders",
      "Niche",
      "Visionaries",
    ]);
  });

  it("anchors each name at its corner's side", () => {
    expect(namesOf(scored()).map((name) => name.getAttribute("text-anchor"))).toStrictEqual([
      "start",
      "end",
      "start",
      "end",
    ]);
  });

  it("anchors each name vertically at its corner's edge", () => {
    expect(
      namesOf(scored()).map((name) => name.querySelector("tspan")?.getAttribute("dy")),
    ).toStrictEqual(["0.71em", "0.71em", "0em", "0em"]);
  });

  it("places each name 8px inside its corner of the plot", () => {
    const container = scored();
    const plot = container.querySelector("clipPath rect");
    const left = Number(plot?.getAttribute("x"));
    const top = Number(plot?.getAttribute("y"));
    const [first] = namesOf(container);

    expect([Number(first?.getAttribute("x")), Number(first?.getAttribute("y"))]).toStrictEqual([
      left + 8,
      top + 8,
    ]);
  });

  it("hides the names from assistive technology", () => {
    expect(namesOf(scored()).map((name) => name.getAttribute("aria-hidden"))).toStrictEqual([
      "true",
      "true",
      "true",
      "true",
    ]);
  });

  it("renders no names outside a chart", () => {
    const { container } = render(
      <svg>
        <QuadrantLayer division={{ x: 0.5, y: 0.5 }} names={NAMES} />
      </svg>,
    );

    expect(namesOf(container)).toStrictEqual([]);
  });
});
