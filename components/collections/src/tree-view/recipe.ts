/**
 * Recipe for the tree view: a label, the tree, and its rows. A branch row opens the rows nested in
 * it, and an item row ends a path.
 *
 * @remarks
 *   A row reads the theme's `row` fragment and shows its focus ring inside its edge, because a row
 *   takes focus itself. The root writes the rows' inset, the gap between a row's parts and the side
 *   of its marks as custom properties per size. Every row indents one mark and one gap per level of
 *   the `--depth` the machine writes, so a child's indicator is under its parent's icon. An item
 *   reserves the column of a branch's indicator, so an item's text and a branch's text at one level
 *   start at one x. A guide is a border, so forced colors paint it in `CanvasText`. Under forced
 *   colors a selected row fills with `Highlight`, and its marks and checkbox read the row's
 *   `HighlightText`. `staticCss` lists every palette, and the `plain` look and the `sm` and `md`
 *   sizes, which the content package's JSON tree view sets at run time.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  row,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Inline padding at each end of a row, which the root sets per size.
 */
const INSET = "var(--tree-view-inset)";

/**
 * Gap between the parts of a row, which the root sets per size.
 */
const GAP = "var(--tree-view-gap)";

/**
 * Side of a row's indicator, icons and checkbox, which the root sets per size.
 */
const MARK = "var(--tree-view-mark)";

/**
 * Indent of one level: one mark and one gap.
 */
const LEVEL = `(${MARK} + ${GAP})`;

/**
 * Height of a row per size, on the scale of the navigation list's rows.
 */
const ROWS = { lg: "control.md", md: "control.xs", sm: "tag.md" };

/**
 * Styles a focusable row: the theme's row with a focus ring inside its edge.
 */
const ROW = {
  ...row(),
  _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
  _hover: { background: "bg.muted" },
  "& > svg": { boxSize: MARK, flexShrink: "0" },
  columnGap: GAP,
  focusRingColor: "colorPalette.focusRing",
  focusVisibleRing: "inside",
  paddingInlineEnd: INSET,
};

/**
 * Styles a row's text: one truncated line that takes the room left, hidden while the row is
 * renamed.
 */
const TEXT = {
  ...truncate(),
  "[data-renaming] > &": { display: "none" },
  flex: "1",
  minInlineSize: "0",
};

/**
 * Styles a mark at a row's side: a square of the mark's side around the caller's glyph.
 */
const SQUARE = {
  "& > svg": { boxSize: "full" },
  alignItems: "center",
  boxSize: MARK,
  display: "inline-flex",
  flexShrink: "0",
  justifyContent: "center",
};

/**
 * Fills a selected row with `Highlight` under forced colors.
 */
const FORCED = {
  _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
};

/**
 * Restates the forced colors on a selected row under a pointer.
 *
 * @remarks
 *   A look's hover fill on a selected row is as specific as the forced colors under a pointer, and
 *   the compiler emits the `(hover: hover)` block after the `(forced-colors: active)` block, so the
 *   fill applies over the forced colors. The restatement repeats the selected state's selector,
 *   which makes it more specific than the fill.
 */
const FORCED_HOVER = { _selected: FORCED };

/**
 * Fill of a selected row per look.
 */
const SELECTED = {
  plain: { _selected: { ...FORCED, fontWeight: "medium" } },
  solid: {
    _selected: {
      ...FORCED,
      _hover: { ...FORCED_HOVER, background: "colorPalette.solid.hover" },
      layerStyle: "flat.solid",
    },
  },
  subtle: {
    _selected: {
      ...FORCED,
      _hover: { ...FORCED_HOVER, background: "colorPalette.muted" },
      fontWeight: "medium",
      layerStyle: "flat.subtle",
    },
  },
};

/**
 * Glow around a selected row.
 */
const GLOW = { glow: { _selected: { layerStyle: "glow.sm" } } };

/**
 * Sets a row's height from the size.
 */
const ROW_SIZES = sizeVariants((size) => ({ minBlockSize: dense(`{sizes.${ROWS[size]}}`) }), SIZES);

