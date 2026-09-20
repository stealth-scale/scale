/**
 * Defines the effects a page is dressed with, which no component reads: the backdrops, the blurs,
 * the masks, the glows, the dimming of siblings, the moving border and the gradient texts.
 *
 * @remarks
 *   The moving border and the shine are drawn here and moved by the `sweep` and `shimmer`
 *   animation styles, which a recipe names beside them. A backdrop is a background image, so a
 *   recipe that pairs one with a fill writes `backgroundColor`, because the `background` shorthand
 *   resets the image. A textured backdrop is drawn in the line color and the emphasized surface,
 *   which the contrast checks hold apart from every surface in both modes. The subtle line and
 *   the subtle surface meet on a light page, and a texture drawn in them was there in dark mode
 *   alone. The star field is the one backdrop drawn in `currentcolor`, because it is laid over a
 *   surface a recipe inverts, and the ink of that surface is the only color that follows it. A
 *   line a backdrop draws on the diagonal is a whole pixel wide, because half a pixel across a
 *   diagonal samples to a dashed line; an upright one holds at half.
 */

import { type LayerStyles } from "#pandacss.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Fixes the palette's solid as a custom property, for a gradient that reads the palette.
 */
const SOLID = "var(--colors-color-palette-solid)";

/**
 * Fixes the palette's ink as a custom property, for a gradient that reads the palette.
 */
const INK = "var(--colors-color-palette-fg)";

/**
 * Fixes the palette's emphasized fill as a custom property, for a band that reads on the ink in
 * light mode, where the solid is as dark as the ink.
 */
const EMPHASIZED = "var(--colors-color-palette-emphasized)";

/**
 * Fixes a tile of fractal noise as an inline image, for a backdrop with grain.
 *
 * @remarks
 *   A data URI rather than a file, so a theme package ships no asset and a stylesheet carries the
 *   grain itself. The rect is drawn at forty percent so the grain is laid over a surface rather
 *   than in place of it.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

/**
 * Places the stars of a field, each as a share of the tile the field repeats in, against how wide
 * it is drawn.
 *
 * @remarks
 *   The places are irregular, because a star field on a grid reads as a grid. Two widths give the
 *   field depth without a second image. The tile the field repeats in is twice as wide as it is
 *   tall, because a sky is wider than it is tall: a square tile repeats often enough across a wide
 *   one to read as a rhythm, and the lower half of it falls outside a short one, taking its stars
 *   with it.
 */
const STARS: ReadonlyArray<readonly [x: string, y: string, width: string]> = [
  ["8%", "14%", "{borderWidths.md}"],
  ["23%", "62%", "{borderWidths.sm}"],
  ["37%", "9%", "{borderWidths.sm}"],
  ["46%", "41%", "{borderWidths.md}"],
  ["58%", "77%", "{borderWidths.sm}"],
  ["67%", "23%", "{borderWidths.sm}"],
  ["79%", "55%", "{borderWidths.md}"],
  ["88%", "31%", "{borderWidths.sm}"],
  ["94%", "86%", "{borderWidths.sm}"],
];

/**
 * Draws every star as a dot of the ink the surface is written in, held to its own edge, because a
 * dot a pixel across that fades from its center is a smudge.
 */
const STARFIELD = STARS.map(
  ([x, y, width]) =>
    `radial-gradient(${width} ${width} at ${x} ${y}, currentcolor 99%, transparent)`,
).join(", ");

/**
 * Writes a blur of one strength.
 */
function blurred(strength: string): Look {
  return { value: { filter: `blur(${strength})` } };
}

/**
 * Writes a glow: a shadow of one blur in the palette's solid at half strength.
 */
function glow(blur: string): Look {
  return {
    value: {
      boxShadow: `0 0 ${blur} var(--shadow-color)`,
      boxShadowColor: "colorPalette.solid/50",
    },
  };
}

/**
 * Writes text drawn in a gradient rather than an ink, clipped to the glyphs.
 */
function gradientText(stops: string): Look {
  return {
    value: {
      backgroundClip: "text",
      backgroundImage: `linear-gradient(to right, ${stops})`,
      color: "transparent",
    },
  };
}

/**
 * Lists the effects.
 */
export const effects: LayerStyles = {
  backdrop: {
    aurora: { value: { backgroundImage: "{gradients.aurora}", backgroundSize: "300% 300%" } },
    checker: {
      value: {
        backgroundImage:
          "conic-gradient({colors.bg.emphasized} 25%, transparent 0 50%, {colors.bg.emphasized} 0 75%, transparent 0)",
        backgroundSize: "{sizes.8} {sizes.8}",
      },
    },
    dots: {
      value: {
        backgroundImage:
          "radial-gradient({colors.border} {borderWidths.sm}, transparent {borderWidths.sm})",
        backgroundSize: "{sizes.4} {sizes.4}",
      },
    },
    grid: {
      value: {
        backgroundImage:
          "linear-gradient(to right, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs}), linear-gradient(to bottom, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs})",
        backgroundSize: "{sizes.8} {sizes.8}",
      },
    },
    noise: { value: { backgroundImage: NOISE } },
    spotlight: {
      value: {
        "--spotlight-color": "var(--colors-color-palette-muted)",
        backgroundImage:
          "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 0%), var(--spotlight-color) 0%, transparent 55%)",
      },
    },
    stars: {
      value: { backgroundImage: STARFIELD, backgroundSize: "{sizes.96} {sizes.48}" },
    },
    stripes: {
      value: {
        backgroundImage:
          "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.sm}, transparent {borderWidths.sm} {sizes.4})",
      },
    },
    vignette: {
      value: {
        backgroundImage:
          "radial-gradient(ellipse at center, transparent 55%, {colors.blackAlpha.600})",
      },
    },
  },
  blur: {
    lg: blurred("{blurs.lg}"),
    md: blurred("{blurs.md}"),
    sm: blurred("{blurs.sm}"),
  },
  border: {
    moving: {
      value: {
        background: `linear-gradient({colors.bg.panel}, {colors.bg.panel}) padding-box, conic-gradient(from var(--angle), transparent 60%, ${SOLID} 85%, transparent) border-box`,
        borderColor: "transparent",
        borderWidth: "hairline",
      },
    },
  },
  dim: {
    others: {
      value: {
        "&:has(> :hover) > :not(:hover)": { filter: "blur({blurs.xs})", opacity: "muted" },
        "& > *": {
          transition:
            "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
        },
      },
    },
  },
  glow: {
    lg: glow("{sizes.12}"),
    md: glow("{sizes.8}"),
    sm: glow("{sizes.4}"),
  },
  mask: {
    bottom: { value: { maskImage: "linear-gradient(to bottom, black 60%, transparent)" } },
    edges: {
      value: {
        maskImage:
          "linear-gradient(to right, transparent, black {sizes.8}, black calc(100% - {sizes.8}), transparent)",
      },
    },
    radial: {
      value: { maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)" },
    },
  },
  text: {
    gradient: gradientText(`${SOLID}, var(--colors-accent-solid)`),
    shine: {
      value: {
        ...gradientText(`${INK}, ${EMPHASIZED}, ${INK}`).value,
        _dark: { backgroundImage: `linear-gradient(to right, ${INK}, ${SOLID}, ${INK})` },
        backgroundSize: "200% auto",
      },
    },
  },
};
