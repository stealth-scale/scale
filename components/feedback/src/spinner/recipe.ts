/**
 * Declares the spinner's styles: a ring whose arc turns while work with no measurable progress
 * runs.
 *
 * @remarks
 *   Two border sides draw the arc and the other two draw the track, so the stroke is a border width
 *   and keeps its weight at every size. The turn is the foundation's `spin` animation style, which
 *   a theme retimes and which stops when the reader prefers reduced motion. Every side is written
 *   as a longhand, so the compiled rule holds no shorthand that could override a side. In forced
 *   colors mode the browser paints all four sides in `CanvasText`, transparent ones included, which
 *   closes the ring and hides the turn. Measured in Chromium on 2026-09-23. `_highContrast`
 *   therefore sets `forcedColorAdjust: none` and draws the arc in `CanvasText` itself.
 */

import { defineRecipe, iconSizes, paletteVariants } from "@stealthscale/theme/authoring";

/**
 * Styles a spinner, defaulting to the medium icon size and the indicator stroke in the current
 * ink.
 */
export const recipe = defineRecipe({
  base: {
    _highContrast: {
      borderBlockEndColor: "transparent",
      borderBlockStartColor: "CanvasText",
      borderInlineEndColor: "CanvasText",
      borderInlineStartColor: "transparent",
      forcedColorAdjust: "none",
    },
    animationStyle: "spin",
    borderBlockEndColor: "transparent",
    borderBlockStartColor: "currentcolor",
    borderInlineEndColor: "currentcolor",
    borderInlineStartColor: "transparent",
    borderRadius: "full",
    borderStyle: "solid",
    color: "colorPalette.solid",
    display: "inline-block",
    flexShrink: "0",
    position: "relative",
    verticalAlign: "middle",
  },
  className: "spinner",
  defaultVariants: { palette: "current", size: "md", stroke: "indicator" },
  jsx: [/Spinner$/u],
  variants: {
    /**
     * The halo drawn around the ring, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` runs on `::after`, because its keyframe animates `box-shadow` through the
     *   `animation` property, which the element already uses for the spin. Both effects stop
     *   animating when the reader prefers reduced motion.
     */
    effect: {
      glow: { layerStyle: "glow.md" },
      pulse: {
        _after: {
          animationStyle: "pulse-glow",
          borderRadius: "inherit",
          boxShadowColor: "colorPalette.solid/50",
          content: '""',
          inset: "0",
          position: "absolute",
        },
      },
    },

    /**
     * The palette the arc is drawn in, as its `solid` role.
     *
     * @remarks
     *   `current` draws the arc in the surrounding ink instead, so a spinner inside a solid button
     *   takes the button's label ink.
     */
    palette: { ...paletteVariants(), current: { color: "currentcolor" } },
    size: { ...iconSizes(), inherit: { boxSize: "1em" } },

    /**
     * The width of the ring: the theme's three semantic strokes, and `heavy` at the 4px step.
     */
    stroke: {
      control: { borderWidth: "control" },
      hairline: { borderWidth: "hairline" },
      heavy: { borderWidth: "lg" },
      indicator: { borderWidth: "indicator" },
    },

    /**
     * Whether the two track sides draw the ring behind the arc, in the palette's `muted` role.
     */
    track: {
      true: {
        _highContrast: { borderBlockEndColor: "GrayText", borderInlineStartColor: "GrayText" },
        borderBlockEndColor: "colorPalette.muted",
        borderInlineStartColor: "colorPalette.muted",
      },
    },
  },
});
