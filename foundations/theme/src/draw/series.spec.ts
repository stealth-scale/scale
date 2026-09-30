import { describe, expect, it } from "vitest";

import { SERIES } from "#contract.ts";
import { polar } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { canonical, drawn } from "#draw/palette.ts";
import { series } from "#draw/series.ts";
import { modedAt } from "#tokens.fixtures.ts";

/**
 * Returns the hue of every member on the light page, in order.
 */
function huesOf(drawnSeries: ReturnType<typeof series>): number[] {
  return SERIES.map((step) => Math.round(polar(drawnSeries[step].value.base).hue));
}

/**
 * Measures how many degrees apart two hues are, the short way round the wheel.
 */
function degreesApart(one: number, other: number): number {
  const apart = Math.abs(one - other) % 360;

  return Math.min(apart, 360 - apart);
}

describe("series", () => {
  it("draws a member for every step", () => {
    expect(Object.keys(series({ primary: canonical("teal") }, FOUNDATION))).toStrictEqual([
      ...SERIES,
    ]);
  });

  it("takes the primary first", () => {
    expect(huesOf(series({ primary: canonical("teal") }, FOUNDATION))[0]).toBe(180);
  });

  it("takes the secondary and the accent after the primary", () => {
    const drawnSeries = series(
      { accent: canonical("yellow"), primary: canonical("teal"), secondary: canonical("pink") },
      FOUNDATION,
    );

    expect(huesOf(drawnSeries).slice(0, 3)).toStrictEqual([180, 350, 95]);
  });

  it("takes the stated hues after the intents", () => {
    const drawnSeries = series(
      { hues: { indigo: canonical("indigo") }, primary: canonical("teal") },
      FOUNDATION,
    );

    expect(huesOf(drawnSeries)[1]).toBe(280);
  });

  it("passes over a grey primary", () => {
    const drawnSeries = series(
      { hues: { pink: canonical("pink") }, primary: PAGES.dark },
      FOUNDATION,
    );

    expect(huesOf(drawnSeries)[0]).toBe(350);
  });

  it("passes over a stated color within the distance of one already taken", () => {
    const drawnSeries = series(
      { accent: canonical("blue"), primary: canonical("blue") },
      FOUNDATION,
    );

    expect(degreesApart(huesOf(drawnSeries)[1] ?? 0, 262)).toBeGreaterThan(30);
  });

  it("takes a stated list in place of the intents and hues", () => {
    const drawnSeries = series(
      { primary: canonical("blue"), series: [canonical("yellow")] },
      FOUNDATION,
    );

    expect(huesOf(drawnSeries)[0]).toBe(95);
  });

  it("fills the steps without the red or the green", () => {
    const hues = huesOf(series({ primary: canonical("blue") }, FOUNDATION));

    expect(
      hues.filter((hue) => degreesApart(hue, 25) < 20 || degreesApart(hue, 150) < 20),
    ).toStrictEqual([]);
  });

  it("draws every member at the boundary ratio plus the margin on a light page", () => {
    const drawnSeries = series({ primary: canonical("blue") }, FOUNDATION);

    expect(
      SERIES.filter((step) => contrast(drawnSeries[step].value.base, PAGES.light) < 3.05),
    ).toStrictEqual([]);
  });

  it("keeps a member at its palette's solid on a dark page", () => {
    const drawnSeries = series({ primary: canonical("teal") }, FOUNDATION);
    const teal = drawn(canonical("teal"), FOUNDATION);

    expect(modedAt(drawnSeries, "1", "_dark")).toBe(modedAt(teal, "solid.DEFAULT", "_dark"));
  });

  it("fills at no more chroma than the most saturated stated color", () => {
    const drawnSeries = series({ primary: "oklch(60% 0.06 180)" }, FOUNDATION);

    expect(polar(drawnSeries["2"].value.base).chroma).toBeLessThanOrEqual(0.1001);
  });

  it("fills at the foundation's chroma when every stated color is grey", () => {
    const drawnSeries = series({ primary: PAGES.dark }, FOUNDATION);

    expect(polar(drawnSeries["2"].value.base).chroma).toBeGreaterThan(0.13);
  });
});
