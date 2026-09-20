import { describe, expect, it } from "vitest";

import { HUES, ROLES } from "#contract.ts";
import { lightnessOf, polar } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { canonical, drawn, hues, sideOf } from "#draw/palette.ts";
import { stepOf } from "#draw/ramps.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

const BLUE = drawn(FOUNDATION.primary, FOUNDATION);

const PALE = "oklch(90% 0.1 95)";

describe("drawn", () => {
  it("fills every role", () => {
    expect(ROLES.every((role) => tokenAt(BLUE, role) !== undefined)).toBe(true);
  });

  it("keeps a solid that stands from the page and carries a label as stated", () => {
    expect(modedAt(BLUE, "solid.DEFAULT", "base")).toBe(stepOf(262, 0.14, 600));
    expect(modedAt(BLUE, "solid.DEFAULT", "_dark")).toBe(stepOf(262, 0.14, 400));
  });

  it("writes the label in whichever of the ink and the page reads better", () => {
    expect(modedAt(BLUE, "contrast", "base")).toBe(PAGES.light);
    expect(modedAt(BLUE, "contrast", "_dark")).toBe(PAGES.dark);
    expect(modedAt(drawn(canonical("yellow"), FOUNDATION), "contrast", "base")).toBe(PAGES.dark);
  });

  it("moves a solid that cannot stand from the page towards the ink", () => {
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

  it("keeps a solid that stands from the page wherever the label has to come from", () => {
    const palette = drawn("oklch(57% 0 0)", FOUNDATION);
    const solid = modedAt(palette, "solid.DEFAULT", "base");
    const label = modedAt(palette, "contrast", "base");

    expect(lightnessOf(solid)).toBeCloseTo(0.57, 3);
    expect(contrast(label, solid)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps a solid where it is when a theme asks more of its label than any color carries", () => {
    const palette = drawn("oklch(55% 0 0)", FOUNDATION, { label: 7 });
    const solid = modedAt(palette, "solid.DEFAULT", "base");

    expect(lightnessOf(solid)).toBeCloseTo(0.55, 3);
    expect(contrast(solid, PAGES.light)).toBeGreaterThanOrEqual(3);
  });

  it("carries a label at four and a half on any solid there is", () => {
    for (const lightness of [10, 30, 50, 55, 60, 70, 90]) {
      const palette = drawn(`oklch(${String(lightness)}% 0 0)`, FOUNDATION);
      const solid = modedAt(palette, "solid.DEFAULT", "base");

      expect(contrast(modedAt(palette, "contrast", "base"), solid)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("inks a label in black where neither the ink nor the page carries it on a light solid", () => {
    const side = { ink: "oklch(46% 0.07 246)", page: "oklch(97.5% 0.012 16)" };
    const coral = drawn("#F67280", { dark: side, light: side }, { label: 4.5 });
    const label = modedAt(coral, "contrast", "base");

    expect(label).toBe("#000000");
    expect(contrast(label, modedAt(coral, "solid.DEFAULT", "base"))).toBeGreaterThanOrEqual(4.5);
  });

  it("inks a label in white where neither the ink nor the page carries it on a dark solid", () => {
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

  it("moves a hovered solid a step away from its label and a hovered line a step towards the ink", () => {
    expect(modedAt(BLUE, "solid.hover", "base")).toBe("oklch(41.0% 0.1372 262.0)");
    expect(modedAt(BLUE, "solid.hover", "_dark")).toBe("oklch(78.0% 0.1114 262.0)");
    expect(modedAt(BLUE, "border.hover", "base")).toBe("oklch(41.0% 0.1372 262.0)");
    expect(modedAt(BLUE, "border.hover", "_dark")).toBe("oklch(78.0% 0.1114 262.0)");
  });

  it("keeps the label readable on a hovered solid whose ink sits close to it in lightness", () => {
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

  it("draws every hue palette with the grey from the ink and a stated hue from its color", () => {
    const all = hues(FOUNDATION);
    const own = hues(FOUNDATION, { red: "#d72323" });

    expect(Object.keys(all).toSorted()).toStrictEqual([...HUES].toSorted());
    expect(modedAt(all.gray, "solid.DEFAULT", "base")).toBe(PAGES.dark);
    expect(modedAt(all.red, "solid.DEFAULT", "base")).toBe(stepOf(25, 0.16, 600));
    expect(modedAt(own.red, "solid.DEFAULT", "base")).toBe("#d72323");
  });
});
