/**
 * States what a tooltip is: a short label that appears beside what a pointer rests on.
 *
 * @remarks
 *   The machine names no root, because a tooltip is a control and a box that floats beside it
 *   rather than a thing that frames the two. This recipe adds one anyway, drawn with
 *   `display: contents` so it takes part in no layout, because the control and the box are
 *   siblings and a slot recipe hands its variants down from an element above them both.
 *   The positioner is placed by the machine, which measures the trigger and writes the box's
 *   position as inline styles, so this recipe states nothing about where the box goes. It states
 *   what the box looks like, and it grows from whichever corner the machine placed it against,
 *   which is a custom property the machine sets.
 *   Both looks name their surface once as a custom property, because the arrow has to be filled in
 *   the same colour as the box and reads it from there rather than restating it.
 *   A tooltip is quieter than a popover. It holds a few words, so it reads at a label rather than
 *   at body text, and it is capped narrow so a long hint wraps rather than running the width of the
 *   page.
 *   The control draws no look of its own. A tooltip describes a control that is already on the
 *   page, so the control is the caller's and is drawn through `as`: a button of the library, a
 *   link, or whatever the hint belongs to. A look written here would be a second look fighting the
 *   one the caller passed.
 */

import {
  defineSlotRecipe,
  dense,
  motion,
  onSlot,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws an inverted tooltip at the middle size until a caller says otherwise.
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
     * How much room the box takes, and how loud its words are.
     */
    size: onSlot(
      "content",
      sizeVariants((size) => ({
        padding: dense(`{spacing.inset.${size}}`),
        textStyle: `label.${size}`,
      })),
    ),

    /**
     * How the box is set off from the page behind it.
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
