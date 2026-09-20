import { describe, expect, it } from "vitest";

import { HUES, PALETTES } from "#contract.ts";
import { FOUNDATION } from "#draw/foundation.ts";
import { canonical } from "#draw/palette.ts";
import { drawColors } from "#draw/statement.ts";
import { modedAt } from "#tokens.fixtures.ts";

const FAMILIES = ["bg", "border", "code", "fg"];

describe("drawColors", () => {
  it("draws the four families and the eight intents and no hue palette unless asked", () => {
    const colors = drawColors({ ...FOUNDATION, hues: false });

    expect(Object.keys(colors).toSorted()).toStrictEqual([...FAMILIES, ...PALETTES].toSorted());
    expect(Object.keys(drawColors({ ...FOUNDATION, hues: undefined })).toSorted()).toStrictEqual(
      [...FAMILIES, ...PALETTES].toSorted(),
    );
  });

  it("draws every hue palette from the foundation's hues or from the colors the theme names", () => {
    const all = drawColors(FOUNDATION);
    const own = drawColors({ ...FOUNDATION, hues: { red: "#d72323" } });

    expect(Object.keys(all).toSorted()).toStrictEqual(
      [...FAMILIES, ...PALETTES, ...HUES].toSorted(),
    );
    expect(modedAt(own.red, "solid.DEFAULT", "base")).toBe("#d72323");
    expect(modedAt(own.blue, "solid.DEFAULT", "base")).toBe(canonical("blue").light);
  });

  it("draws the code inks from the colors the theme names", () => {
    const colors = drawColors({ ...FOUNDATION, code: { keyword: "#d72323" }, hues: false });

    expect(modedAt(colors.code, "keyword", "base")).toMatch(/^oklch\(39\.0% /u);
    expect(colors.code.comment).toStrictEqual({ value: "{colors.fg.muted}" });
  });

  it("draws to the ratios and the keep the theme states", () => {
    const colors = drawColors({
      ...FOUNDATION,
      hues: false,
      keep: true,
      primary: "oklch(90% 0.1 95)",
      ratios: { text: 4.5 },
    });

    expect(modedAt(colors.primary, "solid.DEFAULT", "base")).toBe("oklch(90% 0.1 95)");
  });
});
