/**
 * Recipe for the menu: a trigger, a panel of rows and groups, and submenus opened from a row.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the positioner are siblings and a slot recipe passes its variants from an element
 *   above both. A submenu's root is a child of the parent menu's panel. The machine writes the
 *   positioner's position inline and `--available-height`, which caps the panel, so a menu near the
 *   window's edge scrolls. The panel is at least `sizes.44` wide and grows to its widest row. The
 *   panel takes the `dropdown` z-index plus its depth in the nest, because the machine writes
 *   `z-index: var(--z-index)` inline on the positioner from the panel's value. The panel has no
 *   focus ring, because the machine focuses it on opening and the highlight marks the row. A row
 *   reads the body role one size smaller and truncates. `inset` leaves a mark's gutter on every
 *   row. The panel sets the palette, and the rows and the highlight inherit it. A critical row
 *   reads `error`. The recipe has no `effect` axis, because the highlight moves with the pointer
 *   and the arrow keys, and a glow would move with it.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  highlightVariants,
  interactive,
  motion,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  row,
  type Scale,
  sizeVariants,
  type SystemStyleObject,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the menu offers.
 */
const SIZES: readonly Scale[] = ["sm", "md", "lg"];

/**
 * Custom property a panel sets to its depth in the nest, which the panel adds to its z-index.
 *
 * @remarks
 *   When a caller portals a menu and its submenu to the document, neither is an ancestor of the
 *   other. Without the depth, mount order decides the stacking, and a submenu renders under its
 *   parent.
 */
export const MENU_DEPTH = "--menu-depth";

/**
 * Attribute a panel sets when it opened from a row of another menu.
 *
 * @remarks
 *   A selector cannot compare a custom property's number, so the attribute marks a nested panel.
 */
export const NESTED = "data-nested";

/**
 * Custom property the size axis sets to the gutter a row's mark takes, which `inset` reads.
 */
const GUTTER = "--menu-gutter";

/**
 * Custom property each look sets to the panel's fill, which the arrow reads.
 */
const SURFACE = "var(--menu-surface)";

/**
 * Returns the gutter a mark takes at a size: the row's inline padding, the icon and the gap.
 */
function gutter(size: Scale): string {
  return `calc({spacing.inset.${below(size)}} + {sizes.icon.${below(size)}} + {spacing.gap.${size}})`;
}

/**
 * Returns the margin that moves a submenu off its parent's panel, on the side it opened towards.
 *
 * @remarks
 *   The machine places a submenu against the row that opened it, and the row stops one padding
 *   short of the panel's edge, so the submenu overlapped its parent by that padding. The machine
 *   reports the side as left or right, and the margin is logical, so each side sets both inline
 *   margins and swaps them under `_rtl`.
 * @param room - The panel's padding at the size.
 */
function cleared(room: string): SystemStyleObject {
  return {
    [`&[${NESTED}][data-placement^=left]`]: {
      _rtl: { marginInlineEnd: "0", marginInlineStart: room },
      marginInlineEnd: room,
      marginInlineStart: "0",
    },
    [`&[${NESTED}][data-placement^=right]`]: {
      _rtl: { marginInlineEnd: room, marginInlineStart: "0" },
      marginInlineEnd: "0",
      marginInlineStart: room,
    },
  };
}

/**
 * Returns a row's styles at a size: its padding, the gap after a mark, the gutter and the body role
 * one size smaller.
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
 * Defines the menu recipe: the surface look at size `md` in the neutral palette, with the tint
 * highlight, by default.
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
      minInlineSize: "44",
      outline: "0",
      overflowY: "auto",
      overscrollBehavior: "contain",
      zIndex: `calc({zIndex.dropdown} + var(${MENU_DEPTH}, 0))`,
    },
    contextTrigger: { cursor: "menuitem" },
    indicator: {
      "& > svg": { boxSize: "100%" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
    },
    item: {
      ...row(),
      "&[data-tone=critical]": { color: "colorPalette.fg", colorPalette: "error" },
      borderRadius: "l1",
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
    triggerItem: { ...row(), borderRadius: "l1" },
  },
  className: "menu",
  defaultVariants: { highlight: "tint", palette: "neutral", size: "md", variant: "surface" },
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
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Look of the highlighted row.
     */
    highlight: onSlots({
      item: highlightVariants(),
      triggerItem: highlightVariants(),
    }),

    /**
     * Whether every row leaves the gutter a mark takes, for a menu whose rows lead with an icon.
     */
    inset: {
      true: {
        item: { paddingInlineStart: `var(${GUTTER})` },
        triggerItem: { paddingInlineStart: `var(${GUTTER})` },
      },
    },

    /**
     * Palette of the rows and the highlight, set on the panel, which a portalled panel keeps.
     */
    palette: onSlot("content", paletteVariants()),

    /**
     * Size of the panel's padding, the rows, the marks and the keys.
     */
    size: onSlots({
      /**
       * The panel's padding, and the margin that moves a submenu off its parent's panel.
       */
      content: sizeVariants(
        (size) => ({
          ...cleared(dense(`{spacing.gap.${below(size)}}`)),
          padding: dense(`{spacing.gap.${below(size)}}`),
          scrollPadding: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      /**
       * The indicator at the icon size one size smaller, the same square as a checked row's mark.
       */
      indicator: sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }), SIZES),
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
     * Surface of the panel: the popover surface inside a hairline edge, the panel surface with a
     * large shadow, or the glass layer style.
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
