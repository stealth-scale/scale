import { describe, expect, it } from "vitest";

import { BACKGROUNDS, BORDERS, FOREGROUNDS, STATUSES } from "#authoring/contract.ts";
import { oklab } from "#authoring/contrast.ts";
import { type Inked, inked, mixed, read, scaleOf, stated } from "#scales/inked.ts";
import { modedAt } from "#tokens.fixtures.ts";

const MODES: Inked = {
  dark: { ink: "#EEEEEE", page: "#303841" },
  light: { ink: "#303841", page: "#EEEEEE" },
};

function lightnessOf(color: string): number {
  return oklab(color)?.l ?? Number.NaN;
}

describe("inked", () => {
  it("writes one color in both modes or one per mode", () => {
    expect(stated("#EEEEEE")).toStrictEqual({ value: { _dark: "#EEEEEE", base: "#EEEEEE" } });
    expect(stated("#EEEEEE", "#303841")).toStrictEqual({
      value: { _dark: "#303841", base: "#EEEEEE" },
    });
  });

  it("mixes halfway between black and white to a mid grey", () => {
    expect(mixed("#000000", "#ffffff", 0.5)).toBe("oklch(50.0% 0.0000 0.0)");
  });

  it("stays on the first color at no share and reaches the second at a full one", () => {
    expect(lightnessOf(mixed("#303841", "#EEEEEE", 0))).toBeCloseTo(lightnessOf("#303841"), 3);
    expect(lightnessOf(mixed("#303841", "#EEEEEE", 1))).toBeCloseTo(lightnessOf("#EEEEEE"), 3);
  });

  it("refuses a color it cannot read", () => {
    expect(() => mixed("papayawhip", "#ffffff", 0.5)).toThrow(
      "papayawhip is not a color a theme can be drawn from",
    );
    expect(() => read("papayawhip")).toThrow("papayawhip is not a color a theme can be drawn from");
  });

  it("draws a ramp in the hue and at the chroma of a color", () => {
    const ramp = scaleOf("#D72323");

    expect(Object.keys(ramp)).toHaveLength(11);
    expect(modedAt(ramp, "500", "base")).toBe("oklch(58.0% 0.2127 27.5)");
  });

  it("draws the three families with every member the contract names", () => {
    const drawn = inked(MODES);

    expect(Object.keys(drawn.bg).toSorted()).toStrictEqual(
      [...BACKGROUNDS, ...STATUSES].toSorted(),
    );
    expect(Object.keys(drawn.fg).toSorted()).toStrictEqual(
      [...FOREGROUNDS, ...STATUSES].toSorted(),
    );
    expect(Object.keys(drawn.border).toSorted()).toStrictEqual(
      [...BORDERS, ...STATUSES].toSorted(),
    );
  });

  it("takes the page and the ink as stated and swaps them for the inverse", () => {
    const drawn = inked(MODES);

    expect(drawn.bg.DEFAULT.value).toStrictEqual({ _dark: "#303841", base: "#EEEEEE" });
    expect(drawn.fg.DEFAULT.value).toStrictEqual({ _dark: "#EEEEEE", base: "#303841" });
    expect(drawn.bg.inverted.value).toStrictEqual({ _dark: "#EEEEEE", base: "#303841" });
    expect(drawn.fg.inverted.value).toStrictEqual({ _dark: "#303841", base: "#EEEEEE" });
  });

  it("draws every other surface a fixed distance from the page in the page's own tint", () => {
    const drawn = inked(MODES);

    expect(modedAt(drawn.bg, "panel", "base")).toBe("oklch(97.9% 0.0000 0.0)");
    expect(modedAt(drawn.bg, "panel", "_dark")).toBe("oklch(37.7% 0.0192 251.5)");
    expect(modedAt(drawn.bg, "emphasized", "_dark")).toBe("oklch(44.7% 0.0192 251.5)");
    expect(drawn.bg.popover).toStrictEqual(drawn.bg.panel);
  });

  it("draws the panel on the surface stated for it", () => {
    const drawn = inked({ ...MODES, dark: { ...MODES.dark, panel: "#3A4750" } });

    expect(drawn.bg.panel.value).toStrictEqual({
      _dark: "#3A4750",
      base: "oklch(97.9% 0.0000 0.0)",
    });
    expect(drawn.bg.popover).toStrictEqual(drawn.bg.panel);
  });

  it("fades each ink further towards the page at each step", () => {
    const drawn = inked(MODES);
    const ink = lightnessOf("#303841");
    const muted = lightnessOf(modedAt(drawn.fg, "muted", "base"));
    const subtle = lightnessOf(modedAt(drawn.fg, "subtle", "base"));

    expect(muted).toBeGreaterThan(ink);
    expect(subtle).toBeGreaterThan(muted);
    expect(subtle).toBeLessThan(lightnessOf("#EEEEEE"));
  });

  it("weighs each line from the page towards the ink", () => {
    const drawn = inked(MODES);
    const lineAt = (member: string): number => lightnessOf(modedAt(drawn.border, member, "_dark"));

    expect(lineAt("subtle")).toBeGreaterThan(lightnessOf("#303841"));
    expect(lineAt("muted")).toBeGreaterThan(lineAt("subtle"));
    expect(lineAt("DEFAULT")).toBeGreaterThan(lineAt("muted"));
    expect(lineAt("emphasized")).toBeGreaterThan(lineAt("DEFAULT"));
    expect(modedAt(drawn.border, "inverted", "_dark")).toBe(
      modedAt(drawn.border, "DEFAULT", "base"),
    );
  });

  it("references the palettes for the status members and for the link and the focus and the disabled ink", () => {
    const drawn = inked(MODES);

    expect(drawn.bg.error.value).toBe("{colors.error.subtle}");
    expect(drawn.fg.success.value).toBe("{colors.success.fg}");
    expect(drawn.border.warning.value).toBe("{colors.warning.border}");
    expect(drawn.fg.link.value).toBe("{colors.primary.fg}");
    expect(drawn.fg.disabled.value).toBe("{colors.fg.subtle}");
    expect(drawn.border.focus.value).toBe("{colors.primary.focusRing}");
  });
});
