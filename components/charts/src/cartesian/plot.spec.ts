import { type ReactElement } from "react";

import { renderHook } from "@testing-library/react";
import { AreaChart, BarChart, ComposedChart, Line, LineChart, ReferenceLine } from "recharts";
import { describe, expect, it } from "vitest";

import { LINES, ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { plotOf, type PlotProps } from "#cartesian/plot.tsx";
import { type Shape } from "#cartesian/types.ts";
import * as Chart from "#chart/index.ts";

/**
 * Returns the recharts chart of the fixture's payouts in a shape, with the props a case changes.
 */
function plotted(
  shape: Shape = LINES,
  props: Partial<PlotProps<(typeof ROWS)[number]>> = {},
): ReactElement {
  const chart = renderHook(() => Chart.useChart({ data: ROWS, series: SERIES })).result.current;

  return plotOf(chart, "gradient", {
    categoryKey: "day",
    label: "Payouts per day",
    series: SERIES,
    shape,
    ...props,
  });
}

/**
 * Returns the type of a child element, or nothing for a child that is not an element.
 */
function typeAt(child: unknown): unknown {
  return typeof child === "object" && child !== null ? Reflect.get(child, "type") : undefined;
}

/**
 * Returns every child element of an element, arrays flattened.
 */
function childrenOf(element: ReactElement): unknown[] {
  const { props } = element;
  const children: unknown =
    typeof props === "object" && props !== null && "children" in props ? props.children : undefined;

  return Array.isArray(children) ? children.flat() : [children];
}

describe("plot", () => {
  it.each([
    { mark: "line", surface: LineChart },
    { mark: "area", surface: AreaChart },
    { mark: "bar", surface: BarChart },
    { mark: "mixed", surface: ComposedChart },
  ] as const)("renders recharts' chart of the $mark mark", ({ mark, surface }) => {
    expect(plotted({ ...LINES, mark }).type).toBe(surface);
  });

  it("lays bars on their side out vertically", () => {
    expect(plotted({ ...LINES, direction: "horizontal", mark: "bar" }).props).toMatchObject({
      layout: "vertical",
    });
  });

  it("names the keyboard layer by the label", () => {
    expect(plotted().props).toMatchObject({ accessibilityLayer: true, title: "Payouts per day" });
  });

  it("renders an annotation's mark after the series' marks", () => {
    const children = childrenOf(
      plotted(LINES, { annotations: [{ at: "2026-09-22", key: "deploy", label: "Deploy" }] }),
    );

    expect(children.findIndex((child) => typeAt(child) === ReferenceLine)).toBeGreaterThan(
      children.findLastIndex((child) => typeAt(child) === Line),
    );
  });
});
