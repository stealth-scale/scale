import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EndTick } from "#scatter-plot/end-tick.tsx";

/**
 * Renders the tick of an axis' end at 10 across and 20 down, and returns its text.
 */
function tickOf(axis: "x" | "y", index: number): null | SVGTextElement {
  return render(
    <svg>
      <EndTick axis={axis} ends={["Rare", "Certain"]} index={index} x={10} y={20} />
    </svg>,
  ).container.querySelector("text");
}

describe("EndTick", () => {
  it.each([
    { anchor: "start", axis: "x", index: 0, words: "Rare" },
    { anchor: "end", axis: "x", index: 1, words: "Certain" },
    { anchor: "end", axis: "y", index: 0, words: "Rare" },
    { anchor: "end", axis: "y", index: 1, words: "Certain" },
  ] as const)(
    "writes $words anchored at its $anchor at tick $index of the $axis axis",
    ({ anchor, axis, index, words }) => {
      const tick = tickOf(axis, index);

      expect([tick?.textContent, tick?.getAttribute("text-anchor")]).toStrictEqual([words, anchor]);
    },
  );

  it.each([
    { axis: "x", dy: "0.71em", index: 0 },
    { axis: "x", dy: "0.71em", index: 1 },
    { axis: "y", dy: "0em", index: 0 },
    { axis: "y", dy: "0.71em", index: 1 },
  ] as const)("hangs tick $index of the $axis axis by $dy", ({ axis, dy, index }) => {
    expect(tickOf(axis, index)?.querySelector("tspan")?.getAttribute("dy")).toBe(dy);
  });

  it("writes at the place of the tick's label", () => {
    const tick = tickOf("x", 0);

    expect([tick?.getAttribute("x"), tick?.getAttribute("y")]).toStrictEqual(["10", "20"]);
  });

  it("writes in the class of recharts' tick labels", () => {
    expect(tickOf("y", 1)?.classList.contains("recharts-cartesian-axis-tick-value")).toBe(true);
  });
});
