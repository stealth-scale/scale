/**
 * States what a way past the navigation is: a link a keyboard reaches first and an eye sees only
 * while focus is on it, and the place on the page it jumps to.
 *
 * @remarks
 *   The link is hidden the way the hidden text is hidden, and comes into view under focus, so a
 *   reader tabbing into the page meets it and a reader who never tabs never sees it. The target
 *   states nothing but its own class, because a page decides what it looks like and the target's
 *   whole job is to be somewhere focus can land.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Draws the link over the top of the page while focus is on it, and leaves the target alone.
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
