import { describe, expect, it } from "vitest";

import { DESKTOP, MOBILE, TABLET } from "#box-plot/examples/paints.ts";

describe("paints", () => {
  it.each([
    { name: "desktop", summary: DESKTOP },
    { name: "tablet", summary: TABLET },
    { name: "mobile", summary: MOBILE },
  ])("states the $name interquartile range as q3 minus q1", ({ summary }) => {
    expect(summary.iqr).toBeCloseTo(summary.q3 - summary.q1, 9);
  });

  it.each([
    { name: "desktop", summary: DESKTOP },
    { name: "tablet", summary: TABLET },
    { name: "mobile", summary: MOBILE },
  ])("ends the $name upper whisker within 1.5 IQR of the box", ({ summary }) => {
    expect(summary.whiskerHigh).toBeLessThanOrEqual(summary.q3 + 1.5 * summary.iqr);
  });

  it.each([
    { name: "desktop", summary: DESKTOP },
    { name: "tablet", summary: TABLET },
    { name: "mobile", summary: MOBILE },
  ])("puts every $name outlier past the upper whisker", ({ summary }) => {
    expect(summary.outliers.every((value) => value > summary.whiskerHigh)).toBe(true);
  });

  it("puts the phones' median at twice the desktops'", () => {
    expect(MOBILE.median).toBe(2 * DESKTOP.median);
  });
});
