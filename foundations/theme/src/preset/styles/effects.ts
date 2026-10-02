/**
 * Defines the effect layer styles: backdrops, blurs, masks, glows, sibling dimming, the moving
 * border and gradient text.
 *
 * @remarks
 *   The `sweep` and `shimmer` animation styles animate the moving border and the shine. A backdrop
 *   is a background image, so a recipe that pairs one with a fill sets `backgroundColor`, because
 *   the `background` shorthand resets the image. Textured backdrops use the `border` color and the
 *   `bg.emphasized` surface, which the contrast checks keep distinct from every surface in both
 *   modes. The star field uses `currentcolor`, because recipes lay it over surfaces they invert. A
 *   diagonal stripe is 1px wide, because a 0.5px diagonal line renders as a dashed line.
 */

import { type LayerStyles } from "#pandacss.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Custom property of the palette's `solid` role, for gradients that read the palette.
 */
const SOLID = "var(--colors-color-palette-solid)";

/**
 * Custom property of the palette's `fg` role, for gradients that read the palette.
 */
const INK = "var(--colors-color-palette-fg)";

/**
 * Custom property of the palette's `emphasized` role.
 *
 * @remarks
 *   The light-mode shine uses it, because the solid is as dark as the ink in light mode.
 */
const EMPHASIZED = "var(--colors-color-palette-emphasized)";

/**
 * Inline SVG image of fractal noise, for the grain backdrop.
 *
 * @remarks
 *   A data URI keeps the grain in the stylesheet, so a theme package ships no asset file. The rect
 *   is at 40% opacity, so the grain tints the surface under it.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

/**
 * Lists the position and width of each star, as percentages of the tile.
 *
 * @remarks
 *   The positions are irregular, because stars on a lattice read as a lattice. The field uses two
 *   widths. The tile is 384 by 192px, because a square tile repeats visibly across a wide panel
 *   and a short panel clips its lower half.
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
 * Radial gradients for the star field, one hard-edged `currentcolor` dot per star.
 *
 * @remarks
 *   Each dot ends at 99% of its radius, because a 1px dot that fades from its centre renders as a
 *   smudge.
 */
const STARFIELD = STARS.map(
  ([x, y, width]) =>
    `radial-gradient(${width} ${width} at ${x} ${y}, currentcolor 99%, transparent)`,
).join(", ");

/**
 * Selects a child that is hovered, focused from the keyboard or pressed.
 */
const ACTIVE = ":hover, :focus-visible, [aria-pressed=true]";

/**
 * Returns a layer style that blurs by one step of the blur scale.
 */
function blurred(strength: string): Look {
  return { value: { filter: `blur(${strength})` } };
}

/**
 * Returns a glow layer style: a box shadow in the palette's solid at 50% opacity.
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
 * Returns a layer style that paints text with a linear gradient clipped to the glyphs.
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
 * Lists the effect layer styles by group.
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
    /**
     * Blurs and fades every child except a hovered, keyboard-focused or pressed one, while the
     * container has such a child.
     *
     * @remarks
     *   A pressed child keeps the others dimmed at rest, so a set of toggle buttons shows its
     *   choice without a pointer.
     */
    others: {
      value: {
        "& > *": {
          transition:
            "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
        },
        [`&:has(> :is(${ACTIVE})) > :not(${ACTIVE})`]: {
          filter: "blur({blurs.xs})",
          opacity: "muted",
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
