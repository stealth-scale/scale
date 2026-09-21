/**
 * Styles for content that is announced but not painted, and for the variant that reveals it under
 * focus.
 *
 * @remarks
 *   The hiding comes from the compiler's `srOnly` utility, which clips the element instead of
 *   applying `display: none` or `visibility: hidden`; either of those would drop the content from
 *   the accessibility tree as well as from the page. Anything reachable by keyboard has to become
 *   visible while it holds focus, or a sighted keyboard user loses track of where they are, so the
 *   `focusable` variant reverses the clipping under `:focus-visible` and pins the element to the
 *   start corner of the viewport above the rest of the page.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * The `visually-hidden` recipe, matched against the `VisuallyHidden` JSX tag.
 */
export const recipe = defineRecipe({
  base: { srOnly: true },
  className: "visually-hidden",
  jsx: [/^VisuallyHidden$/u],
  variants: {
    focusable: {
      true: {
        _focusVisible: {
          borderRadius: "l1",
          insetBlockStart: dense("{spacing.inset.md}"),
          insetInlineStart: dense("{spacing.inset.md}"),
          layerStyle: "fill.surface",
          paddingBlock: dense("{spacing.inset.sm}"),
          paddingInline: dense("{spacing.inset.md}"),
          position: "fixed",
          srOnly: false,
          textStyle: "label.md",
          zIndex: "skipNav",
        },
      },
    },
  },
});
