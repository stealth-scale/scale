/**
 * States what visually hidden text is: words a screen reader reads and an eye never sees, and
 * which come into view where a keyboard reaches them.
 *
 * @remarks
 *   The compiler's `srOnly` utility writes the hiding, which takes the words out of sight without
 *   taking them out of the accessibility tree the way `display: none` and `visibility: hidden`
 *   both do. A control a reader can reach by keyboard has to be visible once focus is on it, or a
 *   sighted reader tabbing through the page loses their place, so the focusable value undoes the
 *   hiding for as long as focus is there.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Hides what it holds from sight and leaves it to a screen reader.
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
