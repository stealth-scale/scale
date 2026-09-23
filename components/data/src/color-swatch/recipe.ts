/**
 * Declares the colour swatch recipe: a box of one colour, or of two to four, over a checkerboard.
 *
 * @remarks
 *   The colour is a runtime value, so it reaches the stylesheet as a custom property the recipe
 *   reads: `--color-swatch-value`, or `--color-swatch-1` to `--color-swatch-4` for a mix. The
 *   checkerboard under it shows a translucent colour as translucent, where a flat background would
 *   show it as a lighter opaque one. The layers are written as longhands, because in the
 *   `background` shorthand the compiler reads the slash after a token as an opacity modifier. A
 *   hairline border draws the edge, so a white swatch on a white page has an edge. The background
 *   is clipped to the padding box. Firefox antialiases a background that runs to the outer edge
 *   apart from an inset shadow or a border drawn over it, and a curved corner then shows a fringe
 *   of the colour outside the edge. `forcedColorAdjust: none` keeps the colour in forced colors
 *   mode. The swatch shows a
 *   value, not a palette, so it offers no `palette` or `effect` axis.
 */

import { defineRecipe, iconSizes, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * The checkerboard under every swatch, in the page's two quietest surfaces.
 */
const CHECKER = "repeating-conic-gradient({colors.bg.emphasized} 0% 25%, {colors.bg} 0% 50%)";

/**
 * Returns the background layers of a mix: a conic gradient of the colours over the checkerboard.
 *
 * @param stops - The conic gradient's colour stops, clockwise from the top.
 * @returns The `backgroundImage`, `backgroundPosition` and `backgroundSize` of the mix.
 */
function mixed(stops: string): SystemStyleObject {
  return {
    backgroundImage: `conic-gradient(${stops}), ${CHECKER}`,
    backgroundPosition: "0 0, 0 50%",
    backgroundSize: "auto, var(--color-swatch-checker) var(--color-swatch-checker)",
  };
}

/**
 * Styles a swatch at the middle icon size with rounded corners.
 */
export const recipe = defineRecipe({
  base: {
    "--color-swatch-checker": "{spacing.2}",
    backgroundClip: "padding-box",
    backgroundImage: `linear-gradient(var(--color-swatch-value, transparent), var(--color-swatch-value, transparent)), ${CHECKER}`,
    backgroundOrigin: "padding-box",
    backgroundPosition: "0 0, 0 50%",
    backgroundSize: "auto, var(--color-swatch-checker) var(--color-swatch-checker)",
    borderColor: "border",
    borderStyle: "solid",
    borderWidth: "hairline",
    display: "inline-block",
    flexShrink: "0",
    forcedColorAdjust: "none",
    verticalAlign: "middle",
  },
  className: "color-swatch",
  defaultVariants: { shape: "rounded", size: "md" },
  jsx: [/^ColorSwatch(Mix)?$/u],
  variants: {
    /**
     * How a mix divides the box: two halves, two quarters over a half, or four quarters.
     *
     * @remarks
     *   `ColorSwatchMix` sets this from the number of colours it receives.
     */
    mix: {
      halves: mixed("var(--color-swatch-2) 0% 50%, var(--color-swatch-1) 0%"),
      quarters: mixed(
        "var(--color-swatch-2) 0% 25%, var(--color-swatch-4) 0% 50%, var(--color-swatch-3) 0% 75%, var(--color-swatch-1) 0%",
      ),
      thirds: mixed(
        "var(--color-swatch-2) 0% 25%, var(--color-swatch-3) 0% 75%, var(--color-swatch-1) 0%",
      ),
    },

    /**
     * The corners of the box.
     */
    shape: {
      circle: { borderRadius: "full" },
      rounded: { borderRadius: "l1" },
      square: { borderRadius: "none" },
    },

    /**
     * The box on the icon scale, the full size of its container, or the height of the surrounding
     * text.
     */
    size: { ...iconSizes(), full: { boxSize: "full" }, inherit: { boxSize: "1em" } },
  },
});
