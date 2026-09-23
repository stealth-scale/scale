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
 *   The panel is never narrower than the control that opened it. The machine measures that control
 *   already and writes the width as a custom property, and a panel narrower than its trigger reads
 *   as belonging to something else on the page. It is a minimum, so a panel whose contents need
 *   more room still takes it.
 *   A popover is louder than a tooltip. It holds a heading, a paragraph and often a control, so it
 *   reads at body text and takes the room a panel needs.
 *   The control takes the cursor, the focus ring and the disabled look every control in the library
 *   takes, and no fill, no edge and no room of its own. Drawn with none of them it fell back to the
 *   browser's own ring, a hairline in the browser's ink rather than the three the theme draws in
 *   the palette's focus colour, and to the arrow cursor. What it looks like past that is the
 *   caller's: a caller who wants a button draws one through `as`, and the library's own button is
 *   then what a theme moves.
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
 * The property holding the room the panel's heading leaves for the control that closes it.
 *
 * @remarks
 *   The control is out of the flow, so a heading long enough to reach the corner ran under it. The
 *   room is written as a property by the size axis and read by the heading, rather than restated at
 *   both ends, so the two cannot fall out of step.
 */
const CLOSED = "--popover-closed";

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
     * How much room the panel takes, and how loud its heading is.
     */
    size: onSlots({
      /**
       * The control that closes the panel: a square on the control scale two steps under the
       * panel's own, holding a mark one step under it, inset from the panel's corner by the room
       * the panel keeps round everything else.
       *
       * @remarks
       *   The slot stated no size at all. The control was whatever mark a caller put in it, pinned
       *   to the corner of the content box: a bare glyph of some ten pixels overlapping the panel's
       *   own inset, with no square round it to press and nothing centred against anything.
       *   The panel keeps room for it at its inline end as well, so a heading long enough to reach
       *   the corner stops before the control rather than running under it.
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
