import { describe, expect, it } from "vitest";

import { waterfallBars, type WaterfallStep } from "#waterfall-chart/bars.ts";

/**
 * Lists a revenue bridge: an opening balance, a rise, a fall and the closing total.
 */
const BRIDGE: readonly WaterfallStep[] = [
  { key: "opening", label: "August", total: true, value: 120 },
  { key: "new", label: "New", value: 40 },
  { key: "churn", label: "Churn", value: -25 },
  { key: "closing", label: "September", total: true },
];

describe("bars", () => {
  it("raises a total with a value from zero to that value", () => {
    const [opening] = waterfallBars(BRIDGE);

    expect(opening).toMatchObject({ change: 120, end: 120, span: [0, 120], start: 0 });
  });

  it("floats a change from the running total before it to the total after it", () => {
    const [, rise] = waterfallBars(BRIDGE);

    expect(rise).toMatchObject({ change: 40, end: 160, span: [120, 160], start: 120 });
  });

  it("floats a fall from the running total before it down to the total after it", () => {
    const [, , fall] = waterfallBars(BRIDGE);

    expect(fall).toMatchObject({ change: -25, end: 135, start: 160 });
  });

  it("spans a fall from its lower value to its higher one", () => {
    const [, , fall] = waterfallBars(BRIDGE);

    expect(fall?.span).toStrictEqual([135, 160]);
  });

  it("spans a total below zero from the total up to zero", () => {
    const [, total] = waterfallBars([
      { key: "opening", label: "Opening", value: -40 },
      { key: "closing", label: "Closing", total: true },
    ]);

    expect(total?.span).toStrictEqual([-40, 0]);
  });

  it("raises a total without a value from zero to the running total", () => {
    const [, , , total] = waterfallBars(BRIDGE);

    expect(total).toMatchObject({ change: 135, end: 135, span: [0, 135], start: 0 });
  });

  it("sets the running total to a total's value", () => {
    const [, , reset, next] = waterfallBars([
      ...BRIDGE.slice(0, 2),
      { key: "restated", label: "Restated", total: true, value: 100 },
      { key: "fees", label: "Fees", value: -5 },
    ]);

    expect([reset?.end, next?.start]).toStrictEqual([100, 100]);
  });

  it("marks each step's direction by its change", () => {
    expect(waterfallBars(BRIDGE).map((bar) => bar.direction)).toStrictEqual([
      "total",
      "up",
      "down",
      "total",
    ]);
  });

  it("marks a step without a change as up", () => {
    expect(waterfallBars([{ key: "flat", label: "Flat", value: 0 }])[0]?.direction).toBe("up");
  });

  it("continues the running total after a total", () => {
    const [, , , , next] = waterfallBars([...BRIDGE, { key: "fees", label: "Fees", value: -5 }]);

    expect(next).toMatchObject({ end: 130, start: 135 });
  });

  it("reads a value that is not a finite number as no change", () => {
    const [, missing] = waterfallBars([
      { key: "opening", label: "August", value: 120 },
      { key: "unknown", label: "Unknown", value: Number.NaN },
    ]);

    expect(missing).toMatchObject({ change: 0, end: 120, start: 120 });
  });

  it("reads a change without a value as no change", () => {
    const [, missing] = waterfallBars([
      { key: "opening", label: "August", value: 120 },
      { key: "unknown", label: "Unknown" },
    ]);

    expect(missing).toMatchObject({ change: 0, end: 120, start: 120 });
  });

  it("keeps the steps in their order with their keys and labels", () => {
    expect(waterfallBars(BRIDGE).map((bar) => [bar.key, bar.label])).toStrictEqual([
      ["opening", "August"],
      ["new", "New"],
      ["churn", "Churn"],
      ["closing", "September"],
    ]);
  });
});
