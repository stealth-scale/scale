import { describe, expect, it } from "vitest";

import { CODE, HUES, PALETTES, ROLES } from "#contract.ts";
import { FOUNDATION } from "#draw/foundation.ts";
import { typeScale } from "#draw/type.ts";
import { drawn, statement } from "#preset/statement.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

describe("statement", () => {
  it("states the foundation's colors and every other axis at the engine's defaults", () => {
    expect(statement.colors).toBe(FOUNDATION);
    expect(statement).toMatchObject({ depth: {}, metrics: {}, motion: {}, shape: {}, type: {} });
  });
});

describe("drawn", () => {
  const { borderWidths, colors, durations, easings, radii, shadows, sizes, spacing } =
    drawn.semanticTokens;

  it("draws the four paces and the four curves from the reference tokens", () => {
    expect(tokenAt(durations, "press")).toBe("{durations.fast}");
    expect(tokenAt(durations, "enter")).toBe("{durations.moderate}");
    expect(tokenAt(easings, "leave")).toBe("{easings.in}");
    expect(tokenAt(easings, "move")).toBe("{easings.in-smooth}");
  });

  it("draws the text roles over the sizes with the heading in the heading face", () => {
    expect(tokenAt(drawn.textStyles, "heading.md")).toMatchObject({
      fontFamily: "heading",
      fontWeight: "semibold",
    });
    expect(tokenAt(drawn.textStyles, "label.md")).toMatchObject({ fontWeight: "medium" });
  });

  it("sets the body and the headings in the system sans-serif stack and code in the monospaced one", () => {
    expect(String(tokenAt(drawn.tokens.fonts, "body"))).toMatch(/^ui-sans-serif, system-ui/u);
    expect(tokenAt(drawn.tokens.fonts, "heading")).toBe(tokenAt(drawn.tokens.fonts, "body"));
    expect(String(tokenAt(drawn.tokens.fonts, "mono"))).toMatch(/^ui-monospace/u);
  });

  it("draws the type scale at its defaults", () => {
    expect(drawn.tokens.fontSizes).toStrictEqual(typeScale().fontSizes);
    expect(tokenAt(drawn.textStyles, "md")).toStrictEqual({
      fontSize: "md",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("draws the page light at ninety-seven and dark at fifteen with each written in the other", () => {
    expect(modedAt(colors.bg, "DEFAULT", "base")).toBe("oklch(97.0% 0.0075 262.0)");
    expect(modedAt(colors.bg, "DEFAULT", "_dark")).toBe("oklch(15.0% 0.0076 262.0)");
    expect(modedAt(colors.fg, "DEFAULT", "base")).toBe("oklch(15.0% 0.0076 262.0)");
    expect(modedAt(colors.fg, "DEFAULT", "_dark")).toBe("oklch(97.0% 0.0075 262.0)");
  });

  it("draws the lines from the page and the faded inks from the ink", () => {
    expect(modedAt(colors.border, "DEFAULT", "base")).toBe("oklch(84.9% 0.0075 262.0)");
    expect(modedAt(colors.fg, "muted", "base")).toBe("oklch(34.7% 0.0076 262.0)");
  });

  it("draws the primary from the canonical blue and the info from the canonical cyan", () => {
    expect(modedAt(colors.primary, "solid.DEFAULT", "base")).toBe("oklch(47.0% 0.1372 262.0)");
    expect(modedAt(colors.info, "solid.DEFAULT", "base")).toBe("oklch(47.0% 0.1274 220.0)");
    expect(colors.accent.solid.DEFAULT).toStrictEqual({ value: "{colors.primary.solid}" });
  });

  it("fills every role of every intent and every hue palette", () => {
    for (const palette of [...PALETTES, ...HUES]) {
      expect(ROLES.every((role) => tokenAt(colors[palette], role) !== undefined)).toBe(true);
    }
  });

  it("inks every kind of code token and a comment from the muted ink", () => {
    expect(Object.keys(colors.code).toSorted()).toStrictEqual([...CODE].toSorted());
    expect(colors.code.comment).toStrictEqual({ value: "{colors.fg.muted}" });
  });

  it("draws a medium control at two and a half rem and a medium icon at one and a quarter under the density", () => {
    expect(tokenAt(sizes, "control.md")).toBe("2.5000rem");
    expect(tokenAt(sizes, "icon.md")).toBe("1.2500rem");
  });

  it("draws the navigation panel at sixteen rem and the page measures at forty-eight and eighty", () => {
    expect(tokenAt(sizes, "sidebar")).toBe("16rem");
    expect(tokenAt(sizes, "aside")).toBe("20rem");
    expect(tokenAt(sizes, "rail")).toBe("4rem");
    expect(tokenAt(sizes, "page.narrow")).toBe("48rem");
    expect(tokenAt(sizes, "page.wide")).toBe("80rem");
  });

  it("draws a medium inset at one rem and a medium gap at half a rem and leaves the marker gutter in ems", () => {
    expect(tokenAt(spacing, "inset.md")).toBe("1.0000rem");
    expect(tokenAt(spacing, "gap.md")).toBe("0.5000rem");
    expect(tokenAt(spacing, "marker")).toBe("2.5em");
  });

  it("draws three concentric corners from ten sixteenths of a rem", () => {
    expect(tokenAt(radii, "l3")).toBe("0.625rem");
    expect(tokenAt(radii, "l1")).toBe("calc(0.625rem * 0.5)");
  });

  it("draws the hairline and the control's edge at the thin width and the indicator at the medium", () => {
    expect(tokenAt(borderWidths, "hairline")).toBe("{borderWidths.sm}");
    expect(tokenAt(borderWidths, "control")).toBe("{borderWidths.sm}");
    expect(tokenAt(borderWidths, "indicator")).toBe("{borderWidths.md}");
  });

  it("draws eight shadows tinted with the grey ramp's hue", () => {
    expect(Object.keys(shadows ?? {})).toHaveLength(8);
    expect(modedAt(shadows, "md", "base")).toContain("0.02 262");
  });
});
