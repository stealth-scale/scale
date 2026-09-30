import { describe, expect, it } from "vitest";

import { HUES, ROLES } from "#contract.ts";
import { lightnessOf, polar } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { ladderOf } from "#draw/ladder.ts";
import { canonical, drawn, hues, sideOf } from "#draw/palette.ts";
import { stepOf } from "#draw/ramps.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

const BLUE = drawn(FOUNDATION.primary, FOUNDATION);

const PALE = "oklch(90% 0.1 95)";

describe("drawn", () => {
  it("fills every role", () => {
    expect(ROLES.every((role) => tokenAt(BLUE, role) !== undefined)).toBe(true);
  });

  it("keeps a solid as stated when it meets the boundary ratio and the label ratio", () => {
    expect(modedAt(BLUE, "solid.DEFAULT", "base")).toBe(stepOf(262, 0.14, 600));
    expect(modedAt(BLUE, "solid.DEFAULT", "_dark")).toBe(stepOf(262, 0.14, 400));
  });

  it("writes the label in whichever of the ink and the page reads better", () => {
    expect(modedAt(BLUE, "contrast", "base")).toBe(PAGES.light);
    expect(modedAt(BLUE, "contrast", "_dark")).toBe(PAGES.dark);
    expect(modedAt(drawn(canonical("yellow"), FOUNDATION), "contrast", "base")).toBe(PAGES.dark);
  });

  it("moves a solid below the boundary ratio on the page towards the ink", () => {
    const solid = modedAt(drawn(PALE, FOUNDATION), "solid.DEFAULT", "base");

    expect(lightnessOf(solid)).toBeLessThan(0.9);
    expect(contrast(solid, PAGES.light)).toBeGreaterThanOrEqual(3);
    expect(polar(solid).hue).toBeCloseTo(95, 0);
  });

  it("moves a solid whose label fails by the smaller move", () => {
    const palette = drawn("oklch(55% 0 0)", FOUNDATION);
    const solid = modedAt(palette, "solid.DEFAULT", "base");

    expect(lightnessOf(solid)).toBeLessThan(0.55);
    expect(lightnessOf(solid)).toBeGreaterThan(0.54);
    expect(contrast(modedAt(palette, "contrast", "base"), solid)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps a solid that meets the boundary ratio whichever color its label takes", () => {
    const palette = drawn("oklch(57% 0 0)", FOUNDATION);
    const solid = modedAt(palette, "solid.DEFAULT", "base");
    const label = modedAt(palette, "contrast", "base");

    expect(lightnessOf(solid)).toBeCloseTo(0.57, 3);
    expect(contrast(label, solid)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps a solid in place when a theme asks a label ratio that no color meets", () => {
    const palette = drawn("oklch(55% 0 0)", FOUNDATION, { label: 7 });
    const solid = modedAt(palette, "solid.DEFAULT", "base");

    expect(lightnessOf(solid)).toBeCloseTo(0.55, 3);
    expect(contrast(solid, PAGES.light)).toBeGreaterThanOrEqual(3);
  });

  it("returns a label at 4.5:1 or more on a solid of any lightness", () => {
    for (const lightness of [10, 30, 50, 55, 60, 70, 90]) {
      const palette = drawn(`oklch(${String(lightness)}% 0 0)`, FOUNDATION);
      const solid = modedAt(palette, "solid.DEFAULT", "base");

      expect(contrast(modedAt(palette, "contrast", "base"), solid)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("inks a label in black on a light solid when neither the ink nor the page meets the ratio", () => {
    const side = { ink: "oklch(46% 0.07 246)", page: "oklch(97.5% 0.012 16)" };
    const coral = drawn("#F67280", { dark: side, light: side }, { label: 4.5 });
    const label = modedAt(coral, "contrast", "base");

    expect(label).toBe("#000000");
    expect(contrast(label, modedAt(coral, "solid.DEFAULT", "base"))).toBeGreaterThanOrEqual(4.5);
  });

  it("inks a label in white on a dark solid when neither the ink nor the page meets the ratio", () => {
    const side = { ink: "oklch(62% 0 0)", page: "oklch(50% 0 0)" };
    const deep = drawn("oklch(30% 0 0)", { dark: side, light: side }, { label: 4.5 });
    const label = modedAt(deep, "contrast", "base");

    expect(label).toBe("#ffffff");
    expect(contrast(label, modedAt(deep, "solid.DEFAULT", "base"))).toBeGreaterThanOrEqual(4.5);
  });

  it("moves a solid towards the ink alone where the page never gives it a label", () => {
    const palette = drawn("oklch(55% 0 0)", FOUNDATION, { label: 15 });

    expect(lightnessOf(modedAt(palette, "solid.DEFAULT", "base"))).toBeLessThan(0.55);
  });

  it("keeps a solid as stated where neither side can give it a label", () => {
    const close = { ink: "oklch(60% 0 0)", page: "oklch(50% 0 0)" };
    const palette = drawn("oklch(55% 0 0)", { dark: close, light: close });

    expect(modedAt(palette, "solid.DEFAULT", "base")).toBe("oklch(55% 0 0)");
  });

  it("keeps a solid as stated when asked", () => {
    expect(modedAt(drawn(PALE, FOUNDATION, { keep: true }), "solid.DEFAULT", "base")).toBe(PALE);
  });

  it("tints the three fills at the ladder's lightness towards the solid", () => {
    expect(modedAt(BLUE, "subtle", "base")).toBe("oklch(93.0% 0.0308 262.0)");
    expect(modedAt(BLUE, "muted", "base")).toBe("oklch(89.0% 0.0438 262.0)");
    expect(modedAt(BLUE, "emphasized", "base")).toBe("oklch(84.0% 0.0594 262.0)");
    expect(modedAt(BLUE, "subtle", "_dark")).toBe("oklch(26.0% 0.0299 262.0)");
    expect(modedAt(BLUE, "emphasized", "_dark")).toBe("oklch(37.0% 0.0572 262.0)");
  });

  it("raises the ink to the text ratio on the page and on the deepest fill", () => {
    expect(modedAt(BLUE, "fg", "base")).toBe("oklch(34.9% 0.0884 262.0)");
    expect(modedAt(BLUE, "fg", "_dark")).toBe("oklch(86.8% 0.0584 262.0)");
    expect(
      contrast(modedAt(BLUE, "fg", "_dark"), modedAt(BLUE, "emphasized", "_dark")),
    ).toBeGreaterThanOrEqual(7);
  });

  it("draws the line and the ring from the solid where it clears the boundary ratio", () => {
    expect(modedAt(BLUE, "border.DEFAULT", "base")).toBe(modedAt(BLUE, "solid.DEFAULT", "base"));
    expect(modedAt(BLUE, "focusRing", "_dark")).toBe(modedAt(BLUE, "solid.DEFAULT", "_dark"));
  });

  it("moves a hovered solid a step away from its label", () => {
    expect(modedAt(BLUE, "solid.hover", "base")).toBe("oklch(41.0% 0.1372 262.0)");
    expect(modedAt(BLUE, "solid.hover", "_dark")).toBe("oklch(78.0% 0.1114 262.0)");
  });

  it("moves a hovered line a step towards the ink", () => {
    expect(modedAt(BLUE, "border.hover", "base")).toBe("oklch(41.0% 0.1372 262.0)");
    expect(modedAt(BLUE, "border.hover", "_dark")).toBe("oklch(78.0% 0.1114 262.0)");
  });

  it("keeps the label's contrast on a hovered solid whose ink is close to it in lightness", () => {
    const close = { ink: "oklch(36% 0.01 250)", page: "oklch(94% 0 0)" };
    const palette = drawn("oklch(47% 0.13 220)", { dark: close, light: close });

    expect(
      contrast(modedAt(palette, "contrast", "base"), modedAt(palette, "solid.hover", "base")),
    ).toBeGreaterThanOrEqual(
      contrast(modedAt(palette, "contrast", "base"), modedAt(palette, "solid.DEFAULT", "base")),
    );
  });

  it("moves a hovered solid away from its label on a solid drawn from the ink", () => {
    const grey = drawn({ dark: PAGES.light, light: PAGES.dark }, FOUNDATION);
    const rest = modedAt(grey, "solid.DEFAULT", "base");
    const hover = modedAt(grey, "solid.hover", "base");

    expect(lightnessOf(hover)).toBeLessThan(lightnessOf(rest));
    expect(contrast(modedAt(grey, "contrast", "base"), hover)).toBeGreaterThan(
      contrast(modedAt(grey, "contrast", "base"), rest),
    );
    expect(lightnessOf(modedAt(grey, "border.hover", "base"))).toBeGreaterThan(0.15);
    expect(lightnessOf(modedAt(grey, "solid.hover", "_dark"))).toBeLessThan(0.97);
  });

  it("lightens the chart color towards a light page to the boundary ratio plus the margin", () => {
    const chart = modedAt(BLUE, "chart", "base");

    expect(lightnessOf(chart)).toBeGreaterThan(lightnessOf(modedAt(BLUE, "solid.DEFAULT", "base")));
    expect(contrast(chart, PAGES.light)).toBeGreaterThanOrEqual(3.05);
    expect(contrast(chart, PAGES.light)).toBeLessThan(3.1);
    expect(polar(chart).hue).toBeCloseTo(262, 0);
  });

  it("keeps the solid as the chart color on a dark page", () => {
    expect(modedAt(BLUE, "chart", "_dark")).toBe(modedAt(BLUE, "solid.DEFAULT", "_dark"));
  });

  it("moves a grey solid's chart color towards a dark page to the text ratio", () => {
    const grey = drawn({ dark: PAGES.light, light: PAGES.dark }, FOUNDATION);
    const chart = modedAt(grey, "chart", "_dark");
    const { page, panel } = ladderOf(FOUNDATION.dark);
    const least = Math.min(contrast(chart, page), contrast(chart, panel));

    expect(lightnessOf(chart)).toBeLessThan(lightnessOf(modedAt(grey, "solid.DEFAULT", "_dark")));
    expect(least).toBeGreaterThanOrEqual(7);
    expect(least).toBeLessThan(7.1);
  });

  it("keeps a grey solid below the text ratio as the chart color on a dark page", () => {
    const grey = drawn("oklch(60% 0 0)", FOUNDATION);

    expect(modedAt(grey, "chart", "_dark")).toBe(modedAt(grey, "solid.DEFAULT", "_dark"));
  });

  it("moves the chart color of a kept solid below the boundary ratio towards the ink", () => {
    const chart = modedAt(drawn(PALE, FOUNDATION, { keep: true }), "chart", "base");

    expect(lightnessOf(chart)).toBeLessThan(lightnessOf(PALE));
    expect(contrast(chart, PAGES.light)).toBeGreaterThanOrEqual(3.05);
  });

  it("returns the solid as the chart color when no lightness meets the ratio on a light page", () => {
    const pale = { ink: "oklch(70% 0 0)", page: "oklch(95% 0 0)" };
    const palette = drawn("oklch(80% 0 0)", { dark: pale, light: pale }, { keep: true });

    expect(modedAt(palette, "chart", "base")).toBe("oklch(80% 0 0)");
  });

  it("draws to the ratios a theme restates", () => {
    const relaxed = drawn(FOUNDATION.primary, FOUNDATION, { text: 4.5 });

    expect(lightnessOf(modedAt(relaxed, "fg", "base"))).toBeGreaterThan(0.349);
  });

  it("reads a solid stated for both modes or for each", () => {
    expect(sideOf("x", "dark")).toBe("x");
    expect(sideOf({ dark: "d", light: "l" }, "light")).toBe("l");
  });

  it("reads a canonical color a step lighter for a warm hue", () => {
    expect(canonical("blue")).toStrictEqual({
      dark: stepOf(262, 0.14, 400),
      light: stepOf(262, 0.14, 600),
    });
    expect(canonical("orange").light).toBe(stepOf(60, 0.15, 500));
  });

  it("draws every hue palette with the grey from the ink", () => {
    const all = hues(FOUNDATION);

    expect(Object.keys(all).toSorted()).toStrictEqual([...HUES].toSorted());
    expect(modedAt(all.gray, "solid.DEFAULT", "base")).toBe(PAGES.dark);
    expect(modedAt(all.red, "solid.DEFAULT", "base")).toBe(stepOf(25, 0.16, 600));
  });

  it("draws a stated hue's palette from its color", () => {
    expect(modedAt(hues(FOUNDATION, { red: "#d72323" }).red, "solid.DEFAULT", "base")).toBe(
      "#d72323",
    );
  });
});
