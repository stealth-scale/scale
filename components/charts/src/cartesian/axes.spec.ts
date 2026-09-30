import { XAxis, YAxis } from "recharts";
import { describe, expect, it } from "vitest";

import { axesOf } from "#cartesian/axes.tsx";
import { type Formats } from "#cartesian/formats.ts";

/**
 * Formatters that write every value as one word, told apart by the word.
 */
const FORMATS: Formats = {
  end: () => "end",
  label: () => "label",
  tick: () => "tick",
  value: () => "value",
};

describe("axesOf", () => {
  it("returns the category axis across the bottom for an upright chart", () => {
    const [category] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: [0, 100],
    });

    expect([category?.type, category?.props]).toMatchObject([
      XAxis,
      {
        axisLine: false,
        dataKey: "day",
        tickFormatter: FORMATS.label,
        tickLine: false,
        tickMargin: 8,
      },
    ]);
  });

  it("returns the value axis at the start edge for an upright chart", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: [0, 100],
    });

    expect([value?.type, value?.props]).toMatchObject([
      YAxis,
      {
        axisLine: false,
        domain: [0, 100],
        tickFormatter: FORMATS.tick,
        tickLine: false,
        tickMargin: 8,
        width: "auto",
      },
    ]);
  });

  it("returns a numeric value axis across the bottom for bars on their side", () => {
    const [value] = axesOf({
      categoryKey: "day",
      direction: "horizontal",
      formats: FORMATS,
      valueDomain: [0, 100],
    });

    expect([value?.type, value?.props]).toMatchObject([XAxis, { type: "number" }]);
  });

  it("returns a category axis at the start edge for bars on their side", () => {
    const [, category] = axesOf({
      categoryKey: "day",
      direction: "horizontal",
      formats: FORMATS,
      valueDomain: [0, 100],
    });

    expect([category?.type, category?.props]).toMatchObject([
      YAxis,
      { dataKey: "day", type: "category", width: "auto" },
    ]);
  });

  it("labels every value tick of an upright chart", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(value?.props).toMatchObject({ interval: 0 });
  });

  it("labels every value tick of bars on their side", () => {
    const [value] = axesOf({
      categoryKey: "day",
      direction: "horizontal",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(value?.props).toMatchObject({ interval: 0 });
  });

  it("labels every tick of the end axis", () => {
    const [, , end] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      end: { domain: undefined },
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(end?.props).toMatchObject({ interval: 0 });
  });

  it("labels every category of bars on their side", () => {
    const [, category] = axesOf({
      categoryKey: "day",
      direction: "horizontal",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(category?.props).toMatchObject({ interval: 0 });
  });

  it("leaves the category ticks of an upright chart to recharts' spacing", () => {
    const [category] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(category?.props).not.toHaveProperty("interval");
  });

  it("leaves out the category formatter without a label format", () => {
    const [category] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: { ...FORMATS, label: undefined },
      valueDomain: [0, 100],
    });

    expect(category?.props).not.toHaveProperty("tickFormatter");
  });

  it("returns an end axis at the end edge while one is stated", () => {
    const [, , end] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      end: { domain: [0, 1] },
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect([end?.type, end?.props]).toMatchObject([
      YAxis,
      { domain: [0, 1], orientation: "right", tickFormatter: FORMATS.end, yAxisId: "end" },
    ]);
  });

  it("returns no end axis without one", () => {
    expect(
      axesOf({
        categoryKey: "day",
        direction: "vertical",
        formats: FORMATS,
        valueDomain: undefined,
      }),
    ).toHaveLength(2);
  });

  it("leaves out the end axis' domain without one", () => {
    const [, , end] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      end: { domain: undefined },
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(end?.props).not.toHaveProperty("domain");
  });

  it("hides the value axis' ticks when hidden is set", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      hidden: true,
      valueDomain: undefined,
    });

    expect(value?.props).toMatchObject({ hide: true });
  });

  it("pads the top of an upright value axis by headroom", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      headroom: 20,
      valueDomain: undefined,
    });

    expect(value?.props).toMatchObject({ padding: { top: 20 } });
  });

  it("leaves the value axis unpadded without headroom", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(value?.props).not.toHaveProperty("padding");
  });

  it("leaves out the value domain without a valueDomain", () => {
    const [, value] = axesOf({
      categoryKey: "day",
      direction: "vertical",
      formats: FORMATS,
      valueDomain: undefined,
    });

    expect(value?.props).not.toHaveProperty("domain");
  });
});
