import { describe, expect, it } from "vitest";

import { defineTheme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { distinct } from "#series.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

/**
 * Builds a theme whose second series color is its first.
 */
function alike(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "alike",
    semanticTokens: { colors: { series: { "2": { value: "{colors.series.1}" } } } },
  });
}

describe("series", () => {
  it("finds the foundation's consecutive series colors far enough apart", () => {
    expect(distinct(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports two consecutive series colors drawn alike once per mode", () => {
    expect(distinct(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike series.1 and series.2 differ by 0.000 in base, below 0.05",
      "alike series.1 and series.2 differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("reports nothing once the thresholds drop the series distance to zero", () => {
    expect(distinct(alike(), {}, { ...THRESHOLDS, series: 0 })).toStrictEqual([]);
  });

  it("resolves a theme's series colors through the base it is given", () => {
    expect(distinct(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a pair it cannot measure when no base is given", () => {
    expect(distinct(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited series.1 and series.2 cannot be measured in base",
    );
  });
});
