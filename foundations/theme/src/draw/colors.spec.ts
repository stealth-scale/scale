import { describe, expect, it } from "vitest";

import { BACKGROUNDS, BORDERS, FOREGROUNDS, STATUSES } from "#contract.ts";
import { lightnessOf } from "#draw/color.ts";
import { inked } from "#draw/colors.ts";
import { contrast } from "#draw/contrast.ts";
import { FOUNDATION, PAGES } from "#draw/foundation.ts";
import { modedAt } from "#tokens.fixtures.ts";

const families = inked(FOUNDATION);

describe("inked", () => {
  it("draws every member of the three families", () => {
    expect(Object.keys(families.bg).toSorted()).toStrictEqual(
      [...BACKGROUNDS, ...STATUSES].toSorted(),
    );
    expect(Object.keys(families.fg).toSorted()).toStrictEqual(
      [...FOREGROUNDS, ...STATUSES].toSorted(),
    );
    expect(Object.keys(families.border).toSorted()).toStrictEqual(
      [...BORDERS, ...STATUSES].toSorted(),
    );
  });

  it("writes the page and the ink as stated and each as the other side's inverse", () => {
    expect(modedAt(families.bg, "DEFAULT", "base")).toBe("oklch(97.0% 0.0075 262.0)");
    expect(modedAt(families.bg, "DEFAULT", "_dark")).toBe("oklch(15.0% 0.0076 262.0)");
    expect(modedAt(families.fg, "DEFAULT", "base")).toBe("oklch(15.0% 0.0076 262.0)");
    expect(modedAt(families.bg, "inverted", "base")).toBe("oklch(15.0% 0.0076 262.0)");
    expect(modedAt(families.fg, "inverted", "_dark")).toBe("oklch(15.0% 0.0076 262.0)");
  });

  it("raises the panel and the popover and sinks the wells", () => {
    expect(modedAt(families.bg, "panel", "_dark")).toBe("oklch(19.0% 0.0076 262.0)");
    expect(modedAt(families.bg, "popover", "_dark")).toBe("oklch(22.0% 0.0076 262.0)");
    expect(modedAt(families.bg, "subtle", "base")).toBe("oklch(93.0% 0.0075 262.0)");
    expect(modedAt(families.bg, "muted", "base")).toBe("oklch(89.0% 0.0075 262.0)");
    expect(modedAt(families.bg, "emphasized", "_dark")).toBe("oklch(2.0% 0.0076 262.0)");
  });

  it("fades the secondary ink to the text ratio on the deepest surface", () => {
    expect(modedAt(families.fg, "muted", "base")).toBe("oklch(34.7% 0.0076 262.0)");
    expect(modedAt(families.fg, "muted", "_dark")).toBe("oklch(86.9% 0.0075 262.0)");
    expect(
      contrast(modedAt(families.fg, "muted", "base"), modedAt(families.bg, "emphasized", "base")),
    ).toBeGreaterThanOrEqual(7);
  });

  it("fades the tertiary ink to the tertiary ratio", () => {
    expect(modedAt(families.fg, "subtle", "base")).toBe("oklch(45.2% 0.0076 262.0)");
    expect(modedAt(families.fg, "subtle", "_dark")).toBe("oklch(73.9% 0.0075 262.0)");
  });

  it("raises the hairlines to their ratios and the boundary to the control's", () => {
    expect(modedAt(families.border, "subtle", "base")).toBe("oklch(92.3% 0.0075 262.0)");
    expect(modedAt(families.border, "muted", "base")).toBe("oklch(89.6% 0.0075 262.0)");
    expect(modedAt(families.border, "DEFAULT", "base")).toBe("oklch(84.9% 0.0075 262.0)");
    expect(modedAt(families.border, "emphasized", "base")).toBe("oklch(61.6% 0.0075 262.0)");
    expect(modedAt(families.border, "emphasized", "_dark")).toBe("oklch(51.0% 0.0076 262.0)");
    expect(modedAt(families.border, "inverted", "base")).toBe("oklch(33.7% 0.0076 262.0)");
  });

  it("points the link at the accent's ink and the focus line at its ring", () => {
    expect(families.fg.link).toStrictEqual({ value: "{colors.accent.fg}" });
    expect(families.border.focus).toStrictEqual({ value: "{colors.accent.focusRing}" });
  });

  it("points each status member at the status palette", () => {
    expect(families.bg.info).toStrictEqual({ value: "{colors.info.subtle}" });
    expect(families.fg.error).toStrictEqual({ value: "{colors.error.fg}" });
    expect(families.border.warning).toStrictEqual({ value: "{colors.warning.border}" });
  });

  it("draws the backdrop deeper after dark", () => {
    expect(families.bg.backdrop).toStrictEqual({
      value: { _dark: "oklch(0% 0 0 / 0.64)", base: "oklch(0% 0 0 / 0.44)" },
    });
  });

  it("draws to the ratios a theme restates", () => {
    const relaxed = inked(FOUNDATION, { text: 5 });

    expect(lightnessOf(modedAt(relaxed.fg, "muted", "base"))).toBeGreaterThan(
      lightnessOf(modedAt(families.fg, "muted", "base")),
    );
    expect(contrast(modedAt(relaxed.fg, "muted", "base"), PAGES.light)).toBeGreaterThanOrEqual(5);
  });

  it("draws to the floor where a theme states a ratio below it", () => {
    const lowered = inked(FOUNDATION, { tertiary: 3, text: 3 });

    expect(contrast(modedAt(lowered.fg, "muted", "base"), PAGES.light)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(modedAt(lowered.fg, "subtle", "base"), PAGES.light)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("keeps the tertiary ink a step on from the control's boundary where both are drawn to one ratio", () => {
    const relaxed = inked(FOUNDATION, { tertiary: 3, text: 4.5 });
    const subtle = lightnessOf(modedAt(relaxed.fg, "subtle", "_dark"));
    const emphasized = lightnessOf(modedAt(relaxed.border, "emphasized", "_dark"));

    expect(Math.abs(subtle - emphasized)).toBeGreaterThanOrEqual(0.025);
  });
});
