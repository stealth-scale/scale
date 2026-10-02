/**
 * Recipe for the toggle tip: a short note that a press opens beside its trigger, with an arrow.
 *
 * @remarks
 *   The toggle tip looks like the tooltip and opens like the popover, so the recipe repeats the
 *   tooltip's looks and sizes and gives the trigger a control's cursor, focus ring and disabled
 *   look. The machine has no root part. The recipe adds a root with `display: contents`, because
 *   the trigger and the positioner are siblings and a slot recipe passes its variants from an
 *   element above both. The machine writes the positioner's position inline, so the recipe sets no
 *   position. The content takes the `tooltip` z-index, so a tip opened inside a popover renders
 *   above it, and reads the label role. It wraps at 20rem, or at the room the machine measures on
 *   its side of the trigger, `--available-width`, where that is less. A link inside the content
 *   takes the content's ink and an underline, because the link ink measures 1.71:1 in light mode
 *   and 1.38:1 in dark mode on the inverted surface of the ink theme. Each look sets
 *   `--toggle-tip-surface` once, and the arrow tip reads it. The inverted look has a transparent
 *   hairline edge, which forced colors paint in `CanvasText`. The recipe has no `palette` axis,
 *   because both looks use neutral surfaces, and no `effect` axis, because a note is not a
 *   control.
 */

import {
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  onSlot,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defines the toggle tip recipe: an inverted tip at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    arrow: { "--arrow-background": "var(--toggle-tip-surface)", "--arrow-size": "sizes.icon.xs" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      "& a": { color: "inherit", textDecoration: "underline" },
      background: "var(--toggle-tip-surface)",
      borderRadius: "l2",
      boxShadow: "md",
      fontWeight: "medium",
      maxInlineSize: "min({sizes.xs}, var(--available-width, {sizes.xs}))",
      textWrap: "pretty",
      transformOrigin: "var(--transform-origin)",
      zIndex: "tooltip",
    },
    positioner: { position: "relative" },
    root: { display: "contents" },
    trigger: { ...interactive(), alignItems: "center", display: "inline-flex" },
  },
  className: "toggle-tip",
  defaultVariants: { size: "md", variant: "inverted" },
  jsx: [/^ToggleTip(\.\w+)?$/u],
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
        arrowTip: { borderColor: "var(--toggle-tip-surface)" },
        content: {
          "--toggle-tip-surface": "colors.bg.inverted",
          borderColor: "transparent",
          borderStyle: "solid",
          borderWidth: "hairline",
          color: "fg.inverted",
        },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--toggle-tip-surface": "colors.bg.popover",
          borderColor: "border",
          borderWidth: "hairline",
          color: "fg",
        },
      },
    },
  },
});
