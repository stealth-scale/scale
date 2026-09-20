import { describe, expect, it } from "vitest";

import { canonical, defineTheme, drawn, FOUNDATION } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { distinct, identity, statusDistance, statusPairs } from "#status.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

/**
 * Draws the error palette from the same green as the success palette.
 */
function alike(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "alike",
    semanticTokens: { colors: { error: drawn(canonical("green"), FOUNDATION) } },
  });
}

/**
 * Draws the error palette from the primary's own blue.
 */
function branded(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "branded",
    semanticTokens: { colors: { error: drawn(FOUNDATION.primary, FOUNDATION) } },
  });
}

describe("status", () => {
  it("pairs every two statuses once on the solid and on the ink", () => {
    const pairs = statusPairs();

    expect(pairs).toHaveLength(12);
    expect(pairs[0]).toStrictEqual({ one: "info", other: "success", role: "solid" });
    expect(pairs.at(-1)).toStrictEqual({ one: "warning", other: "error", role: "fg" });
  });

  it("measures the distance between two statuses on one role in one mode", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(foundationTheme(), pair, "base", {})).toBeGreaterThan(0.2);
    expect(statusDistance(alike(), pair, "base", {})).toBe(0);
  });

  it("measures NaN where a status cannot be resolved", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(paletteTheme(), pair, "base", {})).toBeNaN();
  });

  it("passes the foundation on every pair of solids and every hue", () => {
    expect(distinct(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
    expect(identity(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports two statuses drawn from one hue in both modes", () => {
    expect(distinct(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike success.solid and error.solid differ by 0.000 in base, below 0.05",
      "alike success.solid and error.solid differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("reports a status drawn from the primary's color", () => {
    expect(distinct(branded(), {}, THRESHOLDS)).toStrictEqual([
      "branded error.solid and primary.solid differ by 0.000 in base, below 0.05",
      "branded error.solid and primary.solid differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("holds the solids to the distance it was handed", () => {
    expect(distinct(alike(), {}, { ...THRESHOLDS, status: 0 })).toStrictEqual([]);
  });

  it("reports a pair it cannot measure", () => {
    expect(distinct(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
    expect(distinct(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited info.solid and success.solid cannot be measured in base",
    );
  });

  it("reports a status whose solid sits far from the hue of its name", () => {
    expect(identity(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike error.solid sits 125 degrees from 25 in base, above 30",
      "alike error.solid sits 125 degrees from 25 in _dark, above 30",
    ]);
  });

  it("holds a status to the drift it was handed", () => {
    expect(identity(alike(), {}, { ...THRESHOLDS, identity: 180 })).toStrictEqual([]);
  });

  it("reports a status drawn as a grey with no hue", () => {
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

  it("reports a status whose hue it cannot measure", () => {
    expect(identity(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
    expect(identity(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited info.solid cannot be measured in base",
    );
  });
});
