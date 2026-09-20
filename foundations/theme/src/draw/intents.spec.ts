import { describe, expect, it } from "vitest";

import { PALETTES, ROLES } from "#contract.ts";
import { distanceOf, polar } from "#draw/color.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { intents, STATUS_HUES } from "#draw/intents.ts";
import { stepOf } from "#draw/ramps.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

const drawn = intents(FOUNDATION, FOUNDATION);

/**
 * Reads the hue of a color in degrees.
 */
function hueOf(color: string): number {
  return polar(color).hue;
}

/**
 * Reads the chroma of a color.
 */
function chromaOf(color: string): number {
  return polar(color).chroma;
}

describe("intents", () => {
  it("draws the eight intents with every role", () => {
    expect(Object.keys(drawn).toSorted()).toStrictEqual([...PALETTES].toSorted());

    for (const palette of PALETTES) {
      expect(ROLES.every((role) => tokenAt(drawn[palette], role) !== undefined)).toBe(true);
    }
  });

  it("draws the primary from the color the theme states", () => {
    expect(modedAt(drawn.primary, "solid.DEFAULT", "base")).toBe(stepOf(262, 0.14, 600));
  });

  it("points every role of the accent at the primary unless the theme states one", () => {
    expect(drawn.accent.solid.DEFAULT).toStrictEqual({ value: "{colors.primary.solid}" });
    expect(drawn.accent.solid.hover).toStrictEqual({ value: "{colors.primary.solid.hover}" });
    expect(drawn.accent.focusRing).toStrictEqual({ value: "{colors.primary.focusRing}" });
    expect(drawn.accent.border.hover).toStrictEqual({ value: "{colors.primary.border.hover}" });
    expect(
      modedAt(
        intents(FOUNDATION, { accent: "#2563eb", primary: "#000" }).accent,
        "solid.DEFAULT",
        "base",
      ),
    ).toBe("#2563eb");
  });

  it("draws the neutral from the ink and points its ink and line and ring at the families", () => {
    expect(modedAt(drawn.neutral, "solid.DEFAULT", "base")).toBe(PAGES.dark);
    expect(modedAt(drawn.neutral, "solid.DEFAULT", "_dark")).toBe(PAGES.light);
    expect(drawn.neutral.fg).toStrictEqual({ value: "{colors.fg}" });
    expect(drawn.neutral.border).toStrictEqual({
      DEFAULT: { value: "{colors.border.emphasized}" },
      hover: { value: "{colors.fg.subtle}" },
    });
    expect(drawn.neutral.focusRing).toStrictEqual({ value: "{colors.border.focus}" });
  });

  it("draws the neutral from the color a theme states for it", () => {
    const own = intents(FOUNDATION, { neutral: "#333333", primary: "#2563eb" });

    expect(modedAt(own.neutral, "solid.DEFAULT", "base")).toBe("#333333");
    expect(own.neutral.fg).toStrictEqual({ value: "{colors.fg}" });
  });

  it("draws the secondary from the canonical purple unless the theme states one", () => {
    expect(modedAt(drawn.secondary, "solid.DEFAULT", "base")).toBe(stepOf(300, 0.16, 600));
    expect(
      modedAt(
        intents(FOUNDATION, { primary: "#000", secondary: "#3a4750" }).secondary,
        "solid.DEFAULT",
        "base",
      ),
    ).toBe("#3a4750");
  });

  it("draws each status from its canonical hue unless the theme states one", () => {
    expect(hueOf(modedAt(drawn.info, "solid.DEFAULT", "base"))).toBeCloseTo(220, 0);
    expect(hueOf(modedAt(drawn.success, "solid.DEFAULT", "_dark"))).toBeCloseTo(150, 0);
    expect(hueOf(modedAt(drawn.warning, "solid.DEFAULT", "_dark"))).toBeCloseTo(60, 0);
    expect(hueOf(modedAt(drawn.error, "solid.DEFAULT", "base"))).toBeCloseTo(25, 0);
    expect(
      modedAt(
        intents(FOUNDATION, { error: "#d72323", primary: "#000" }).error,
        "solid.DEFAULT",
        "base",
      ),
    ).toBe("#d72323");
  });

  it("takes an unstated status's chroma down to the brand's and no lower than a status reads at", () => {
    const grey = intents(FOUNDATION, { primary: "oklch(30% 0.01 262)" });
    const muted = intents(FOUNDATION, { primary: "oklch(50% 0.06 241)" });
    const loud = intents(FOUNDATION, { primary: "oklch(54% 0.29 298)" });
    const red = chromaOf(stepOf(25, 0.16, 600));
    const cyan = chromaOf(stepOf(220, 0.13, 600));
    const blue = chromaOf(stepOf(262, 0.14, 600));

    expect(chromaOf(modedAt(grey.error, "solid.DEFAULT", "base"))).toBeCloseTo(0.1, 3);
    expect(chromaOf(modedAt(muted.error, "solid.DEFAULT", "base"))).toBeCloseTo(0.1, 3);
    expect(chromaOf(modedAt(muted.info, "solid.DEFAULT", "_dark"))).toBeCloseTo(0.1, 3);
    expect(chromaOf(modedAt(loud.error, "solid.DEFAULT", "base"))).toBeCloseTo(red, 3);
    expect(chromaOf(modedAt(drawn.info, "solid.DEFAULT", "base"))).toBeCloseTo(cyan, 3);
    expect(chromaOf(modedAt(drawn.error, "solid.DEFAULT", "base"))).toBeCloseTo(blue, 3);
  });

  it("follows the accent's chroma where the accent is louder than the primary", () => {
    const own = intents(FOUNDATION, { accent: "#2563EB", primary: "oklch(27% 0.01 262)" });

    expect(chromaOf(modedAt(own.error, "solid.DEFAULT", "base"))).toBeCloseTo(
      chromaOf(stepOf(25, 0.16, 600)),
      3,
    );
  });

  it("moves a status a step in lightness where it lands on the primary", () => {
    const red = { dark: stepOf(25, 0.16, 400), light: stepOf(25, 0.16, 600) };
    const own = intents(FOUNDATION, { primary: red });

    for (const side of ["base", "_dark"] as const) {
      const error = modedAt(own.error, "solid.DEFAULT", side);
      const primary = modedAt(own.primary, "solid.DEFAULT", side);

      expect(distanceOf(error, primary)).toBeGreaterThanOrEqual(0.12);
      expect(hueOf(error)).toBeCloseTo(25, 0);
    }
  });

  it("moves a status that is near a brand solid of its own hue rather than only one that lands on it", () => {
    const own = intents(FOUNDATION, { primary: "#BF092F" });
    const error = modedAt(own.error, "solid.DEFAULT", "base");

    expect(distanceOf(error, modedAt(own.primary, "solid.DEFAULT", "base"))).toBeGreaterThanOrEqual(
      0.12,
    );
  });

  it("leaves a status that stands near a brand solid of another hue where it is", () => {
    expect(modedAt(drawn.info, "solid.DEFAULT", "base")).toBe(stepOf(220, 0.13, 600));
  });

  it("tells a stated warning from an error on a page that lifts every solid into one band", () => {
    const page = { dark: { ink: "oklch(95% 0.04 89)", page: "#2D4059" }, light: FOUNDATION.light };
    const own = intents(page, { primary: "#EA5455", warning: "#F07B3F" });
    const warning = modedAt(own.warning, "solid.DEFAULT", "_dark");
    const error = modedAt(own.error, "solid.DEFAULT", "_dark");

    expect(distanceOf(warning, error)).toBeGreaterThanOrEqual(0.12);
    expect(chromaOf(warning)).toBeGreaterThan(0.04);
    expect(hueOf(warning)).toBeCloseTo(46, 0);
  });

  it("keeps a status where it reads where every move would bleach it past its own hue", () => {
    const side = { ink: "oklch(12% 0 0)", page: "oklch(97% 0 0)" };
    const own = intents(
      { dark: side, light: side },
      { error: "oklch(62% 0.2500 25)", primary: "oklch(62% 0.2500 25)" },
    );
    const error = modedAt(own.error, "solid.DEFAULT", "base");

    expect(chromaOf(error)).toBeGreaterThan(0.12);
    expect(hueOf(error)).toBeCloseTo(25, 0);
  });

  it("moves a status towards the page instead where the other way lands on the neutral", () => {
    const own = intents(FOUNDATION, {
      neutral: stepOf(25, 0.16, 700),
      primary: stepOf(25, 0.16, 600),
    });

    expect(modedAt(own.error, "solid.DEFAULT", "base")).toMatch(/^oklch\(6\d\.\d% /u);
  });

  it("keeps a stated status exactly where a theme asked for it to be kept", () => {
    const red = "#bb2222";

    for (const keep of [true, ["error"] as const]) {
      const own = intents(FOUNDATION, { error: red, primary: red }, { keep });

      expect(modedAt(own.error, "solid.DEFAULT", "base")).toBe(red);
      expect(modedAt(own.error, "solid.DEFAULT", "_dark")).toBe(red);
    }
  });

  it("publishes the canonical hue of each status", () => {
    expect(STATUS_HUES).toStrictEqual({ error: 25, info: 220, success: 150, warning: 60 });
  });
});
