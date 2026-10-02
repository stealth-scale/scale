/**
 * Styles a spark, a run of values the size of a word: the box recharts renders the run in, and the
 * baseline across it.
 *
 * @remarks
 *   The box takes its size from the grid, four times as wide as it is tall: 64 by 16 pixels at
 *   `sm`, 96 by 24 at `md` and 128 by 32 at `lg`, times the density. `stretch` fills the
 *   container's width at the size's height. A baseline renders in the subtle ink, and in
 *   `CanvasText` under forced colors, where the run keeps its color because neither Firefox nor
 *   Chromium replaces an SVG `fill` or `stroke`. The recipe has no `palette` axis, because the run
 *   takes a palette through the component's `color`.
 */

import { defineRecipe, dense, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * Selects the line of a baseline recharts renders across the run.
 */
const BASELINE = "& .recharts-reference-line line";

/**
 * Maps each size to the grid step of its height.
 */
const HEIGHTS: Readonly<Record<"lg" | "md" | "sm", string>> = { lg: "8", md: "6", sm: "4" };

/**
 * Maps each size to the grid step of its width.
 */
const WIDTHS: Readonly<Record<"lg" | "md" | "sm", string>> = { lg: "32", md: "24", sm: "16" };

/**
 * Defines the spark recipe: an inline box at the middle size.
 */
export const recipe = defineRecipe({
  base: {
    [BASELINE]: { _highContrast: { stroke: "CanvasText" }, stroke: "fg.subtle" },
    display: "inline-flex",
    flexShrink: "0",
    verticalAlign: "middle",
  },
  className: "spark",
  defaultVariants: { size: "md" },
  jsx: [/^Spark(bar|line)$/u],
  variants: {
    /**
     * Box on the grid, four times as wide as it is tall.
     */
    size: sizeVariants(
      (size) => ({
        blockSize: dense(`{sizes.${HEIGHTS[size]}}`),
        inlineSize: dense(`{sizes.${WIDTHS[size]}}`),
      }),
      ["sm", "md", "lg"],
    ),

    /**
     * Whether the box fills its container's width at the size's height.
     */
    stretch: { true: { display: "flex", inlineSize: "full" } },
  },
});
