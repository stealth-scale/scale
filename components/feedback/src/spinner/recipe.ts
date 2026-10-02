/**
 * Declares the spinner recipe, a ring whose arc turns while work of unknown length runs.
 *
 * @remarks
 *   The block start and inline end borders draw the arc and the other two draw the track, so the
 *   stroke is a border width and keeps its weight at every size. The turn is the foundation's
 *   `spin` animation style, which a theme retimes and which stops under reduced motion. Each border
 *   side is a longhand, so the compiled rule contains no shorthand that overrides a side. In forced
 *   colors the browser paints all four sides in `CanvasText`, transparent ones included, so
 *   `_highContrast` sets `forcedColorAdjust: none` and draws the arc in `CanvasText` itself.
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
     * Border width of the ring. `hairline`, `control` and `indicator` read the theme's stroke
     * tokens, and `heavy` reads the 4px `lg` width.
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
