/**
 * Styles a skip link that is clipped until keyboard focus, and the target it moves focus to.
 *
 * @remarks
 *   The link applies the `srOnly` utility at rest. Under `:focus-visible` it resets each property
 *   the clipping sets and fixes itself to the window's start corner on the `fill.surface` layer
 *   style. It does not use `srOnly: false`, which expands to `position: static` and `padding: 0`
 *   and conflicts with the fixed position and the padding. The target sets a scroll margin, so a
 *   sticky header does not cover it. The recipe has no axis, because the link has one look and the
 *   target renders nothing.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Clips the link at rest and offsets the target from the top of the scroll container.
 */
export const recipe = defineSlotRecipe({
  base: {
    link: {
      _focusVisible: {
        blockSize: "auto",
        borderRadius: "l2",
        clip: "auto",
        inlineSize: "auto",
        insetBlockStart: dense("{spacing.inset.md}"),
        insetInlineStart: dense("{spacing.inset.md}"),
        layerStyle: "fill.surface",
        margin: "0",
        overflow: "visible",
        paddingBlock: dense("{spacing.inset.sm}"),
        paddingInline: dense("{spacing.inset.md}"),
        position: "fixed",
        textStyle: "label.md",
        zIndex: "skipNav",
      },
      srOnly: true,
    },
    target: { scrollMarginBlockStart: dense("{spacing.inset.lg}") },
  },
  className: "skip-nav",
  jsx: [/^SkipNav(\.\w+)?$/u],
  slots: ["link", "target"],
});
