/**
 * Styles content that a screen reader announces and the browser does not paint.
 *
 * @remarks
 *   The base applies the `srOnly` utility, which clips the element to 1px and keeps it in the
 *   accessibility tree. `display: none` and `visibility: hidden` remove it from the tree. The
 *   `focusable` value cancels the clipping under `:focus-visible` and fixes the element to the
 *   window's start corner, so a keyboard user sees the control that holds focus. The recipe has no
 *   `palette` or `effect` axis, because the element renders nothing at rest.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Clips the element at rest.
 */
export const recipe = defineRecipe({
  base: { srOnly: true },
  className: "visually-hidden",
  jsx: [/^VisuallyHidden$/u],
  variants: {
    /**
     * Reveals the element under keyboard focus, on the `fill.surface` layer style at the window's
     * start corner.
     *
     * @remarks
     *   The value resets each property the clipping sets. It does not use `srOnly: false`, which
     *   expands to `position: static` and `padding: 0` and conflicts with the fixed position and
     *   the padding.
     */
    focusable: {
      true: {
        _focusVisible: {
          blockSize: "auto",
          borderRadius: "l1",
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
      },
    },
  },
});
