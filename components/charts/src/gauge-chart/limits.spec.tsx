import { render } from "@testing-library/react";
import { PieChart } from "recharts";
import { describe, expect, it } from "vitest";

import { GaugeLimits, type GaugeLimitsProps } from "#gauge-chart/limits.tsx";

/**
 * Props of the limits of a dial from 225 to -45 degrees, three quarters of a turn.
 */
const LIMITS: GaugeLimitsProps = {
  endAngle: -45,
  inner: 0.58,
  max: "1,200",
  min: "0",
  outer: 0.97,
  reading: 0.84,
  startAngle: 225,
};

/**
 * Radius of the largest circle a 480 by 270 chart fits inside recharts' 5px margin.
 */
const RADIUS = 130;

/**
 * Returns every limit's text with its position.
 */
function limitsOf(
  props: Partial<GaugeLimitsProps> = {},
): Array<{ text: string; x: number; y: number }> {
  const { container } = render(
    <PieChart height={270} width={480}>
      <GaugeLimits {...LIMITS} {...props} />
    </PieChart>,
  );

  return [...container.querySelectorAll(".chart-limits text")].map((text) => ({
    text: text.textContent,
    x: Number(text.getAttribute("x")),
    y: Number(text.getAttribute("y")),
  }));
}

describe("GaugeLimits", () => {
  it("writes the minimum then the maximum", () => {
    expect(limitsOf().map((limit) => limit.text)).toStrictEqual(["0", "1,200"]);
  });

  it("centres the minimum on the middle of the reading's ring at the start", () => {
    expect(limitsOf()[0]?.x).toBeCloseTo(240 + RADIUS * 0.71 * Math.cos((225 * Math.PI) / 180), 1);
  });

  it("hangs the minimum under the dial's lowest corner at the start", () => {
    expect(limitsOf()[0]?.y).toBeCloseTo(135 + RADIUS * 0.97 * Math.sin(Math.PI / 4) + 4, 1);
  });

  it("centres the maximum on the middle of the reading's ring at the end", () => {
    expect(limitsOf()[1]?.x).toBeCloseTo(240 + RADIUS * 0.71 * Math.cos(-Math.PI / 4), 1);
  });

  it("hangs a value under the ring's inner corner at an end above the centre", () => {
    expect(limitsOf({ startAngle: 150 })[0]?.y).toBeCloseTo(135 - RADIUS * 0.58 * 0.5 + 4, 1);
  });

  it("centres each value on its point", () => {
    const { container } = render(
      <PieChart height={270} width={480}>
        <GaugeLimits {...LIMITS} />
      </PieChart>,
    );

    expect(
      [...container.querySelectorAll(".chart-limits text")].map((text) =>
        text.getAttribute("text-anchor"),
      ),
    ).toStrictEqual(["middle", "middle"]);
  });

  it("hangs each value's first line from its point", () => {
    const { container } = render(
      <PieChart height={270} width={480}>
        <GaugeLimits {...LIMITS} />
      </PieChart>,
    );

    expect(container.querySelector(".chart-limits tspan")?.getAttribute("dy")).toBe("0.71em");
  });

  it("writes the values in recharts' label class", () => {
    const { container } = render(
      <PieChart height={270} width={480}>
        <GaugeLimits {...LIMITS} />
      </PieChart>,
    );

    expect(container.querySelector(".chart-limits text")?.getAttribute("class")).toBe(
      "recharts-text recharts-label",
    );
  });

  it("renders nothing outside a chart", () => {
    const { container } = render(
      <svg>
        <GaugeLimits {...LIMITS} />
      </svg>,
    );

    expect(container.querySelector("text")).toBeNull();
  });
});
