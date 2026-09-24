/**
 * Recipe for the tooltip: a short label beside its trigger, with an arrow.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the positioner are siblings and a slot recipe passes its variants from an element
 *   above both. The machine measures the trigger and writes the positioner's position inline, so
 *   the recipe sets no position. The content scales from the `--transform-origin` the machine sets.
 *   The content takes the `tooltip` z-index. The machine writes `z-index: var(--z-index)` inline on
 *   the positioner from the content's computed value, so a z-index on the positioner has no effect.
 *   Each look sets `--tooltip-surface` once, and the arrow tip reads it. The content reads the
 *   label role and wraps at `maxWidth: xs`. The trigger has no styles, because the caller passes
 *   the control through `as`. The recipe has no `palette` axis, because both looks use neutral
 *   surfaces, and no `effect` axis, because a tooltip is not a control.
 */

import {
  defineSlotRecipe,
  dense,
  motion,
  onSlot,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defines the tooltip recipe: an inverted tooltip at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    arrow: { "--arrow-background": "var(--tooltip-surface)", "--arrow-size": "sizes.icon.xs" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      background: "var(--tooltip-surface)",
      borderRadius: "l2",
      boxShadow: "md",
      fontWeight: "medium",
      maxWidth: "xs",
      textWrap: "pretty",
      transformOrigin: "var(--transform-origin)",
      zIndex: "tooltip",
    },
    positioner: { position: "relative" },
    root: { display: "contents" },
  },
  className: "tooltip",
  defaultVariants: { size: "md", variant: "inverted" },
  jsx: [/^Tooltip(\.\w+)?$/u],
  slots: ["root", "trigger", "positioner", "content", "arrow", "arrowTip"],
  variants: {
    /**
     * Padding of the content on the inset scale and its text on the label role.
     */
    size: onSlot(
      "content",
      sizeVariants((size) => ({
        padding: dense(`{spacing.inset.${size}}`),
        textStyle: `label.${size}`,
      })),
    ),

    /**
     * Surface of the content: the inverted surface, or the popover surface inside a hairline edge.
     */
    variant: {
      inverted: {
        arrowTip: { borderColor: "var(--tooltip-surface)" },
        content: { "--tooltip-surface": "colors.bg.inverted", color: "fg.inverted" },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--tooltip-surface": "colors.bg.popover",
          borderColor: "border",
          borderWidth: "hairline",
          color: "fg",
        },
      },
    },
  },
});
