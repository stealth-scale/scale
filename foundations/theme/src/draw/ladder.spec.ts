import { describe, expect, it } from "vitest";

import { lightnessOf, polar } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import { PAGES } from "#draw/foundation.ts";
import { apart, faded, FLOOR, isDark, ladderOf, raised, RATIOS, ratiosOf } from "#draw/ladder.ts";

const LIGHT = { ink: PAGES.dark, page: PAGES.light };

const DARK = { ink: PAGES.light, page: PAGES.dark };

const WHITE = "oklch(100% 0 0)";

/**
 * Reads the lightness of each color in a list, in percent, rounded to one decimal.
 */
function percents(colors: readonly string[]): readonly number[] {
  return colors.map((color) => Math.round(lightnessOf(color) * 1000) / 10);
}

describe("ladder", () => {
  it("reports a side dark when its ink is lighter than its page", () => {
    expect(isDark(DARK)).toBe(true);
    expect(isDark(LIGHT)).toBe(false);
  });

  it("raises the panel and the popover above the page on both sides", () => {
    const light = ladderOf(LIGHT);
    const dark = ladderOf(DARK);

    expect(percents([light.panel, light.popover])).toStrictEqual([100, 100]);
    expect(percents([dark.panel, dark.popover])).toStrictEqual([19, 22]);
  });

  it("sinks the three wells below the page on both sides", () => {
    expect(percents(ladderOf(LIGHT).wells)).toStrictEqual([93, 89, 84]);
    expect(percents(ladderOf(DARK).wells)).toStrictEqual([11, 7, 2]);
  });

  it("sinks the wells by the steps a theme states", () => {
    expect(percents(ladderOf(LIGHT, { wells: [0.015, 0.035, 0.06] }).wells)).toStrictEqual([
      95.5, 93.5, 91,
    ]);
  });

  it("sinks the fills of a light page by the foundation's steps when a theme states wells", () => {
    expect(percents(ladderOf(LIGHT, { wells: [0.015, 0.035, 0.06] }).fills)).toStrictEqual([
      93, 89, 84,
    ]);
  });

  it("sets the fills of a light page equal to the wells", () => {
    const light = ladderOf(LIGHT);

    expect(light.fills).toStrictEqual(light.wells);
  });

  it("lifts the fills of a dark page above the popover", () => {
    expect(percents(ladderOf(DARK).fills)).toStrictEqual([26, 31, 37]);
  });

  it("sinks the fills with the wells when the ink misses the text ratio on a lifted fill", () => {
    const dusk = ladderOf({ ink: "oklch(96% 0.02 16)", page: "oklch(46% 0.05 250)" });

    expect(dusk.fills).toStrictEqual(dusk.wells);
  });

  it("sinks the fills when a secondary ink has no room on the deepest lift", () => {
    const regatta = ladderOf({ ink: "oklch(94% 0.03 195)", page: "oklch(20% 0.02 260)" });

    expect(regatta.fills).toStrictEqual(regatta.wells);
  });

  it("stops the wells where a secondary ink would miss the text ratio", () => {
    const weak = ladderOf({ ink: "oklch(40% 0 0)", page: "oklch(97% 0 0)" });
    const deepest = lightnessOf(weak.wells[2]);

    expect(deepest).toBeGreaterThan(0.97 - 0.13);
    expect(contrast("oklch(40% 0 0)", weak.wells[2])).toBeGreaterThanOrEqual(7);
    expect(lightnessOf(weak.wells[0]) - deepest).toBeCloseTo((0.97 - deepest) * (9 / 13), 2);
  });

  it("stops the raised surfaces where a secondary ink would miss the text ratio", () => {
    const weak = ladderOf({ ink: "oklch(78% 0.05 150)", page: "oklch(25% 0.02 200)" });

    expect(lightnessOf(weak.popover)).toBeLessThan(0.25 + 0.07);
    expect(contrast("oklch(78% 0.05 150)", weak.popover)).toBeGreaterThanOrEqual(7);
  });

  it("raises the popover above a stated panel no further than the ink allows", () => {
    const capped = ladderOf({
      ink: "oklch(91% 0 0)",
      page: "oklch(33% 0 0)",
      panel: "oklch(36% 0 0)",
    });
    const beyond = ladderOf({
      ink: "oklch(91% 0 0)",
      page: "oklch(33% 0 0)",
      panel: "oklch(45% 0 0)",
    });

    expect(lightnessOf(capped.popover)).toBeGreaterThan(0.36);
    expect(lightnessOf(capped.popover)).toBeLessThan(0.39);
    expect(contrast("oklch(91% 0 0)", capped.popover)).toBeGreaterThanOrEqual(7);
    expect(lightnessOf(beyond.popover)).toBeCloseTo(0.45, 3);
  });

  it("uses the full steps when the ink cannot read on the page at all", () => {
    const unreadable = ladderOf({ ink: "oklch(90% 0 0)", page: "oklch(97% 0 0)" });

    expect(percents(unreadable.wells)).toStrictEqual([93, 89, 84]);
  });

  it("moves a line one step past the line before it when the two are too close", () => {
    expect(apart("oklch(30% 0 0)", "oklch(31% 0 0)", "oklch(97% 0 0)", 0.025)).toBe(
      "oklch(32.5% 0.0000 0.0)",
    );
    expect(apart("oklch(90% 0 0)", "oklch(89% 0 0)", "oklch(15% 0 0)", 0.025)).toBe(
      "oklch(87.5% 0.0000 0.0)",
    );
    expect(apart("oklch(30% 0 0)", "oklch(40% 0 0)", "oklch(97% 0 0)", 0.025)).toBe(
      "oklch(40% 0 0)",
    );
  });

  it("uses a stated panel and places the popover one step above it", () => {
    const ladder = ladderOf({ ...DARK, panel: "oklch(30% 0 0)" });

    expect(ladder.panel).toBe("oklch(30% 0 0)");
    expect(percents([ladder.popover])).toStrictEqual([33]);
  });

  it("returns the page and the ink as stated", () => {
    expect(ladderOf(LIGHT).page).toBe(PAGES.light);
    expect(ladderOf(LIGHT).ink).toBe(PAGES.dark);
  });

  it("returns the foundation's ratios with the ratios a theme restates", () => {
    expect(ratiosOf()).toStrictEqual(RATIOS);
    expect(ratiosOf({ hairline: 1.6, text: 6 })).toStrictEqual({
      boundary: 3,
      hairline: 1.6,
      label: 4.5,
      tertiary: 4.5,
      text: 6,
    });
  });

  it("clamps every ratio a theme lowers to the floor", () => {
    expect(ratiosOf({ boundary: 1, hairline: 1.1, label: 3, tertiary: 3, text: 2 })).toStrictEqual({
      ...FLOOR,
      hairline: 1.1,
    });
  });

  it("tapers the chroma of every raised surface and well to the share a theme states", () => {
    const page = "oklch(20% 0.1400 292)";
    const full = ladderOf({ ink: "oklch(95% 0.02 90)", page });
    const tapered = ladderOf({ ink: "oklch(95% 0.02 90)", page }, { chroma: 0.5 });

    expect(polar(full.panel).chroma).toBeCloseTo(0.14, 2);
    expect(polar(tapered.panel).chroma).toBeCloseTo(0.07, 2);
    expect(polar(tapered.wells[2]).chroma).toBeCloseTo(0.07, 2);
    expect(polar(tapered.page)).toStrictEqual(polar(full.page));
  });

  it("fades an ink towards the page as far as the ratio allows", () => {
    const ink = faded(PAGES.dark, PAGES.light, [PAGES.light], 7);

    expect(lightnessOf(ink)).toBeGreaterThan(lightnessOf(PAGES.dark));
    expect(contrast(ink, PAGES.light)).toBeGreaterThanOrEqual(7);
    expect(contrast(ink, PAGES.light)).toBeLessThan(7.1);
  });

  it("returns an ink that misses the ratio before it moves unchanged", () => {
    expect(faded("oklch(50% 0 0)", WHITE, [WHITE], 7)).toBe("oklch(50% 0 0)");
  });

  it("fades all the way to the page when the ratio holds there", () => {
    expect(lightnessOf(faded(PAGES.dark, PAGES.light, [PAGES.light], 1))).toBeCloseTo(0.97, 3);
  });

  it("raises a line only as far as the ratio needs", () => {
    const line = raised(PAGES.light, PAGES.dark, [PAGES.light], 1.45);

    expect(contrast(line, PAGES.light)).toBeGreaterThanOrEqual(1.45);
    expect(contrast(line, PAGES.light)).toBeLessThan(1.47);
  });

  it("returns a color that already clears the ratio unchanged", () => {
    expect(raised(PAGES.dark, PAGES.light, [PAGES.light], 3)).toBe(PAGES.dark);
  });

  it("raises a color to the ink when even the ink misses the ratio", () => {
    expect(lightnessOf(raised(PAGES.light, PAGES.dark, [PAGES.light], 30))).toBeCloseTo(0.15, 3);
  });

  it("measures a raised color against every surface given", () => {
    const line = raised(PAGES.light, PAGES.dark, [PAGES.light, "oklch(93% 0 0)"], 1.45);

    expect(contrast(line, "oklch(93% 0 0)")).toBeGreaterThanOrEqual(1.45);
  });
});
