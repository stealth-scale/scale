/**
 * States what a menu is: a list of things a reader chooses from, opened from a control and closed
 * by choosing.
 *
 * @remarks
 *   The machine names no root, because a menu is a control and a panel that floats beside it rather
 *   than a thing that frames the two. This recipe adds one anyway, drawn with `display: contents`
 *   so it takes part in no layout, because the control and the panel are siblings and a slot recipe
 *   hands its variants down from an element above them both. The same root carries a submenu, whose
 *   control sits among the rows of the menu above it.
 *   The panel is placed by the machine, which writes its position as inline styles beside four
 *   custom properties the positioner is measured into. The panel reads one of them for its height,
 *   so a menu opened near the edge of a window scrolls inside itself rather than running off the
 *   page. It states no width: the machine sets `max-content`, so the panel is as wide as its widest
 *   row, and a caller wanting the control's width asks the machine for it.
 *   The panel enters from the side it was placed on rather than always from the top, which is what
 *   the `slide-fade` motion reads off the placement the machine writes. It carries no focus ring:
 *   the machine moves focus onto it as it opens, and a ring drawn for that reads as the panel being
 *   selected rather than as the row the highlight marks, which is where the reader's attention is.
 *   A row that carries a mark leaves room for one in a gutter the size axis measures, and every row
 *   of a menu that offers marks leaves the same gutter, so a list of options does not step sideways
 *   as the marks appear.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  highlightVariants,
  interactive,
  motion,
  onSlots,
  row,
  type Scale,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Lists the three steps a menu is offered at, which is what a list of rows needs and no more.
 */
const SIZES: readonly Scale[] = ["sm", "md", "lg"];

/**
 * Fixes the property the gutter for a row's mark is measured into, which the size axis writes and
 * the inset axis and every marked row read.
 */
const GUTTER = "--menu-gutter";

/**
 * Fixes the property the panel's fill is stated in, which the arrow reads so it is drawn in the
 * same fill as the panel it points away from.
 */
const SURFACE = "var(--menu-surface)";

/**
 * Measures the gutter one step leaves for a mark: the room at the panel's edge, the mark itself,
 * and the gap between the mark and the words beside it.
 */
function gutter(size: Scale): string {
  return `calc({spacing.inset.${size}} + {sizes.icon.${size}} + {spacing.gap.${size}})`;
}

/**
 * Draws a surfaced menu at the middle size, tinting the row the reader is on, until a caller says
 * otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    arrow: { "--arrow-background": SURFACE, "--arrow-size": "sizes.icon.sm" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    content: {
      ...motion("slide-fade.in", "slide-fade.out"),
      display: "flex",
      flexDirection: "column",
      maxBlockSize: "var(--available-height)",
      outline: "0",
      overflowY: "auto",
      overscrollBehavior: "contain",
      zIndex: "dropdown",
    },
    contextTrigger: { cursor: "menuitem" },
    indicator: {
      _motionReduce: { transitionDuration: "0s" },
      _open: { rotate: "180deg" },
      transitionDuration: "press",
    },
    item: {
      ...row(),
      "&[data-tone=critical]": { color: "colorPalette.fg", colorPalette: "error" },
      [`&[data-type]`]: { paddingInlineStart: `var(${GUTTER})` },
      colorPalette: "neutral",
    },
    itemGroup: { display: "flex", flexDirection: "column" },
    itemGroupLabel: { color: "fg.muted", fontWeight: "semibold" },
    itemIndicator: {
      alignItems: "center",
      display: "inline-flex",
      insetBlockStart: "50%",
      justifyContent: "center",
      position: "absolute",
      translate: "0 -50%",
    },
    itemText: { ...truncate(), flex: "1" },
    positioner: { position: "relative" },
    root: { display: "contents" },
    separator: { ...divider(), borderColor: "border.muted" },
    trigger: { ...interactive() },
    triggerItem: { ...row(), colorPalette: "neutral" },
  },
  className: "menu",
  defaultVariants: { highlight: "tint", size: "md", variant: "surface" },
  jsx: [/^Menu(\.\w+)?$/u],
  slots: [
    "root",
    "trigger",
    "contextTrigger",
    "triggerItem",
    "indicator",
    "positioner",
    "content",
    "itemGroup",
    "itemGroupLabel",
    "item",
    "itemText",
    "itemIndicator",
    "separator",
    "arrow",
    "arrowTip",
  ],
  variants: {
    /**
     * How the row the reader is on is marked.
     */
    highlight: onSlots({
      item: highlightVariants(),
      triggerItem: highlightVariants(),
    }),

    /**
     * Whether every row leaves the gutter a mark sits in, for a menu whose rows lead with an icon.
     */
    inset: {
      true: {
        item: { paddingInlineStart: `var(${GUTTER})` },
        triggerItem: { paddingInlineStart: `var(${GUTTER})` },
      },
    },

    /**
     * How much room a row takes, and how loud its words are.
     */
    size: onSlots({
      content: sizeVariants(
        (size) => ({
          padding: dense(`{spacing.gap.${below(size)}}`),
          scrollPadding: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      item: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          [GUTTER]: gutter(below(size)),
          minBlockSize: dense(`{sizes.control.${below(size)}}`),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      itemGroupLabel: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${below(below(size))}`,
        }),
        SIZES,
      ),
      itemIndicator: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.icon.${below(size)}}`),
          insetInlineStart: dense(`{spacing.inset.${below(size)}}`),
        }),
        SIZES,
      ),
      separator: sizeVariants(
        (size) => ({ marginBlock: dense(`{spacing.gap.${below(size)}}`) }),
        SIZES,
      ),
      triggerItem: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          [GUTTER]: gutter(below(size)),
          minBlockSize: dense(`{sizes.control.${below(size)}}`),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
    }),

    /**
     * How the panel is set off from the page behind it.
     */
    variant: {
      elevated: {
        arrowTip: { borderColor: SURFACE },
        content: {
          "--menu-surface": "colors.bg.panel",
          background: SURFACE,
          borderRadius: "l3",
          boxShadow: "xl",
        },
      },
      glass: {
        arrowTip: { borderColor: "border" },
        content: { "--menu-surface": "colors.bg.popover", borderRadius: "l3", layerStyle: "glass" },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--menu-surface": "colors.bg.popover",
          background: SURFACE,
          borderColor: "border",
          borderRadius: "l3",
          borderWidth: "hairline",
          boxShadow: "lg",
        },
      },
    },
  },
});
