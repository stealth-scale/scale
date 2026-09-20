import { describe, expect, it } from "vitest";

import foundation from "@stealthscale/theme/theme";

import { boundary, boundaryPairs, focus, text, textPairs, THRESHOLDS } from "#contrast.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const BASE = { base: foundation };

describe("contrast", () => {
  it("passes the foundation on every pair", () => {
    const theme = foundationTheme();

    expect(text(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(boundary(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(focus(theme, {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("passes a palette drawn over the foundation's pages", () => {
    const theme = paletteTheme();

    expect(text(theme, BASE, THRESHOLDS)).toStrictEqual([]);
    expect(boundary(theme, BASE, THRESHOLDS)).toStrictEqual([]);
    expect(focus(theme, BASE, THRESHOLDS)).toStrictEqual([]);
  });

  it("holds the tertiary ink and each palette's label to the AA ratio", () => {
    const pairs = textPairs(foundationTheme(), THRESHOLDS);

    expect(pairs).toStrictEqual(
      expect.arrayContaining([
        { back: "bg", front: "fg.subtle", minimum: 4.5 },
        { back: "bg.emphasized", front: "fg.muted", minimum: 7 },
        { back: "primary.solid", front: "primary.contrast", minimum: 4.5 },
        { back: "bg.popover", front: "primary.fg", minimum: 7 },
      ]),
    );
  });

  it("holds the hairline to its own ratio on the page and the panel", () => {
    const pairs = boundaryPairs(foundationTheme(), THRESHOLDS);

    expect(pairs).toStrictEqual(
      expect.arrayContaining([
        { back: "bg", front: "border", minimum: 1.45 },
        { back: "bg.panel", front: "border", minimum: 1.45 },
        { back: "bg.subtle", front: "border.emphasized", minimum: 3 },
        { back: "bg.panel", front: "primary.solid", minimum: 3 },
      ]),
    );
    expect(pairs).not.toStrictEqual(
      expect.arrayContaining([{ back: "bg.emphasized", front: "border.emphasized", minimum: 3 }]),
    );
  });

  it("reports a label below the label ratio with what it measured", () => {
    const theme = paletteTheme({ contrast: { value: "{colors.primary.600}" } });

    expect(text(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.contrast on primary.solid measures 1.00 in base, below 4.5",
      "audited primary.contrast on primary.solid.hover measures 1.30 in base, below 4.5",
      "audited primary.contrast on primary.solid measures 2.78 in _dark, below 4.5",
      "audited primary.contrast on primary.solid.hover measures 3.46 in _dark, below 4.5",
    ]);
  });

  it("reports a pair it cannot measure", () => {
    const theme = paletteTheme({ solid: { value: "{colors.primary.999}" } });

    expect(text(theme, BASE, THRESHOLDS)[0]).toBe(
      "audited primary.contrast on primary.solid cannot be measured in base, below 4.5",
    );
  });

  it("reports a line below the boundary ratio on the page and the panel", () => {
    const theme = paletteTheme({
      border: {
        DEFAULT: { value: "{colors.primary.100}" },
        hover: { value: "{colors.primary.500}" },
      },
    });

    expect(boundary(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.border on bg measures 1.10 in base, below 3",
      "audited primary.border on bg.panel measures 1.20 in base, below 3",
    ]);
  });

  it("reports a ring below the focus ratio on a surface", () => {
    const theme = paletteTheme({ focusRing: { value: "{colors.primary.300}" } });

    expect(focus(theme, BASE, THRESHOLDS)).toHaveLength(6);
    expect(focus(theme, BASE, THRESHOLDS)[0]).toBe(
      "audited primary.focusRing on bg measures 1.73 in base, below 3",
    );
  });

  it("holds a pair to the ratio it was handed", () => {
    const theme = paletteTheme({ contrast: { value: "{colors.primary.600}" } });

    expect(text(theme, BASE, { ...THRESHOLDS, label: 1 })).toStrictEqual([]);
  });

  it("reports the surfaces the foundation leaves unresolved without a base", () => {
    expect(text(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited fg on bg cannot be measured in base, below 7",
    );
  });
});
