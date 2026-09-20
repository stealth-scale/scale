import { describe, expect, it } from "vitest";

import { effects } from "#preset/styles/effects.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("effects", () => {
  it("names three glows and nine backdrops and two gradient texts", () => {
    expect(Object.keys(tokenAt(effects, "glow") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
    expect(Object.keys(tokenAt(effects, "backdrop") ?? {}).toSorted()).toStrictEqual([
      "aurora",
      "checker",
      "dots",
      "grid",
      "noise",
      "spotlight",
      "stars",
      "stripes",
      "vignette",
    ]);
    expect(Object.keys(tokenAt(effects, "text") ?? {}).toSorted()).toStrictEqual([
      "gradient",
      "shine",
    ]);
  });

  it("names three blurs and three masks and the dimming and the moving border", () => {
    expect(Object.keys(tokenAt(effects, "blur") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
    expect(Object.keys(tokenAt(effects, "mask") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "edges",
      "radial",
    ]);
    expect(tokenAt(effects, "dim.others")).toBeDefined();
    expect(tokenAt(effects, "border.moving")).toBeDefined();
  });

  it("blurs by a step of the blur scale", () => {
    expect(tokenAt(effects, "blur.md")).toStrictEqual({ filter: "blur({blurs.md})" });
  });

  it("dims and blurs the siblings of a hovered child after a fast transition", () => {
    expect(tokenAt(effects, "dim.others")).toStrictEqual({
      "&:has(> :hover) > :not(:hover)": { filter: "blur({blurs.xs})", opacity: "muted" },
      "& > *": {
        transition: "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
      },
    });
  });

  it("masks an edge or a centre with a gradient", () => {
    expect(tokenAt(effects, "mask.bottom")).toStrictEqual({
      maskImage: "linear-gradient(to bottom, black 60%, transparent)",
    });
    expect(tokenAt(effects, "mask.edges")).toStrictEqual({
      maskImage:
        "linear-gradient(to right, transparent, black {sizes.8}, black calc(100% - {sizes.8}), transparent)",
    });
    expect(tokenAt(effects, "mask.radial")).toMatchObject({
      maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
    });
  });

  it("draws the patterned backdrops from the lines and the fills", () => {
    expect(tokenAt(effects, "backdrop.checker")).toStrictEqual({
      backgroundImage:
        "conic-gradient({colors.bg.emphasized} 25%, transparent 0 50%, {colors.bg.emphasized} 0 75%, transparent 0)",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
    expect(tokenAt(effects, "backdrop.vignette")).toStrictEqual({
      backgroundImage:
        "radial-gradient(ellipse at center, transparent 55%, {colors.blackAlpha.600})",
    });
    expect(
      String(Reflect.get(tokenAt(effects, "backdrop.noise") ?? {}, "backgroundImage")),
    ).toContain("feTurbulence");
  });

  it("draws a glow as a shadow in the palette's solid at half strength", () => {
    expect(tokenAt(effects, "glow.md")).toStrictEqual({
      boxShadow: "0 0 {sizes.8} var(--shadow-color)",
      boxShadowColor: "colorPalette.solid/50",
    });
    expect(tokenAt(effects, "glow.sm")).toMatchObject({
      boxShadow: "0 0 {sizes.4} var(--shadow-color)",
    });
    expect(tokenAt(effects, "glow.lg")).toMatchObject({
      boxShadow: "0 0 {sizes.12} var(--shadow-color)",
    });
  });

  it("draws a moving border as a conic sweep of the palette's solid round the panel surface", () => {
    expect(tokenAt(effects, "border.moving")).toStrictEqual({
      background:
        "linear-gradient({colors.bg.panel}, {colors.bg.panel}) padding-box, conic-gradient(from var(--angle), transparent 60%, var(--colors-color-palette-solid) 85%, transparent) border-box",
      borderColor: "transparent",
      borderWidth: "hairline",
    });
  });

  it("draws gradient text from the palette's solid to the accent's and clips it to the glyphs", () => {
    expect(tokenAt(effects, "text.gradient")).toStrictEqual({
      backgroundClip: "text",
      backgroundImage:
        "linear-gradient(to right, var(--colors-color-palette-solid), var(--colors-accent-solid))",
      color: "transparent",
    });
    expect(tokenAt(effects, "text.shine")).toMatchObject({
      _dark: {
        backgroundImage:
          "linear-gradient(to right, var(--colors-color-palette-fg), var(--colors-color-palette-solid), var(--colors-color-palette-fg))",
      },
      backgroundImage:
        "linear-gradient(to right, var(--colors-color-palette-fg), var(--colors-color-palette-emphasized), var(--colors-color-palette-fg))",
      backgroundSize: "200% auto",
    });
  });

  it("draws the backdrops from the lines and the gradients", () => {
    expect(tokenAt(effects, "backdrop.dots")).toStrictEqual({
      backgroundImage:
        "radial-gradient({colors.border} {borderWidths.sm}, transparent {borderWidths.sm})",
      backgroundSize: "{sizes.4} {sizes.4}",
    });
    expect(tokenAt(effects, "backdrop.aurora")).toStrictEqual({
      backgroundImage: "{gradients.aurora}",
      backgroundSize: "300% 300%",
    });
    expect(tokenAt(effects, "backdrop.spotlight")).toMatchObject({
      "--spotlight-color": "var(--colors-color-palette-muted)",
      backgroundImage:
        "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 0%), var(--spotlight-color) 0%, transparent 55%)",
    });
  });

  it("tiles a star field of nine dots in the ink the surface is written in", () => {
    expect(tokenAt(effects, "backdrop.stars")).toStrictEqual({
      backgroundImage: [
        "radial-gradient({borderWidths.md} {borderWidths.md} at 8% 14%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 23% 62%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 37% 9%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.md} {borderWidths.md} at 46% 41%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 58% 77%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 67% 23%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.md} {borderWidths.md} at 79% 55%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 88% 31%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 94% 86%, currentcolor 99%, transparent)",
      ].join(", "),
      backgroundSize: "{sizes.96} {sizes.48}",
    });
  });

  it("rules a diagonal line a whole pixel wide where an upright one holds at half", () => {
    expect(tokenAt(effects, "backdrop.stripes")).toStrictEqual({
      backgroundImage:
        "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.sm}, transparent {borderWidths.sm} {sizes.4})",
    });
    expect(tokenAt(effects, "backdrop.grid")).toStrictEqual({
      backgroundImage:
        "linear-gradient(to right, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs}), linear-gradient(to bottom, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs})",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
  });
});
