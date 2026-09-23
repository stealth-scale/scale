import { describe, expect, it } from "vitest";

import { effects } from "#preset/styles/effects.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("effects", () => {
  it("declares three glows", () => {
    expect(Object.keys(tokenAt(effects, "glow") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
  });

  it("declares nine backdrops", () => {
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
  });

  it("declares two gradient text styles", () => {
    expect(Object.keys(tokenAt(effects, "text") ?? {}).toSorted()).toStrictEqual([
      "gradient",
      "shine",
    ]);
  });

  it("declares three blurs", () => {
    expect(Object.keys(tokenAt(effects, "blur") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
  });

  it("declares three masks", () => {
    expect(Object.keys(tokenAt(effects, "mask") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "edges",
      "radial",
    ]);
  });

  it("reads the blur scale at blur.md", () => {
    expect(tokenAt(effects, "blur.md")).toStrictEqual({ filter: "blur({blurs.md})" });
  });

  it("dims every child except a hovered focused or pressed one", () => {
    expect(tokenAt(effects, "dim.others")).toMatchObject({
      "&:has(> :is(:hover, :focus-visible, [aria-pressed=true])) > :not(:hover, :focus-visible, [aria-pressed=true])":
        { filter: "blur({blurs.xs})", opacity: "muted" },
    });
  });

  it("transitions the dim at the fast duration", () => {
    expect(tokenAt(effects, "dim.others")).toMatchObject({
      "& > *": {
        transition: "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
      },
    });
  });

  it("declares a gradient mask image for each mask", () => {
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

  it("paints the checker backdrop from bg.emphasized", () => {
    expect(tokenAt(effects, "backdrop.checker")).toStrictEqual({
      backgroundImage:
        "conic-gradient({colors.bg.emphasized} 25%, transparent 0 50%, {colors.bg.emphasized} 0 75%, transparent 0)",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
  });

  it("paints the vignette from blackAlpha.600", () => {
    expect(tokenAt(effects, "backdrop.vignette")).toStrictEqual({
      backgroundImage:
        "radial-gradient(ellipse at center, transparent 55%, {colors.blackAlpha.600})",
    });
  });

  it("paints the noise backdrop from an feTurbulence filter", () => {
    expect(
      String(Reflect.get(tokenAt(effects, "backdrop.noise") ?? {}, "backgroundImage")),
    ).toContain("feTurbulence");
  });

  it("renders each glow as a box shadow in the palette's solid at 50% opacity", () => {
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

  it("paints the moving border as a conic gradient over the panel surface", () => {
    expect(tokenAt(effects, "border.moving")).toStrictEqual({
      background:
        "linear-gradient({colors.bg.panel}, {colors.bg.panel}) padding-box, conic-gradient(from var(--angle), transparent 60%, var(--colors-color-palette-solid) 85%, transparent) border-box",
      borderColor: "transparent",
      borderWidth: "hairline",
    });
  });

  it("clips text.gradient from the palette solid to the accent solid", () => {
    expect(tokenAt(effects, "text.gradient")).toStrictEqual({
      backgroundClip: "text",
      backgroundImage:
        "linear-gradient(to right, var(--colors-color-palette-solid), var(--colors-accent-solid))",
      color: "transparent",
    });
  });

  it("paints text.shine through the palette solid in dark mode", () => {
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

  it("paints the dots backdrop in the border color", () => {
    expect(tokenAt(effects, "backdrop.dots")).toStrictEqual({
      backgroundImage:
        "radial-gradient({colors.border} {borderWidths.sm}, transparent {borderWidths.sm})",
      backgroundSize: "{sizes.4} {sizes.4}",
    });
  });

  it("paints the aurora backdrop from gradients.aurora", () => {
    expect(tokenAt(effects, "backdrop.aurora")).toStrictEqual({
      backgroundImage: "{gradients.aurora}",
      backgroundSize: "300% 300%",
    });
  });

  it("paints the spotlight in the palette's muted role", () => {
    expect(tokenAt(effects, "backdrop.spotlight")).toMatchObject({
      "--spotlight-color": "var(--colors-color-palette-muted)",
      backgroundImage:
        "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 0%), var(--spotlight-color) 0%, transparent 55%)",
    });
  });

  it("tiles nine currentcolor dots in the stars backdrop", () => {
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

  it("sets the diagonal stripe width to borderWidths.sm", () => {
    expect(tokenAt(effects, "backdrop.stripes")).toStrictEqual({
      backgroundImage:
        "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.sm}, transparent {borderWidths.sm} {sizes.4})",
    });
  });

  it("sets the grid line width to borderWidths.xs", () => {
    expect(tokenAt(effects, "backdrop.grid")).toStrictEqual({
      backgroundImage:
        "linear-gradient(to right, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs}), linear-gradient(to bottom, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs})",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
  });
});