/**
 * Defines the tree view recipe: rows at size `md` that fill a selected row with the palette's
 * subtle fill, by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    branch: { minInlineSize: "0" },
    branchContent: { display: "flex", flexDirection: "column", position: "relative" },
    branchControl: {
      ...ROW,
      paddingInlineStart: `calc(${INSET} + (var(--depth) - 1) * ${LEVEL})`,
    },
    branchIndentGuide: {
      borderColor: "border",
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: "hairline",
      insetBlock: "0",
      insetInlineStart: `calc(${INSET} + (var(--depth) - 1) * ${LEVEL} + ${MARK} / 2 - {borderWidths.hairline} / 2)`,
      pointerEvents: "none",
      position: "absolute",
      zIndex: "1",
    },
    branchIndicator: {
      ...SQUARE,
      _highContrast: { color: "inherit" },
      _motionReduce: { transitionDuration: "0s" },
      _open: { rotate: "90deg" },
      _rtl: { _open: { rotate: "90deg" }, rotate: "180deg" },
      color: "fg.muted",
      transitionDuration: "press",
      transitionProperty: "rotate",
      transitionTimingFunction: "press",
    },
    branchText: TEXT,
    branchTrigger: { cursor: "button", display: "inline-flex", flexShrink: "0" },
    item: { ...ROW, paddingInlineStart: `calc(${INSET} + var(--depth) * ${LEVEL})` },
    itemIndicator: {
      ...SQUARE,
      _highContrast: { color: "inherit" },
      color: "colorPalette.fg",
      marginInlineStart: "auto",
    },
    itemText: TEXT,
    label: { color: "fg", fontWeight: "medium", paddingInline: INSET },
    nodeCheckbox: {
      ...SQUARE,
      _highContrast: { borderColor: "CanvasText", forcedColorAdjust: "none" },
      "[aria-selected=true] > &": {
        _highContrast: { borderColor: "HighlightText" },
        "&[data-state=checked], &[data-state=indeterminate]": {
          _highContrast: {
            background: "HighlightText",
            borderColor: "HighlightText",
            color: "Highlight",
          },
        },
      },
      "&[data-state=checked], &[data-state=indeterminate]": {
        _highContrast: { background: "CanvasText", borderColor: "CanvasText", color: "Canvas" },
        background: "colorPalette.solid",
        borderColor: "colorPalette.solid",
        color: "colorPalette.contrast",
      },
      borderColor: "border.emphasized",
      borderRadius: "l1",
      borderStyle: "solid",
      borderWidth: "control",
      color: "transparent",
      cursor: "button",
    },
    nodeRenameInput: {
      background: "bg.panel",
      borderColor: "border.emphasized",
      borderRadius: "l1",
      borderStyle: "solid",
      borderWidth: "hairline",
      color: "fg",
      flex: "1",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      font: "inherit",
      minInlineSize: "0",
      paddingInline: GAP,
    },
    root: { display: "flex", flexDirection: "column", inlineSize: "full", minInlineSize: "0" },
    tree: { display: "flex", flexDirection: "column", minInlineSize: "0" },
  },
  className: "tree-view",
  defaultVariants: { selected: "subtle", size: "md" },
  jsx: [/^TreeView(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "tree",
    "branch",
    "branchControl",
    "branchTrigger",
    "branchIndicator",
    "branchText",
    "branchContent",
    "branchIndentGuide",
    "item",
    "itemIndicator",
    "itemText",
    "nodeCheckbox",
    "nodeRenameInput",
  ],
  staticCss: [{ palette: [...PALETTES] }, { selected: ["plain"] }, { size: ["sm", "md"] }],
  variants: {
    /**
     * Glow around a selected row, in the palette's solid at half opacity.
     */
    effect: onSlots({ branchControl: GLOW, item: GLOW }),

    /**
     * Palette the selected fill, the checkboxes and the focus ring read.
     *
     * @remarks
     *   The palette is set on the root, and every part inherits the palette's custom properties.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Fill of a selected row.
     *
     * @remarks
     *   The fills are the flat looks, and each look restates its hover, because a variant applies
     *   over the base hover. The subtle fill measures 1.2:1 against a card in both color modes, so
     *   `subtle` also sets the text in medium weight, as `plain` does alone. Under forced colors a
     *   selected row fills with `Highlight` in every look.
     */
    selected: onSlots({ branchControl: SELECTED, item: SELECTED }),

    /**
     * Sets rows of 24, 32 and 40px at `sm`, `md` and `lg`. The text reads the body role and the
     * marks the icon scale one size smaller than the tree, and the inset two sizes smaller.
     */
    size: onSlots({
      branchControl: ROW_SIZES,
      item: ROW_SIZES,
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants(
        (size) => ({
          "--tree-view-gap": dense(`{spacing.gap.${below(size)}}`),
          "--tree-view-inset": dense(`{spacing.inset.${below(below(size))}}`),
          "--tree-view-mark": dense(`{sizes.icon.${below(size)}}`),
          gap: dense(`{spacing.gap.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        SIZES,
      ),
    }),
  },
});
