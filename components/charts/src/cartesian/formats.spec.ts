import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ROWS, SERIES } from "#cartesian/cartesian.fixtures.ts";
import { formatsOf } from "#cartesian/formats.ts";
import { useChart } from "#chart/use-chart.ts";

/**
 * Returns a chart over the fixture rows in the locale en-US.
 */
function chartOf(): ReturnType<typeof useChart> {
  return renderHook(() => useChart({ data: ROWS, locale: "en-US", series: SERIES })).result.current;
}

describe("formatsOf", () => {
  it("writes values with the value options", () => {
    const formats = formatsOf(chartOf(), {
      stack: "none",
      valueOptions: { currency: "EUR", style: "currency" },
    });

    expect(formats.value(1234.5)).toBe("€1,234.50");
  });

  it("writes value ticks with the value options when not stacked to 100%", () => {
    const formats = formatsOf(chartOf(), {
      stack: "stacked",
      valueOptions: { notation: "compact" },
    });

    expect(formats.tick(12_000)).toBe("12K");
  });

  it("writes value ticks as whole percentages when stacked to 100%", () => {
    const formats = formatsOf(chartOf(), {
      stack: "percent",
      valueOptions: { notation: "compact" },
    });

    expect(formats.tick(0.254)).toBe("25%");
  });

  it("writes tooltip values with the value options when stacked to 100%", () => {
    const formats = formatsOf(chartOf(), {
      stack: "percent",
      valueOptions: { notation: "compact" },
    });

    expect(formats.value(12_000)).toBe("12K");
  });

  it("writes categories with the label options", () => {
    const formats = formatsOf(chartOf(), {
      labelOptions: { timeZone: "UTC", weekday: "short" },
      stack: "none",
    });

    expect(formats.label?.("2026-09-21")).toBe("Mon");
  });

  it("returns no category formatter without label options", () => {
    expect(formatsOf(chartOf(), { stack: "none" }).label).toBeUndefined();
  });

  it("writes end ticks with the end options", () => {
    const formats = formatsOf(chartOf(), { endOptions: { style: "percent" }, stack: "none" });

    expect(formats.end(0.5)).toBe("50%");
  });

  it("writes a tooltip value with the end options for a series on the end axis", () => {
    const formats = formatsOf(chartOf(), {
      endKeys: ["refunded"],
      endOptions: { style: "percent" },
      stack: "none",
    });

    expect(formats.value(0.25, { dataKey: "refunded" })).toBe("25%");
  });

  it("finds a band on the end axis by its name", () => {
    const formats = formatsOf(chartOf(), {
      endKeys: ["refunded"],
      endOptions: { style: "percent" },
      stack: "none",
    });

    expect(formats.value(0.25, { name: "refunded" })).toBe("25%");
  });

  it("writes a tooltip value with the value options for a series on the start axis", () => {
    const formats = formatsOf(chartOf(), {
      endKeys: ["refunded"],
      endOptions: { style: "percent" },
      stack: "none",
    });

    expect(formats.value(0.25, { dataKey: "paid" })).toBe("0.25");
  });
});
