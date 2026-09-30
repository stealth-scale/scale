import { describe, expect, it } from "vitest";

import { bulletWordsOf, targetOf } from "#cartesian/bullet-text.ts";
import { type GaugeZone } from "#gauge-chart/bands.ts";

/**
 * Lists three zones of attainment: poor, fair and good.
 */
const ZONES: readonly GaugeZone[] = [
  { label: "Poor", upTo: 60 },
  { label: "Fair", upTo: 90 },
  { label: "Good", upTo: 110 },
];

/**
 * Writes a value as a percentage.
 */
function percent(value: unknown): string {
  return `${String(value)}%`;
}

describe("bulletWordsOf", () => {
  it("writes the value then the target after its name", () => {
    const write = bulletWordsOf({
      series: [{ key: "done", target: "plan" }],
      write: percent,
      zones: [],
    });

    expect(write(92, { dataKey: "done", payload: { done: 92, plan: 100 } })).toBe(
      "92%, Target 100%",
    );
  });

  it("names the target with the word it is given", () => {
    const write = bulletWordsOf({
      series: [{ key: "done", target: "plan" }],
      targetLabel: "Plan",
      write: percent,
      zones: [],
    });

    expect(write(92, { dataKey: "done", payload: { plan: 100 } })).toBe("92%, Plan 100%");
  });

  it("writes the zone the value is in after the target", () => {
    const write = bulletWordsOf({
      series: [{ key: "done", target: "plan" }],
      write: percent,
      zones: ZONES,
    });

    expect(write(64, { dataKey: "done", payload: { plan: 80 } })).toBe("64%, Target 80%, Fair");
  });

  it("writes no zone for a value past the last zone", () => {
    const write = bulletWordsOf({ series: [{ key: "done" }], write: percent, zones: ZONES });

    expect(write(130, { dataKey: "done", payload: {} })).toBe("130%");
  });

  it("writes no target for a series without one", () => {
    const write = bulletWordsOf({ series: [{ key: "done" }], write: percent, zones: ZONES });

    expect(write(92, { dataKey: "done", payload: { plan: 100 } })).toBe("92%, Good");
  });

  it("writes no zone for a value that is not a number", () => {
    const write = bulletWordsOf({ series: [{ key: "range" }], write: percent, zones: ZONES });

    expect(write("n/a", { dataKey: "range", payload: {} })).toBe("n/a%");
  });

  it("writes the target of the series the value belongs to", () => {
    const write = bulletWordsOf({
      series: [{ key: "paid" }, { key: "done", target: "plan" }],
      write: percent,
      zones: [],
    });

    expect(write(92, { dataKey: "done", payload: { plan: 100 } })).toBe("92%, Target 100%");
  });

  it.each([
    ["null", null],
    ["a string", "row"],
  ])("writes no target for a row that is %s", (_kind, payload) => {
    const write = bulletWordsOf({
      series: [{ key: "done", target: "plan" }],
      write: percent,
      zones: [],
    });

    expect(write(92, { dataKey: "done", payload })).toBe("92%");
  });

  it.each([
    ["text", "100"],
    ["Infinity", Infinity],
  ])("writes no target for a row whose target is %s", (_kind, plan) => {
    const write = bulletWordsOf({
      series: [{ key: "done", target: "plan" }],
      write: percent,
      zones: [],
    });

    expect(write(92, { dataKey: "done", payload: { plan } })).toBe("92%");
  });

  it("reads the target a row states in the series' field", () => {
    expect(targetOf({ plan: 100 }, "plan")).toBe(100);
  });
});
