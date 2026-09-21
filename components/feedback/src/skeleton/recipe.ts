/**
 * Declares the recipe a skeleton is styled from, the placeholder a surface shows while content is
 * still in flight.
 *
 * @remarks
 *   A skeleton wraps the content it covers rather than replacing it, so a caller writes one
 *   tree and toggles one prop. While loading it adopts that content's own box and hides everything
 *   inside it, which is how the placeholder takes the size of the real thing without anyone
 *   declaring a width; once loading ends it fades the content in and otherwise gets out of the
 *   way. The fade lives in the base rather than under `loading: false`, because a boolean variant
 *   emits no class for its false value and a rule declared there would reach no element. Each
 *   motion is nested under the loading class, so a skeleton that has finished keeps neither the
 *   pulse nor the shimmer. Every motion resolves to an animation style the theme owns, which is
 *   what lets a reduced-motion preference be honoured once in the theme instead of in every
 *   recipe. No colour, length or duration is declared here. The placeholder uses the neutral
 *   palette's quiet fills, which lift above a dark page instead of sinking into it, so that it
 *   reads as content on its way rather than as a hole.
 */

import { cornerVariants, defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Selects an element that is still loading, for a motion variant to nest its rules under.
 *
 * @remarks
 *   The selector is written the way the compiler spells a variant class, the axis and the value
 *   joined by its separator, so that the naming pass rewrites it alongside the class it targets.
 */
const WHILE_LOADING = "&.skeleton--loading_true";

/**
 * Styles a skeleton, defaulting to a loading placeholder that pulses at the middle radius.
 */
export const recipe = defineRecipe({
  base: { animationStyle: "fade.in" },
  className: "skeleton",
  defaultVariants: { loading: true, motion: "pulse", radius: "l2" },
  jsx: [/^Skeleton$/u],
  variants: {
    /**
     * Whether the content behind the placeholder is still in flight.
     */
    loading: {
      true: {
        "&::before, &::after, *": { visibility: "hidden" },
        background: "colorPalette.muted",
        backgroundClip: "padding-box",
        boxShadow: "none",
        color: "transparent",
        colorPalette: "neutral",
        flexShrink: "0",
        pointerEvents: "none",
        userSelect: "none",
      },
    },

    /**
     * The animation the placeholder runs while loading.
     */
    motion: {
      none: { [WHILE_LOADING]: { animation: "none" } },
      pulse: { [WHILE_LOADING]: { animationStyle: "pulse" } },
      shimmer: {
        [WHILE_LOADING]: {
          animationStyle: "shimmer",
          backgroundImage:
            "linear-gradient(270deg, var(--colors-color-palette-muted), var(--colors-color-palette-emphasized))",
          backgroundSize: "400% 100%",
        },
      },
    },

    radius: cornerVariants(),
  },
});
