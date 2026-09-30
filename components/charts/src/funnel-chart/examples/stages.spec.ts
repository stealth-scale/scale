import { describe, expect, it } from "vitest";

import { ADVERT, CHECKOUT, HIRING, TRIAL, WIDENING } from "#funnel-chart/examples/stages.ts";
import { biggestDrop, funnelSteps, funnelWidenings } from "#funnel-chart/steps.ts";

describe("stages", () => {
  it("loses the most people of the checkout before the basket", () => {
    expect(biggestDrop(funnelSteps(CHECKOUT))?.stage.key).toBe("basket");
  });

  it("loses 18500 people of the checkout before the basket", () => {
    expect(biggestDrop(funnelSteps(CHECKOUT))?.dropped).toBe(18_500);
  });

  it("widens the counted checkout at the checkout alone", () => {
    expect(funnelWidenings(WIDENING).map((stage) => stage.key)).toStrictEqual(["checkout"]);
  });

  it("narrows every other funnel at each stage", () => {
    expect(
      [CHECKOUT, HIRING, ADVERT, TRIAL].map((stages) => funnelWidenings(stages).length),
    ).toStrictEqual([0, 0, 0, 0]);
  });

  it("hires 12 of the 1280 applicants", () => {
    expect(funnelSteps(HIRING).at(-1)?.overall).toBeCloseTo(0.009_375, 9);
  });

  it("converts 13% of the trials", () => {
    expect(funnelSteps(TRIAL).at(-1)?.conversion).toBeCloseTo(0.13, 9);
  });
});
