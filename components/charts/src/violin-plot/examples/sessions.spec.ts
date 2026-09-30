import { describe, expect, it } from "vitest";

import { boxStats } from "#stats/box.ts";
import { densityPeaks, kernelDensity } from "#stats/density.ts";
import { FREE, PRO, TEAM } from "#violin-plot/examples/sessions.ts";

/**
 * Lists the three plans' session lengths in the order the examples render them.
 */
const PLANS = [FREE, PRO, TEAM];

describe("sessions", () => {
  it("lists 40 sessions per plan", () => {
    expect(PLANS.map((minutes) => minutes.length)).toStrictEqual([40, 40, 40]);
  });

  it("gives Team two peaks and each other plan one", () => {
    expect(PLANS.map((minutes) => densityPeaks(kernelDensity(minutes)).length)).toStrictEqual([
      1, 1, 2,
    ]);
  });

  it("puts Team's median at 23.5 minutes between its peaks", () => {
    expect(boxStats(TEAM)?.median).toBe(23.5);
  });

  it("ends the longest session at 39 minutes", () => {
    expect(Math.max(...PLANS.flat())).toBe(39);
  });
});
