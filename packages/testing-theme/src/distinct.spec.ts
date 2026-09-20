import { describe, expect, it } from "vitest";

import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { fills, inks, lines, surfaces } from "#distinct.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const BASE = { base: foundation };

describe("distinct", () => {
  it("passes the foundation on every pair of surfaces and inks and lines", () => {
    const theme = foundationTheme();

    expect(surfaces(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(inks(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(lines(theme, {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("passes a palette drawn over the foundation's pages on every pair of steps", () => {
    expect(fills(paletteTheme(), BASE, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a hovered solid on the same step as the solid in both modes", () => {
    const theme = paletteTheme({
      solid: {
        DEFAULT: { value: { _dark: "{colors.primary.400}", base: "{colors.primary.700}" } },
        hover: { value: { _dark: "{colors.primary.400}", base: "{colors.primary.700}" } },
      },
    });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.solid and primary.solid.hover differ by 0.000 in base, below 0.02",
      "audited primary.solid and primary.solid.hover differ by 0.000 in _dark, below 0.02",
    ]);
  });

  it("reports two fills closer than the distance with what it measured", () => {
    const theme = paletteTheme({ muted: { value: "oklch(92.0% 0.02 262)" } });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.subtle and primary.muted differ by 0.010 in base, below 0.02",
    ]);
  });

  it("reports a resting fill a reader cannot tell from a surface it sits on", () => {
    const theme = paletteTheme({ subtle: { value: "{colors.bg.panel}" } });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.subtle and bg.panel differ by 0.000 in base, below 0.02",
      "audited primary.subtle and bg.popover differ by 0.000 in base, below 0.02",
      "audited primary.subtle and bg.panel differ by 0.000 in _dark, below 0.02",
    ]);
  });

  it("holds the steps to the distance it was handed", () => {
    const theme = paletteTheme({ muted: { value: "oklch(92.0% 0.02 262)" } });

    expect(fills(theme, BASE, { ...THRESHOLDS, distinct: 0.001 })).toStrictEqual([]);
  });

  it("reports a surface it cannot measure without a base", () => {
    expect(surfaces(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited bg and bg.panel cannot be measured in base",
    );
  });

  it("reports a line whose step nothing defines", () => {
    const theme = paletteTheme({
      border: {
        DEFAULT: { value: "{colors.primary.999}" },
        hover: { value: "{colors.primary.500}" },
      },
    });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.border and primary.border.hover cannot be measured in base",
      "audited primary.border and primary.border.hover cannot be measured in _dark",
    ]);
  });
});
