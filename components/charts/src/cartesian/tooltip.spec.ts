import { renderHook } from "@testing-library/react";
import { Tooltip } from "recharts";
import { describe, expect, it } from "vitest";

import { ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { formatsOf } from "#cartesian/formats.ts";
import { type CartesianTooltipOptions, tooltipOf } from "#cartesian/tooltip.tsx";
import * as Chart from "#chart/index.ts";
import { type TooltipProps } from "#chart/tooltip.tsx";

/**
 * Returns the options of the tooltip of the fixture's payouts, with what a case changes.
 */
function optionsOf(options: Partial<CartesianTooltipOptions> = {}): CartesianTooltipOptions {
  const chart = renderHook(() => Chart.useChart({ data: ROWS, locale: "en-US", series: SERIES }))
    .result.current;

  return {
    annotations: [],
    categoryKey: "day",
    chart,
    formats: formatsOf(chart, { stack: "none" }),
    series: SERIES,
    zones: [],
    ...options,
  };
}

/**
 * Returns the props of the kit's panel a tooltip renders.
 */
function panelOf(options: Partial<CartesianTooltipOptions> = {}): TooltipProps {
  const tooltip = tooltipOf(optionsOf(options));
  const content: unknown = Reflect.get(tooltip.props as object, "content");

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the tooltip's content is the kit's panel
  return (content as { props: TooltipProps }).props;
}

describe("tooltip", () => {
  it("returns recharts' tooltip with the kit's panel", () => {
    const tooltip = tooltipOf(optionsOf());

    expect([
      tooltip.type,
      Reflect.get(Reflect.get(tooltip.props as object, "content") as object, "type"),
    ]).toStrictEqual([Tooltip, Chart.Tooltip]);
  });

  it("opens at defaultIndex", () => {
    expect(tooltipOf(optionsOf({ defaultIndex: 1 })).props).toMatchObject({ defaultIndex: 1 });
  });

  it("leaves defaultIndex out unless stated", () => {
    expect(tooltipOf(optionsOf()).props).not.toHaveProperty("defaultIndex");
  });

  it("writes no notes without annotations", () => {
    expect(panelOf().notesOf).toBeUndefined();
  });

  it("notes the annotations at the category", () => {
    const notesOf = panelOf({
      annotations: [{ at: "2026-09-22", key: "deploy", label: "Deploy 4.12" }],
    }).notesOf;

    expect(notesOf?.("2026-09-22").map((note) => note.text)).toStrictEqual(["Deploy 4.12"]);
  });

  it("writes the zone of a bar's value with zones", () => {
    const formatValue = panelOf({
      zones: [{ color: "error", label: "Low", upTo: 200 }],
    }).formatValue;

    expect(formatValue?.(120, { dataKey: "paid", payload: ROWS[0] })).toBe("120, Low");
  });

  it("writes the change from an earlier period", () => {
    const formatValue = panelOf({
      series: [{ key: "paid" }, { key: "refunded", previousOf: "paid" }],
    }).formatValue;

    expect(formatValue?.(150, { dataKey: "paid", payload: { paid: 150, refunded: 120 } })).toBe(
      "150, +25%",
    );
  });
});
