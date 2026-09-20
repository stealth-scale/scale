import { describe, expect, it } from "vitest";

import { HUES, type Theme, type Tokens } from "@stealthscale/theme/authoring";

import { THRESHOLDS } from "#contrast.ts";
import { consecutive, gamut, hue, monotonic, outsideGamut, rampsOf } from "#ramp.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

type Colors = NonNullable<Tokens["colors"]>;

/**
 * Builds a theme whose color tokens are the block handed in.
 */
function drawn(colors: Colors): Theme {
  return { ...paletteTheme(), name: "drawn", variant: { tokens: { colors } } };
}

/**
 * Keys three steps of one ramp by the colors handed in.
 */
function three(first: string, second: string, third: string): Colors {
  return { 100: { value: first }, 200: { value: second }, 300: { value: third } };
}

describe("ramp", () => {
  it("lists every hue ramp of the foundation with its steps ascending", () => {
    const ramps = rampsOf(foundationTheme());

    expect(ramps.map(({ path }) => path)).toStrictEqual([...HUES]);
    expect(ramps[0]?.steps.map(([step]) => step)).toStrictEqual([
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ]);
  });

  it("passes over a ramp whose steps carry transparency", () => {
    const ramps = rampsOf(foundationTheme());

    expect(ramps.map(({ path }) => path)).not.toContain("blackAlpha");
    expect(ramps.map(({ path }) => path)).not.toContain("whiteAlpha");
  });

  it("lists a dark ramp nested under the light one by its own path", () => {
    const light = three("oklch(90% 0.05 260)", "oklch(60% 0.15 260)", "oklch(30% 0.1 260)");
    const dark = three("oklch(30% 0.1 260)", "oklch(60% 0.15 260)", "oklch(90% 0.05 260)");

    expect(rampsOf(drawn({ blue: { ...light, dark } })).map(({ path }) => path)).toStrictEqual([
      "blue",
      "blue.dark",
    ]);
  });

  it("sorts the steps by number whatever order they were written in", () => {
    const ramp = { 100: { value: "#eee" }, 1000: { value: "#111" }, 500: { value: "#888" } };

    expect(rampsOf(drawn({ gray: ramp }))[0]?.steps).toStrictEqual([
      [100, "#eee"],
      [500, "#888"],
      [1000, "#111"],
    ]);
  });

  it("passes over a group with fewer than three numbered steps", () => {
    const colors = {
      accent: { 100: { value: "#eee" }, 900: { value: "#111" }, DEFAULT: { value: "#888" } },
      white: { value: "#fff" },
    };

    expect(rampsOf(drawn(colors))).toStrictEqual([]);
  });

  it("lists no ramp for a theme that states no color tokens", () => {
    expect(rampsOf({ ...paletteTheme(), variant: {} })).toStrictEqual([]);
    expect(rampsOf({ ...paletteTheme(), variant: { tokens: {} } })).toStrictEqual([]);
  });

  it("pairs each value with the one before it", () => {
    expect(consecutive([1, 2, 3])).toStrictEqual([
      [1, 2],
      [2, 3],
    ]);
    expect(consecutive([1])).toStrictEqual([]);
    expect(consecutive([])).toStrictEqual([]);
  });

  it("passes the foundation's ramps as monotonic in lightness", () => {
    expect(monotonic(foundationTheme())).toStrictEqual([]);
  });

  it("reports a ramp that turns back in lightness between two steps", () => {
    const theme = drawn({
      blue: three("oklch(90% 0.05 260)", "oklch(50% 0.15 260)", "oklch(70% 0.1 260)"),
      red: three("oklch(50% 0.05 20)", "oklch(50% 0.05 20)", "oklch(70% 0.1 20)"),
    });

    expect(monotonic(theme)).toStrictEqual([
      "drawn blue turns back in lightness between steps 200 and 300",
    ]);
  });

  it("reads the direction of a ramp from its first pair of steps that differ", () => {
    const theme = drawn({
      blue: three("oklch(50% 0.05 260)", "oklch(50% 0.15 260)", "oklch(70% 0.1 260)"),
      red: three("oklch(60% 0.1 20)", "oklch(70% 0.1 20)", "oklch(50% 0.1 20)"),
    });

    expect(monotonic(theme)).toStrictEqual([
      "drawn red turns back in lightness between steps 200 and 300",
    ]);
  });

  it("allows two consecutive steps at one lightness", () => {
    const theme = drawn({
      blue: three("oklch(90% 0.05 260)", "oklch(50% 0.15 260)", "oklch(50% 0.15 260)"),
    });

    expect(monotonic(theme)).toStrictEqual([]);
  });

  it("reports a step it cannot read instead of measuring round it", () => {
    const theme = drawn({ blue: three("oklch(90% 0.05 260)", "nope", "oklch(30% 0.1 260)") });

    expect(monotonic(theme)).toStrictEqual(["drawn blue step 200 cannot be read"]);
  });

  it("passes the foundation's ramps as holding one hue each", () => {
    expect(hue(foundationTheme(), THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a step that drifts from the ramp's hue by more than the threshold", () => {
    const theme = drawn({
      blue: three("oklch(90% 0.1 260)", "oklch(60% 0.15 30)", "oklch(30% 0.1 260)"),
    });

    expect(hue(theme, THRESHOLDS)).toStrictEqual([
      "drawn blue step 200 drifts 130 degrees from the ramp's hue, above 45",
    ]);
    expect(hue(theme, { ...THRESHOLDS, hue: 180 })).toStrictEqual([]);
  });

  it("measures the drift the short way round the wheel", () => {
    const theme = drawn({
      red: three("oklch(90% 0.1 350)", "oklch(60% 0.15 10)", "oklch(30% 0.1 355)"),
    });

    expect(hue(theme, THRESHOLDS)).toStrictEqual([]);
  });

  it("leaves a grey step out of the hue measurement", () => {
    const theme = drawn({
      gray: three("oklch(90% 0.01 260)", "oklch(60% 0.02 30)", "oklch(30% 0.01 120)"),
      teal: three("oklch(90% 0.01 260)", "oklch(60% 0.12 180)", "oklch(30% 0.01 120)"),
    });

    expect(hue(theme, THRESHOLDS)).toStrictEqual([]);
  });

  it("leaves a step it cannot read out of the hue measurement", () => {
    const theme = drawn({ teal: three("oklch(90% 0.1 180)", "nope", "oklch(30% 0.1 180)") });

    expect(hue(theme, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a step outside the sRGB gamut", () => {
    const theme = drawn({
      green: three("oklch(90% 0.05 150)", "oklch(60% 0.3 150)", "oklch(30% 0.05 150)"),
    });

    expect(outsideGamut(theme)).toStrictEqual(["green step 200"]);
    expect(gamut(theme)).toStrictEqual(["drawn green step 200 is outside sRGB"]);
  });

  it("passes a ramp inside the gamut and a step it cannot read", () => {
    const theme = drawn({ gray: three("#eeeeee", "nope", "#111111") });

    expect(gamut(theme)).toStrictEqual([]);
  });
});
