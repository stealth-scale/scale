/**
 * States what a popover is: a panel that opens beside a control and holds more than a few words.
 *
 * @remarks
 *   The machine names no root, because a popover is a control and a panel that floats beside it
 *   rather than a thing that frames the two. This recipe adds one anyway, drawn with
 *   `display: contents` so it takes part in no layout, because the control and the panel are
 *   siblings and a slot recipe hands its variants down from an element above them both.
 *   The positioner is placed by the machine, which measures the control and writes the panel's
 *   position as inline styles, so this recipe states nothing about where the panel goes. It grows
 *   from whichever corner the machine placed it against, which is a custom property the machine
 *   sets.
 *   A popover is louder than a tooltip. It holds a heading, a paragraph and often a control, so it
 *   reads at body text and takes the room a panel needs.
 */

import {
  defineSlotRecipe,
  dense,
  insetSizes,
  interactive,
  motion,
  onSlots,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Draws a surfaced popover at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    arrow: { "--arrow-background": "var(--popover-surface)", "--arrow-size": "sizes.icon.sm" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    closeTrigger: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      insetBlockStart: "0",
      insetInlineEnd: "0",
      justifyContent: "center",
      position: "absolute",
    },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      _focusVisible: { focusVisibleRing: "outside" },
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.sm}"),
      position: "relative",
      transformOrigin: "var(--transform-origin)",
      zIndex: "popover",
    },
    description: { color: "fg.muted" },
    indicator: {
      _motionReduce: { transitionDuration: "0s" },
      _open: { rotate: "180deg" },
      transitionDuration: "press",
    },
    positioner: { position: "relative" },
    root: { display: "contents" },
    title: { fontWeight: "semibold" },
  },
  className: "popover",
  defaultVariants: { size: "md", variant: "surface" },
  jsx: [/^Popover(\.\w+)?$/u],
  slots: [
    "root",
    "anchor",
    "trigger",
    "indicator",
    "positioner",
    "content",
    "title",
    "description",
    "closeTrigger",
    "arrow",
    "arrowTip",
  ],
  variants: {
    /**
     * How much room the panel takes, and how loud its heading is.
     */
    size: onSlots({
      content: insetSizes(),
      description: textSizes("body"),
      title: textSizes("heading"),
    }),

    /**
     * How the panel is set off from the page behind it.
     */
    variant: {
      elevated: {
        arrowTip: { borderColor: "var(--popover-surface)" },
        content: {
          "--popover-surface": "colors.bg.panel",
          background: "var(--popover-surface)",
          borderRadius: "l3",
          boxShadow: "xl",
        },
      },
      glass: {
        arrowTip: { borderColor: "border" },
        content: {
          "--popover-surface": "colors.bg.popover",
          borderRadius: "l3",
          layerStyle: "glass",
        },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--popover-surface": "colors.bg.popover",
          background: "var(--popover-surface)",
          borderColor: "border",
          borderRadius: "l3",
          borderWidth: "hairline",
          boxShadow: "lg",
        },
      },
    },
  },
});
