/**
 * Styles a track, a range that fills it to the value, a label and the value in words, for the
 * progress bar and the meter.
 *
 * @remarks
 *   The bar's grid, its words, its track and its range come from `bar.ts`. The meter renders the
 *   same parts, so it takes the same classes and offers every axis but the stripes, their movement
 *   and the effect. Stripes are a band in the palette's contrast ink at a quarter strength over the
 *   range, and move at 40px a second. For a value the machine does not know, a segment of the range
 *   crosses the track once per 1.2s. For a reader who asked for less motion both stop, and the
 *   segment spreads over the whole track, so the bar never reads as a value it does not have.
 */

import { defineSlotRecipe, onSlot, PALETTES } from "@stealthscale/theme/authoring";

import { BASE, VARIANTS } from "#bar.ts";

/**
 * Styles the stripes: a band at 45 degrees in the range's ink, repeated on a square tile.
 */
const STRIPES = {
  backgroundImage:
    "linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 50%, currentColor 50%, currentColor 75%, transparent 75%, transparent)",
  backgroundSize: "{sizes.4} {sizes.4}",
  color: "colorPalette.contrast/25",
};

/**
 * Moves the stripes three tiles towards the start per 1.2s loop, 40px a second, and the loop has
 * no seam because it moves whole tiles.
 *
 * @remarks
 *   The `shimmer` motion moves a background and stops under reduced motion. Its pace is the slow
 *   ambient one, 5s. The stripes state the ambient pace where motion is allowed, because a pace
 *   stated beside the motion does not apply over it.
 */
const MOVING = {
  _motionSafe: { animationDuration: "ambient" },
  "--animate-from": "calc({sizes.4} * 3)",
  "--animate-to": "0",
  animationStyle: "shimmer",
};

/**
 * Moves a segment half the track's width from beyond its start to beyond its end once per 1.2s.
 *
 * @remarks
 *   The segment is a gradient in the palette's solid that fades out at both ends. Its position runs
 *   from -100% to 200% of the room it leaves, which puts it wholly outside the track at both ends
 *   of the loop.
 */
const SWEEP = {
  _highContrast: { color: "Highlight" },
  _motionReduce: { backgroundSize: "100% 100%" },
  _motionSafe: { animationDuration: "ambient", animationTimingFunction: "in-out" },
  _rtl: { "--animate-from": "200%", "--animate-to": "-100%" },
  "--animate-from": "-100%",
  "--animate-to": "200%",
  animationStyle: "shimmer",
  backgroundColor: "transparent",
  backgroundImage: "linear-gradient(to right, transparent, currentColor, transparent)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "50% 100%",
  color: "colorPalette.solid",
  inlineSize: "full",
};

/**
 * Styles a bar in the primary palette, in the outline look, at the middle size, with round ends.
 */
export const recipe = defineSlotRecipe({
  base: { ...BASE, range: { ...BASE.range, "&[data-state=indeterminate]": SWEEP } },
  className: "progress",
  defaultVariants: {
    layout: "stacked",
    palette: "primary",
    shape: "full",
    size: "md",
    variant: "outline",
  },
  jsx: [/^Progress\.\w+$/u, /^Meter\.\w+$/u],
  slots: ["root", "label", "valueText", "track", "range", "segment", "marker"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Moves the stripes, adding them where `striped` is not set.
     */
    animated: { true: { range: { ...STRIPES, ...MOVING } } },

    /**
     * The halo around the range, in the palette's solid.
     *
     * @remarks
     *   `pulse` animates the halo on a layer over the range, because the range's own animation
     *   moves its stripes. Both stop under reduced motion.
     */
    effect: onSlot("range", {
      glow: { layerStyle: "glow.sm" },
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
    }),
    layout: VARIANTS.layout,
    palette: VARIANTS.palette,
    shape: VARIANTS.shape,
    size: VARIANTS.size,
    striped: { true: { range: STRIPES } },
    variant: VARIANTS.variant,
  },
});
