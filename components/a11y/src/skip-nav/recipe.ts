/**
 * Styles a skip link that is clipped until it takes focus, and the target it jumps to.
 *
 * @remarks
 *   The link uses the same `srOnly` clipping as the hidden text component and cancels it under
 *   `:focus-visible`, so a keyboard user meets it on the first Tab and everyone else never sees
 *   it. The target sets only a scroll margin, because a page decides its own appearance and the
 *   target exists purely to give focus somewhere to land below a sticky header.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * The `skip-nav` slot recipe over a link and a target, with no variants.
 */
export const recipe = defineSlotRecipe({
  base: {
    link: {
      _focusVisible: {
        borderRadius: "l2",
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
      srOnly: true,
    },
    target: { scrollMarginBlockStart: dense("{spacing.inset.lg}") },
  },
  className: "skip-nav",
  jsx: [/^SkipNav(\.\w+)?$/u],
  slots: ["link", "target"],
});
