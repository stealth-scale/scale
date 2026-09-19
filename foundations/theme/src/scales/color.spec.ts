import { describe, expect, it } from "vitest";

import { HUES, ROLES } from "#authoring/contract.ts";
import {
  alphaScale,
  backgrounds,
  BORDER_STEPS,
  borders,
  colorScale,
  FOREGROUND_STEPS,
  foregrounds,
  neutralFills,
  oklch,
  paletteAlias,
  paletteRoles,
  ramp,
  ROLE_STEPS,
  stepOf,
  stepped,
  surfaces,
  type SurfaceSteps,
} from "#scales/color.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const SURFACE_STEPS: SurfaceSteps = {
  DEFAULT: [0, 1],
  disabled: [2, 3],
  emphasized: [3, 4],
  inverted: [12, 12],
  muted: [2, 3],
  panel: [0, 2],
  popover: [0, 2],
  subtle: [1, 2],
};

function chromaOf(color: string): number {
  return Number(/oklch\([\d.]+% (?<chroma>[\d.]+) /u.exec(color)?.groups?.["chroma"]);
}

describe("color", () => {
  it("writes a color the way CSS reads one", () => {
    expect(oklch(60, 0.1, 262)).toBe("oklch(60.0% 0.1000 262.0)");
  });

  it("rounds each part of a color to the precision a stylesheet needs", () => {
    expect(oklch(60.049, 0.100_049, 262.049)).toBe("oklch(60.0% 0.1000 262.0)");
  });

  it("draws eleven steps from the lightest to the darkest", () => {
    expect(Object.keys(colorScale(262, 0.14))).toStrictEqual(STEPS);
  });

  it("draws every step in the hue it was given", () => {
    expect(tokenAt(colorScale(262, 0.14), "500")).toContain("262.0");
    expect(tokenAt(colorScale(262, 0.14), "50")).toContain("262.0");
  });

  it("writes one step of a ramp as the ramp draws it", () => {
    expect(stepOf(262, 0.14, 500)).toBe(tokenAt(colorScale(262, 0.14), "500"));
  });

  it("refuses a step no ramp has", () => {
    expect(() => stepOf(262, 0.14, 450)).toThrow("450 is not a step of a ramp");
  });

  it("holds a near-grey ramp at its stated chroma at both ends", () => {
    const grey = colorScale(262, 0.008);

    expect(chromaOf(String(tokenAt(grey, "50"))) / 0.008).toBeGreaterThan(0.9);
    expect(chromaOf(String(tokenAt(grey, "950"))) / 0.008).toBeGreaterThan(0.9);
  });

  it("lets a saturated ramp fall away at both ends", () => {
    const blue = colorScale(262, 0.14);

    expect(chromaOf(String(tokenAt(blue, "500")))).toBeCloseTo(0.14, 3);
    expect(chromaOf(String(tokenAt(blue, "50"))) / 0.14).toBeLessThan(0.25);
    expect(chromaOf(String(tokenAt(blue, "950"))) / 0.14).toBeLessThan(0.5);
  });

  it("draws an alpha ramp from faint to nearly opaque", () => {
    expect(Object.keys(alphaScale("white"))).toStrictEqual(STEPS);
    expect(tokenAt(alphaScale("white"), "50")).toBe("oklch(100% 0 0 / 0.04)");
    expect(tokenAt(alphaScale("black"), "950")).toBe("oklch(0% 0 0 / 0.95)");
  });

  it("names every surface a page is built from", () => {
    expect(Object.keys(backgrounds({ dark: 13, light: 97 }, 262, 0.006)).toSorted()).toStrictEqual([
      "DEFAULT",
      "backdrop",
      "disabled",
      "emphasized",
      "error",
      "info",
      "inverted",
      "muted",
      "panel",
      "popover",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("draws the page at the lightness it was given in each mode", () => {
    const drawn = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(drawn, "DEFAULT", "base")).toContain("97.0%");
    expect(modedAt(drawn, "DEFAULT", "_dark")).toContain("13.0%");
  });

  it("draws a surface away from the page in both modes", () => {
    const drawn = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(drawn, "muted", "_dark")).toContain("20.0%");
    expect(modedAt(drawn, "muted", "base")).toContain("90.0%");
  });

  it("draws the inverted surface at the other mode's page", () => {
    const drawn = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(drawn, "inverted", "base")).toContain("13.0%");
    expect(modedAt(drawn, "inverted", "_dark")).toContain("97.0%");
  });

  it("stops at white or black rather than wrapping", () => {
    const drawn = backgrounds({ dark: 2, light: 99 }, 262, 0.006);

    expect(modedAt(drawn, "emphasized", "base")).toContain("88.0%");
    expect(modedAt(drawn, "emphasized", "_dark")).toContain("13.0%");
  });

  it("references the status palettes for the status surfaces", () => {
    expect(tokenAt(backgrounds({ dark: 13, light: 97 }, 262, 0.006), "error")).toBe(
      "{colors.error.subtle}",
    );
  });

  it("names every ink a page is written in", () => {
    expect(Object.keys(foregrounds()).toSorted()).toStrictEqual([
      "DEFAULT",
      "disabled",
      "error",
      "info",
      "inverted",
      "link",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("reads the grey ramp for the inks unless told otherwise", () => {
    expect(modedAt(foregrounds(), "DEFAULT", "base")).toBe("{colors.gray.950}");
    expect(modedAt(foregrounds("slate"), "DEFAULT", "base")).toBe("{colors.slate.950}");
  });

  it("inverts each ink between modes", () => {
    expect(modedAt(foregrounds(), "DEFAULT", "_dark")).toBe("{colors.gray.50}");
    expect(modedAt(foregrounds(), "muted", "base")).toBe("{colors.gray.800}");
    expect(modedAt(foregrounds(), "muted", "_dark")).toBe("{colors.gray.300}");
  });

  it("references the primary palette for the link ink", () => {
    expect(tokenAt(foregrounds(), "link")).toBe("{colors.primary.fg}");
  });

  it("names every line between things", () => {
    expect(Object.keys(borders()).toSorted()).toStrictEqual([
      "DEFAULT",
      "emphasized",
      "error",
      "focus",
      "info",
      "inverted",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("draws a muted line closer to the page than the default", () => {
    expect(modedAt(borders(), "muted", "base")).toBe("{colors.gray.200}");
    expect(modedAt(borders(), "DEFAULT", "base")).toBe("{colors.gray.300}");
  });

  it("references the primary palette's ring for the focus line", () => {
    expect(tokenAt(borders(), "focus")).toBe("{colors.primary.focusRing}");
  });

  it("fills every role of a hue palette", () => {
    const palette = paletteRoles("blue");

    expect(ROLES.every((role) => tokenAt(palette, role) !== undefined)).toBe(true);
  });

  it("nests a dotted role under its group", () => {
    expect(modedAt(paletteRoles("blue"), "solid.hover", "base")).toBe("{colors.blue.800}");
    expect(modedAt(paletteRoles("blue"), "solid.DEFAULT", "base")).toBe("{colors.blue.700}");
  });

  it("draws every role of a hue palette from the ramp it was named", () => {
    expect(modedAt(paletteRoles("teal"), "fg.DEFAULT", "_dark")).toBe("{colors.teal.50}");
  });

  it("fills every role of a semantic palette by reference to a hue", () => {
    const palette = paletteAlias("teal");

    expect(tokenAt(palette, "solid.DEFAULT")).toBe("{colors.teal.solid}");
    expect(tokenAt(palette, "solid.hover")).toBe("{colors.teal.solid.hover}");
    expect(ROLES.every((role) => tokenAt(palette, role) !== undefined)).toBe(true);
  });

  it("points the neutral fills at the page's own surfaces", () => {
    expect(neutralFills()).toStrictEqual({
      emphasized: { value: "{colors.bg.emphasized}" },
      muted: { value: "{colors.bg.muted}" },
      subtle: { value: "{colors.bg.subtle}" },
    });
  });

  it("draws a palette for every hue the contract lists", () => {
    expect(HUES.map((hue) => Object.keys(paletteRoles(hue)).length)).toStrictEqual(
      HUES.map(() => 9),
    );
  });

  it("keys a transcribed ramp by the steps it was given", () => {
    expect(ramp([0, "tint10"], ["#ffffff", "#000000"])).toStrictEqual({
      0: { value: "#ffffff" },
      tint10: { value: "#000000" },
    });
  });

  it("throws when a ramp names more steps than it has colors", () => {
    expect(() => ramp([0, 1], ["#ffffff"])).toThrow("2 steps were named for 1 colors");
  });

  it("references the dark step from the dark ramp when one is named", () => {
    expect(stepped("blue", 5, 4, "blue.dark")).toStrictEqual({
      value: { _dark: "{colors.blue.dark.4}", base: "{colors.blue.5}" },
    });
  });

  it("places each role where a table puts it", () => {
    const palette = paletteRoles("blue", { ...ROLE_STEPS, solid: [6, 4] }, "blue.dark");

    expect(modedAt(palette, "solid.DEFAULT", "base")).toBe("{colors.blue.6}");
    expect(modedAt(palette, "solid.DEFAULT", "_dark")).toBe("{colors.blue.dark.4}");
    expect(modedAt(palette, "subtle", "_dark")).toBe("{colors.blue.dark.900}");
  });

  it("keeps a role a table states outright", () => {
    const contrast = { value: { _dark: "{colors.white}", base: "{colors.white}" } };

    expect(paletteRoles("blue", { ...ROLE_STEPS, contrast }).contrast).toStrictEqual(contrast);
  });

  it("draws the surfaces from the steps a table names", () => {
    const drawn = surfaces("gray", SURFACE_STEPS, "gray.dark");

    expect(modedAt(drawn, "DEFAULT", "base")).toBe("{colors.gray.0}");
    expect(modedAt(drawn, "panel", "_dark")).toBe("{colors.gray.dark.2}");
    expect(modedAt(drawn, "backdrop", "base")).toBe("oklch(0% 0 0 / 0.44)");
    expect(tokenAt(drawn, "info")).toBe("{colors.info.subtle}");
  });

  it("keeps a backdrop the table states", () => {
    const backdrop = { value: "{colors.blackAlpha.700}" };

    expect(surfaces("gray", { ...SURFACE_STEPS, backdrop }).backdrop).toStrictEqual(backdrop);
  });

  it("places the inks and the lines where a table puts them", () => {
    const inks = foregrounds("gray", { ...FOREGROUND_STEPS, muted: [10, 9] }, "gray.dark");
    const lines = borders("gray", { ...BORDER_STEPS, emphasized: [9, 8] });

    expect(modedAt(inks, "muted", "_dark")).toBe("{colors.gray.dark.9}");
    expect(tokenAt(inks, "link")).toBe("{colors.primary.fg}");
    expect(modedAt(lines, "emphasized", "base")).toBe("{colors.gray.9}");
    expect(tokenAt(lines, "focus")).toBe("{colors.primary.focusRing}");
  });

  it("keeps an ink a table states outright", () => {
    const subtle = { value: "{colors.gray.500}" };

    expect(foregrounds("gray", { ...FOREGROUND_STEPS, subtle }).subtle).toStrictEqual(subtle);
  });
});
