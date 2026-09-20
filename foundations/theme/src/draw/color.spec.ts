import { describe, expect, it } from "vitest";

import {
  distanceOf,
  inGamut,
  lightened,
  lightnessOf,
  mixed,
  oklch,
  polar,
  read,
  referenced,
  stated,
  written,
} from "#draw/color.ts";

const BLUE = "oklch(47% 0.1372 262)";

describe("color", () => {
  it("writes an OKLCH color as CSS writes it", () => {
    expect(oklch(50, 0.1, 200)).toBe("oklch(50.0% 0.1000 200.0)");
  });

  it("refuses to write a coordinate that is not a finite number", () => {
    expect(() => oklch(Number.NaN, 0.1, 200)).toThrow(/not a color/u);
    expect(() => oklch(50, Number.NaN, 200)).toThrow(/not a color/u);
    expect(() => oklch(50, 0.1, Number.POSITIVE_INFINITY)).toThrow(/not a color/u);
  });

  it("refuses a color whose fields are not numbers and one of a length CSS never writes", () => {
    expect(() => read("rgb(.. 0 0)")).toThrow(/not a color/u);
    expect(() => read("oklch(50% .. 25)")).toThrow(/not a color/u);
    expect(() => read("#fffff")).toThrow(/not a color/u);
  });

  it("refuses a color carrying transparency", () => {
    expect(() => read("rgba(0, 0, 0, 0.1)")).toThrow(/not a color/u);
    expect(() => read("#00000000")).toThrow(/not a color/u);
    expect(() => read("oklch(50% 0.1 25 / 0.5)")).toThrow(/not a color/u);
    expect(read("rgba(0, 0, 0, 1)").l).toBeCloseTo(0, 3);
    expect(read("#ffffffff").l).toBeCloseTo(1, 3);
  });

  it("reads a color into OKLab and refuses one it cannot read", () => {
    expect(read("#ffffff").l).toBeCloseTo(1, 3);
    expect(() => read("nope")).toThrow("nope is not a color a theme can be drawn from");
  });

  it("reads a color as OKLCH reads it", () => {
    const { chroma, hue, lightness } = polar("oklch(50% 0.1 200)");

    expect(lightness).toBeCloseTo(50, 3);
    expect(chroma).toBeCloseTo(0.1, 3);
    expect(hue).toBeCloseTo(200, 3);
  });

  it("reads a grey as having no hue", () => {
    expect(polar("oklch(50% 0 0)").hue).toBe(0);
    expect(polar("#808080").chroma).toBeLessThan(0.0001);
  });

  it("writes an OKLab color back as OKLCH", () => {
    expect(written(read("oklch(50.0% 0.1000 200.0)"))).toBe("oklch(50.0% 0.1000 200.0)");
  });

  it("reads the lightness of a color", () => {
    expect(lightnessOf("oklch(50% 0 0)")).toBeCloseTo(0.5, 3);
  });

  it("measures how far apart two colors read", () => {
    expect(distanceOf("oklch(50% 0 0)", "oklch(60% 0 0)")).toBeCloseTo(0.1, 3);
    expect(distanceOf(BLUE, BLUE)).toBe(0);
  });

  it("mixes two colors a share of the way in OKLab", () => {
    expect(lightnessOf(mixed("oklch(0% 0 0)", "oklch(100% 0 0)", 0.5))).toBeCloseTo(0.5, 3);
    expect(mixed(BLUE, "#000", 0)).toBe("oklch(47.0% 0.1372 262.0)");
    expect(lightnessOf(mixed(BLUE, "oklch(100% 0 0)", 1))).toBeCloseTo(1, 3);
  });

  it("reports whether a display can show a color", () => {
    expect(inGamut("#ffffff")).toBe(true);
    expect(inGamut("oklch(90% 0.3 150)")).toBe(false);
    expect(inGamut("nope")).toBe(false);
  });

  it("moves a color to a lightness and keeps its hue and its chroma", () => {
    const { chroma, hue, lightness } = polar(lightened(BLUE, 0.6));

    expect(lightness).toBeCloseTo(60, 3);
    expect(chroma).toBeCloseTo(0.1372, 4);
    expect(hue).toBeCloseTo(262, 1);
  });

  it("sheds chroma until the color is inside the display", () => {
    const moved = lightened(BLUE, 0.97);

    expect(inGamut(moved)).toBe(true);
    expect(polar(moved).chroma).toBeLessThan(0.1372);
    expect(polar(moved).hue).toBeCloseTo(262, 1);
  });

  it("clamps the lightness to the display", () => {
    expect(polar(lightened(BLUE, 1.5)).lightness).toBeCloseTo(100, 3);
    expect(polar(lightened(BLUE, -1)).lightness).toBeCloseTo(0, 3);
  });

  it("writes one color for both modes and another for each", () => {
    expect(stated("a")).toStrictEqual({ value: { _dark: "a", base: "a" } });
    expect(stated("a", "b")).toStrictEqual({ value: { _dark: "b", base: "a" } });
  });

  it("writes a reference into a color token", () => {
    expect(referenced("fg.muted")).toStrictEqual({ value: "{colors.fg.muted}" });
  });
});
