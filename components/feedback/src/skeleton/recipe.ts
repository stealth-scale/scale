/**
 * Declares the skeleton recipe, which paints a placeholder over content that is still loading.
 *
 * @remarks
 *   A skeleton wraps the content it covers, so a caller writes one tree and toggles `loading`.
 *   While loading, the element keeps the box of its content and hides everything inside it, so the
 *   placeholder has the content's size without a declared width. The fade-in is in the base,
 *   because the compiler emits no class for the `false` value of a boolean axis. Each motion is
 *   nested under the loading class, so a finished skeleton runs no animation. Every motion is a
 *   theme animation style, so the theme applies the reduced-motion preference once. The fill is the
 *   neutral palette's `muted` role, which is lighter than a dark page. Under forced colors the
 *   browser replaces the fill with Canvas, so a loading skeleton draws a `GrayText` hairline
 *   outline inside its box. An outline leaves the layout unchanged. The recipe has no `palette`
 *   axis, because a placeholder signals loading and not a category. It has no `effect` axis,
 *   because `motion` already animates it.
 */

import { cornerVariants, defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Selector for a skeleton that is loading, under which each motion nests its rules.
 *
 * @remarks
 *   The selector uses the compiler's variant class name, the axis and the value joined by `_`, so
 *   the naming plugin rewrites it together with the class.
 */
const WHILE_LOADING = "&.skeleton--loading_true";

/**
 * Skeleton recipe, loading with the pulse motion at the l2 radius by default.
 */
export const recipe = defineRecipe({
  base: { animationStyle: "fade.in" },
  className: "skeleton",
  defaultVariants: { loading: true, motion: "pulse", radius: "l2" },
  jsx: [/^Skeleton$/u],
  variants: {
    /**
     * Whether the content is still loading. `true` paints the placeholder and hides the content.
     */
    loading: {
      true: {
        _highContrast: {
          outlineColor: "GrayText",
          outlineOffset: "calc(-1 * {borderWidths.hairline})",
          outlineStyle: "solid",
          outlineWidth: "hairline",
        },
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
     * Animation of the placeholder while loading.
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
