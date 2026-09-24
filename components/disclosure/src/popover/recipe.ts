/**
 * Recipe for the popover: a panel beside its trigger, with a heading, a description, a close
 * button and an arrow.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the positioner are siblings and a slot recipe passes its variants from an element
 *   above both. The machine writes the positioner's position inline, so the recipe sets no
 *   position. The panel scales from the machine's `--transform-origin` and is at least as wide as
 *   the trigger, `--reference-width`. The panel reads the body role and the title the heading role.
 *   The trigger takes a control's cursor, focus ring and disabled look, and no fill, edge or
 *   padding, so a caller passes a button through `as`. The recipe has no `palette` axis, because
 *   every look uses a neutral surface, and no `effect` axis, because a panel is not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  onSlots,
  sizeVariants,
  textSizes,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the size axis sets to the room the title leaves for the close trigger.
 *
 * @remarks
 *   The close trigger is positioned absolutely, so a long title ran under it. The size axis sets
 *   the room once, and the title reads it as its inline-end padding.
 */
const CLOSED = "--popover-closed";

/**
 * Defines the popover recipe: the surface look at size `md` by default.
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
      minInlineSize: "var(--reference-width)",
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
    title: { fontWeight: "semibold", paddingInlineEnd: `var(${CLOSED})` },
    trigger: {
      ...interactive(),
      alignItems: "center",
      display: "inline-flex",
      gap: dense("{spacing.gap.xs}"),
    },
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
     * Padding of the panel, text of the title and the description, and size of the close trigger.
     */
    size: onSlots({
      /**
       * Close trigger: a square two sizes smaller on the control scale, with a mark one size
       * smaller on the icon scale, inset from the panel's corner by the panel's padding.
       */
      closeTrigger: sizeVariants((size) => ({
        "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
        boxSize: dense(`{sizes.control.${below(below(size))}}`),
        insetBlockStart: dense(`{spacing.inset.${size}}`),
        insetInlineEnd: dense(`{spacing.inset.${size}}`),
      })),
      content: sizeVariants((size) => ({
        [CLOSED]: `calc(${dense(`{sizes.control.${below(below(size))}}`)} + ${dense(`{spacing.gap.${size}}`)})`,
        padding: dense(`{spacing.inset.${size}}`),
      })),
      description: textSizes("body"),
      title: textSizes("heading"),
    }),

    /**
     * Surface of the panel: the popover surface inside a hairline edge, the panel surface with a
     * large shadow, or the glass layer style.
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
