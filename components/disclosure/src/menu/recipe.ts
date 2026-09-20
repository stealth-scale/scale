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
 *   page. It is held to a width a short list still fills, and grows to its widest row from there,
 *   and a caller wanting the control's width asks the machine for it.
 *   The panel enters from the side it was placed on rather than always from the top, which is what
 *   the `slide-fade` motion reads off the placement the machine writes. It carries no focus ring:
 *   the machine moves focus onto it as it opens, and a ring drawn for that reads as the panel being
 *   selected rather than as the row the highlight marks, which is where the reader's attention is.
 *   A row is read a step under the type of the page it opens over, in the body's weight, with its
 *   words cut short rather than wrapped, so a list of rows is one column of even lines. A row may
 *   lead with a mark, a tinted square holding an initial, an icon or an avatar, sized as a tag so
 *   a list of them reads as a list; may stack its words over a line about them; and ends with the
 *   tick that says it is on, or the keys that run it, set quieter and smaller than the words. A
 *   menu whose rows lead with icons can leave the same gutter on every row, so a row without one
 *   starts its words where the others do. A group's label is set smaller and lighter than the rows
 *   under it, because it names them rather than joining them.
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
  type SystemStyleObject,
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
 * Measures the gutter one step leaves for a mark: the room at the row's edge, the mark itself,
 * and the gap between the mark and the words beside it.
 */
function gutter(size: Scale): string {
  return `calc({spacing.inset.${below(size)}} + {sizes.icon.${below(size)}} + {spacing.gap.${size}})`;
}

/**
 * Draws a row at one step: the room round its words, the gap between a mark and them, the gutter a
 * mark takes, and the words a step quieter than the step's own, which is what a list of rows reads
 * as beside a page in the step's type.
 */
function rowOf(size: Scale): SystemStyleObject {
  return {
    gap: dense(`{spacing.gap.${size}}`),
    [GUTTER]: gutter(size),
    paddingBlock: dense(`{spacing.gap.${below(size)}}`),
    paddingInline: dense(`{spacing.inset.${below(size)}}`),
    textStyle: `body.${below(size)}`,
  };
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
      minInlineSize: "var(--reference-width)",
      outline: "0",
      overflowY: "auto",
      overscrollBehavior: "contain",
      zIndex: "dropdown",
    },
    contextTrigger: { cursor: "menuitem" },
    indicator: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      marginInlineStart: "auto",
    },
    item: {
      ...row(),
      "&[data-tone=critical]": { color: "colorPalette.fg", colorPalette: "error" },
      borderRadius: "l1",
      colorPalette: "neutral",
    },
    itemCommand: {
      color: "fg.muted",
      flexShrink: "0",
      fontFamily: "inherit",
      letterSpacing: "wide",
      marginInlineStart: "auto",
    },
    itemDescription: { ...truncate(), color: "fg.subtle", display: "block", textStyle: "caption" },
    itemGroup: { display: "flex", flexDirection: "column" },
    itemGroupLabel: { color: "fg.subtle", fontWeight: "medium" },
    itemIndicator: {
      "&[data-state=checked]": { visibility: "visible" },
      alignItems: "center",
      boxSizing: "content-box",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
      order: "1",
      visibility: "hidden",
    },
    itemLines: { display: "flex", flex: "1", flexDirection: "column", minInlineSize: "0" },
    itemMark: {
      alignItems: "center",
      background: "bg.muted",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "semibold",
      justifyContent: "center",
      lineHeight: "tight",
      overflow: "clip",
    },
    itemText: { ...truncate(), flex: "1" },
    positioner: { position: "relative" },
    root: { display: "contents" },
    separator: { ...divider(), borderColor: "border.muted", inlineSize: "auto" },
    trigger: { ...interactive() },
    triggerItem: { ...row(), borderRadius: "l1", colorPalette: "neutral" },
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
    "itemMark",
    "itemLines",
    "itemText",
    "itemDescription",
    "itemIndicator",
    "itemCommand",
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
      item: sizeVariants((size) => rowOf(size), SIZES),
      itemCommand: sizeVariants(
        (size) => ({
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${below(below(size))}`,
        }),
        SIZES,
      ),
      itemGroupLabel: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `body.${below(below(size))}`,
        }),
        SIZES,
      ),
      itemIndicator: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.icon.${below(size)}}`),
          paddingInlineStart: dense(`{spacing.gap.${size}}`),
        }),
        SIZES,
      ),
      itemMark: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.tag.${size}}`), fontSize: below(below(size)) }),
        SIZES,
      ),
      separator: sizeVariants(
        (size) => ({
          marginBlock: dense(`{spacing.gap.${below(size)}}`),
          marginInline: `calc(-1 * ${dense(`{spacing.gap.${below(size)}}`)})`,
        }),
        SIZES,
      ),
      triggerItem: sizeVariants((size) => rowOf(size), SIZES),
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
          borderRadius: "l2",
          boxShadow: "lg",
        },
      },
      glass: {
        arrowTip: { borderColor: "border" },
        content: { "--menu-surface": "colors.bg.popover", borderRadius: "l2", layerStyle: "glass" },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--menu-surface": "colors.bg.popover",
          background: SURFACE,
          borderColor: "border",
          borderRadius: "l2",
          borderWidth: "hairline",
          boxShadow: "md",
        },
      },
    },
  },
});
