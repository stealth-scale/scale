import { describe, expect, it } from "vitest";

import { canonical, defineTheme, drawn, FOUNDATION } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { distinct, identity, statusDistance, statusPairs } from "#status.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

/**
 * Builds a theme whose error palette is drawn from the same green as its success palette.
 */
function alike(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "alike",
    semanticTokens: { colors: { error: drawn(canonical("green"), FOUNDATION) } },
  });
}

/**
 * Builds a theme whose error palette is drawn from the primary's blue.
 */
function branded(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "branded",
    semanticTokens: { colors: { error: drawn(FOUNDATION.primary, FOUNDATION) } },
  });
}

describe("status", () => {
  it("pairs every two statuses once on the solid and once on the ink", () => {
    const pairs = statusPairs();

    expect(pairs).toHaveLength(12);
    expect(pairs[0]).toStrictEqual({ one: "info", other: "success", role: "solid" });
    expect(pairs.at(-1)).toStrictEqual({ one: "warning", other: "error", role: "fg" });
  });

  it("measures a distance between two statuses drawn from different hues", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(foundationTheme(), pair, "base", {})).toBeGreaterThan(0.2);
  });

  it("measures no distance between two statuses drawn from one hue", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(alike(), pair, "base", {})).toBe(0);
  });

  it("returns NaN when a status cannot be resolved", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(paletteTheme(), pair, "base", {})).toBeNaN();
  });

  it("finds the foundation's status solids far enough apart", () => {
    expect(distinct(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("finds the foundation's status solids close enough to their canonical hues", () => {
    expect(identity(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a pair of statuses drawn from one hue once per mode", () => {
    expect(distinct(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike success.solid and error.solid differ by 0.000 in base, below 0.05",
      "alike success.solid and error.solid differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("reports a status drawn from the primary's own color", () => {
    expect(distinct(branded(), {}, THRESHOLDS)).toStrictEqual([
      "branded error.solid and primary.solid differ by 0.000 in base, below 0.05",
      "branded error.solid and primary.solid differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("reports nothing once the thresholds drop the status distance to zero", () => {
    expect(distinct(alike(), {}, { ...THRESHOLDS, status: 0 })).toStrictEqual([]);
  });

  it("resolves a theme's statuses through the base it is given", () => {
    expect(distinct(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a pair it cannot measure when no base is given", () => {
    expect(distinct(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited info.solid and success.solid cannot be measured in base",
    );
  });

  it("reports a status whose solid sits further from its canonical hue than the threshold", () => {
    expect(identity(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike error.solid sits 125 degrees from 25 in base, above 30",
      "alike error.solid sits 125 degrees from 25 in _dark, above 30",
    ]);
  });

  it("reports nothing once the thresholds allow that much identity drift", () => {
    expect(identity(alike(), {}, { ...THRESHOLDS, identity: 180 })).toStrictEqual([]);
  });

  it("reports a status whose solid is a grey with no hue", () => {
    const grey = defineTheme({
      extends: foundationTheme(),
      name: "grey",
      semanticTokens: { colors: { info: { solid: { DEFAULT: { value: "#808080" } } } } },
    });

    expect(identity(grey, {}, THRESHOLDS)).toStrictEqual([
      "grey info.solid has no hue in base",
      "grey info.solid has no hue in _dark",
    ]);
  });

  it("resolves a theme's status hues through the base it is given", () => {
    expect(identity(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a status hue it cannot measure when no base is given", () => {
    expect(identity(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited info.solid cannot be measured in base",
    );
  });
});
