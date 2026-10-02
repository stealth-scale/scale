import { render } from "@testing-library/react";
import { Bar, BarChart } from "recharts";
import { describe, expect, it } from "vitest";

import { Values } from "#waterfall-chart/values.tsx";

/**
 * Describes one row of the fixture chart.
 */
interface Step {
  readonly note: string;
  readonly span: readonly [number, number];
}

/**
 * Returns the given number of steps, each labelled "+€18.4K".
 */
function stepsOf(count: number): Step[] {
  return Array.from({ length: count }, (_, index) => ({
    note: "+€18.4K",
    span: [index, index + 1] as const,
  }));
}

/**
 * Renders a 480 by 270 bar chart of the steps with their values, and returns the container.
 */
function drawn(steps: Step[]): Element {
  return render(
    <BarChart data={steps} height={270} width={480}>
      <Bar dataKey="span" isAnimationActive={false}>
        <Values count={steps.length} noteOf={(step: Step) => step.note} widest={7} />
      </Bar>
    </BarChart>,
  ).container;
}

describe("Values", () => {
  it("writes each bar's value while the widest value fits a step", () => {
    expect(drawn(stepsOf(4)).querySelectorAll(".recharts-label-list text")).toHaveLength(4);
  });

  it("writes no value while the widest value would run into its neighbour", () => {
    expect(drawn(stepsOf(14)).querySelector(".recharts-label-list")).toBeNull();
  });

  it("renders no label outside a chart's bars", () => {
    const { container } = render(
      <svg>
        <Values count={4} noteOf={(step: Step) => step.note} widest={7} />
      </svg>,
    );

    expect(container.querySelector("text")).toBeNull();
  });
});
