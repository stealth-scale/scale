import { describe, expect, it } from "vitest";

import {
  biggestDrop,
  type FunnelStage,
  funnelSteps,
  funnelWidenings,
} from "#funnel-chart/steps.ts";

/**
 * Lists four stages where the step that loses the most people, 600 before Viewed, is not the step
 * with the worst rate, 11% at Paid.
 */
const STAGES: readonly FunnelStage[] = [
  { key: "visited", label: "Visited", value: 1000 },
  { key: "viewed", label: "Viewed", value: 400 },
  { key: "basket", label: "Basket", value: 380 },
  { key: "paid", label: "Paid", value: 40 },
];

/**
 * Returns stages keyed by their place, one per value.
 */
function stagesOf(...values: number[]): FunnelStage[] {
  return values.map((value, at) => ({ key: String(at), value }));
}

describe("steps", () => {
  it("returns a step per stage in the stages' order", () => {
    expect(funnelSteps(STAGES).map((step) => step.stage.key)).toStrictEqual([
      "visited",
      "viewed",
      "basket",
      "paid",
    ]);
  });

  it("returns no share of the stage before for the first stage", () => {
    expect(funnelSteps(STAGES)[0]?.conversion).toBeNull();
  });

  it("divides a stage by the stage before it", () => {
    expect(funnelSteps(STAGES)[2]?.conversion).toBeCloseTo(0.95, 9);
  });

  it("divides a stage by the first stage", () => {
    expect(funnelSteps(STAGES)[2]?.overall).toBeCloseTo(0.38, 9);
  });

  it("counts the first stage as the whole of itself", () => {
    expect(funnelSteps(STAGES)[0]?.overall).toBe(1);
  });

  it("counts what each step lost", () => {
    expect(funnelSteps(STAGES).map((step) => step.dropped)).toStrictEqual([0, 600, 20, 340]);
  });

  it("counts nothing lost for a stage that widens", () => {
    expect(funnelSteps(stagesOf(100, 250)).map((step) => step.dropped)).toStrictEqual([0, 0]);
  });

  it("converts at 0 after a stage of 0", () => {
    expect(funnelSteps(stagesOf(100, 0, 0))[2]?.conversion).toBe(0);
  });

  it("shares 0 of a first stage of 0", () => {
    expect(funnelSteps(stagesOf(0, 0)).map((step) => step.overall)).toStrictEqual([0, 0]);
  });

  it("counts a value that is not a finite number as 0", () => {
    expect(funnelSteps(stagesOf(Number.NaN, Number.POSITIVE_INFINITY))[1]?.value).toBe(0);
  });

  it("counts a value below zero as 0", () => {
    expect(funnelSteps(stagesOf(-5))[0]?.value).toBe(0);
  });

  it("returns no step without stages", () => {
    expect(funnelSteps([])).toStrictEqual([]);
  });

  it("returns the step that loses the most people", () => {
    expect(biggestDrop(funnelSteps(STAGES))?.stage.key).toBe("viewed");
  });

  it("returns the first of two steps that lose as many", () => {
    expect(biggestDrop(funnelSteps(stagesOf(100, 50, 0)))?.stage.key).toBe("1");
  });

  it("returns undefined while no step loses anything", () => {
    expect(biggestDrop(funnelSteps(stagesOf(100, 100)))).toBeUndefined();
  });

  it("returns undefined without steps", () => {
    expect(biggestDrop([])).toBeUndefined();
  });

  it("returns the stages whose count is above the stage before them", () => {
    expect(funnelWidenings(stagesOf(100, 250, 90, 120)).map((stage) => stage.key)).toStrictEqual([
      "1",
      "3",
    ]);
  });

  it("returns no stage for a stage as large as the stage before it", () => {
    expect(funnelWidenings(stagesOf(100, 100))).toStrictEqual([]);
  });

  it("returns no stage for a funnel that narrows", () => {
    expect(funnelWidenings(STAGES)).toStrictEqual([]);
  });
});
