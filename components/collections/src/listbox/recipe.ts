/**
 * Recipe for the listbox: a label, a frame with an optional field and select-all row, the list of
 * rows, and a summary.
 *
 * @remarks
 *   A row reads the theme's `row` fragment. Focus rests on the list and the highlight moves over
 *   the rows, so a row has no focus ring and no pressed state of its own, and the `highlight` axis
 *   reads the three marks a menu reads. A row still fills under a pointer. A row's text reads the
 *   body role one size smaller than the list, the rule a menu's rows follow. A group spaces its
 *   rows with the list's own gap, and the room above a group's label is the label's padding. A row
 *   centres its parts vertically, so the checkbox, the icon and the end mark are at the middle of a
 *   row with a description. The content scrolls and the frame does not, so the field and the
 *   select-all row stay in place while the rows move.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  highlightVariants,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  row,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

import { aligned, banded, PAD, rowHeight, tiled } from "#listbox/metrics.ts";

export { ROW_HEIGHT } from "#listbox/metrics.ts";

/**
 * Defines the listbox recipe: a plain list at size `md` that tints the highlighted row and fills a
 * selected row with the palette's subtle fill.
 *
 * @remarks
 *   The placeholder reads the tertiary ink. The control is the band the field renders in: it
 *   carries the block-end rule, the insets and the focus color, and the field renders no box of
 *   its own. The clear control renders at the band's end, in the column of the rows' marks. The
 *   label, the summary and the group labels take a row's inset, so every text starts on one line.
 *   A checkbox hides its mark with `color: transparent`, and Firefox paints a forced border in
 *   that color, so the checkbox opts out of forced colors: its edge is `CanvasText`, and a checked
 *   box fills with `CanvasText` around a `Canvas` mark.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
    },
    content: {
      "&:empty": { display: "none" },
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
      overflowY: "auto",
      padding: PAD,
    },
    control: {
      _focusWithin: { borderBlockEndColor: "colorPalette.solid" },
      alignItems: "center",
      borderBlockEndColor: "border",
      borderBlockEndWidth: "hairline",
      borderStyle: "solid",
      borderWidth: "0",
      display: "flex",
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    },
    empty: { color: "fg.muted", padding: PAD, textAlign: "start" },
    frame: {
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
      minInlineSize: "0",
      overflow: "hidden",
    },
    input: {
      _disabled: { layerStyle: "disabled" },
      _placeholder: { color: "fg.subtle" },
      appearance: "none",
      background: "transparent",
      border: "none",
      borderRadius: "0",
      color: "fg",
      flex: "1",
      minInlineSize: "0",
      outline: "none",
      padding: "0",
    },
    item: {
      ...row(),
      _hover: { background: "bg.muted" },
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemCheckbox: {
      _highContrast: { borderColor: "CanvasText", forcedColorAdjust: "none" },
      "[data-selected] > &, [data-state=checked] > &, [data-state=indeterminate] > &": {
        _highContrast: { background: "CanvasText", borderColor: "CanvasText", color: "Canvas" },
        background: "colorPalette.solid",
        borderColor: "colorPalette.solid",
        color: "colorPalette.contrast",
      },
      alignItems: "center",
      borderColor: "border.emphasized",
      borderRadius: "l1",
      borderStyle: "solid",
      borderWidth: "control",
      color: "transparent",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      lineHeight: "tight",
    },
    itemDescription: { ...truncate(), color: "fg.subtle", display: "block", textAlign: "start" },
    itemGroup: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    itemGroupLabel: { color: "fg.subtle", fontWeight: "medium" },
    itemIndicator: {
      "&[data-state=checked]": { visibility: "visible" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      lineHeight: "tight",
      visibility: "hidden",
    },
    itemLines: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      lineHeight: "tight",
      minInlineSize: "0",
    },
    itemText: { ...truncate(), display: "block", minInlineSize: "0", textAlign: "start" },
    label: { color: "fg", fontWeight: "semibold" },
    root: { display: "flex", flexDirection: "column", minBlockSize: "0", minInlineSize: "0" },
    selectAll: {
      ...row(),
      _hover: { background: "bg.muted" },
      borderBlockEndColor: "border",
      borderBlockEndWidth: "hairline",
      borderRadius: "0",
      cursor: "menuitem",
    },
    valueText: { ...truncate(), color: "fg.muted" },
  },
  className: "listbox",
  compoundVariants: [
    {
      css: { content: { overflowX: "auto" } },
      name: "scrolled",
      orientation: "horizontal",
      variant: "surface",
    },
  ],
  defaultVariants: {
    highlight: "tint",
    orientation: "vertical",
    radius: "l1",
    selected: "subtle",
    size: "md",
    variant: "plain",
  },
  jsx: [/^Listbox(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "input",
    "clearTrigger",
    "frame",
    "content",
    "empty",
    "selectAll",
    "item",
    "itemLines",
    "itemText",
    "itemDescription",
    "itemCheckbox",
    "itemIndicator",
    "itemGroup",
    "itemGroupLabel",
    "valueText",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Number of columns of a tiled list.
     *
     * @remarks
     *   The grid collection takes the same count, because the machine moves the highlight between
     *   neighbours by the collection's count and the recipe places them by this one.
     */
    columns: onSlot("content", tiled()),

    /**
     * Glow around a selected row, in the palette's solid at half opacity.
     */
    effect: onSlot("item", { glow: { _selected: { layerStyle: "glow.sm" } } }),

    /**
     * Mark on the row the highlight is on.
     */
    highlight: onSlot("item", highlightVariants()),

    /**
     * Direction the rows run in, and the arrow keys that move the highlight.
     *
     * @remarks
     *   The machine and the recipe read one prop, so the arrows always follow the layout. A row in
     *   a horizontal list takes its own width, and its text does not truncate.
     */
    orientation: {
      horizontal: {
        content: { flexDirection: "row", overflowX: "auto" },
        item: { inlineSize: "auto" },
        itemText: { flex: "0 0 auto" },
      },
      vertical: { content: { flexDirection: "column" } },
    },

    /**
     * Palette the highlight, the selected fill and the checkboxes read.
     *
     * @remarks
     *   The palette is set on the root, and every part inherits the palette's custom properties.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Corner radius of a row.
     */
    radius: onSlot("item", cornerVariants(["l1", "l2", "l3"])),

    /**
     * Fill of a selected row, beside the mark at its end.
     *
     * @remarks
     *   The selected state and the highlight are separate axes, and a row can show both. The fills
     *   are the flat looks, which do not change under a pointer, and each look restates its hover,
     *   because a variant applies over the base hover. `plain` sets the text in medium weight and
     *   relies on the mark. `none` sets nothing, for a list whose rows each have a checkbox.
     */
    selected: onSlot("item", {
      none: { _selected: { fontWeight: "inherit" } },
      plain: { _selected: { fontWeight: "medium" } },
      solid: {
        _selected: { _hover: { background: "colorPalette.solid.hover" }, layerStyle: "flat.solid" },
      },
      subtle: {
        _selected: { _hover: { background: "colorPalette.muted" }, layerStyle: "flat.subtle" },
      },
    }),

    /**
     * Row height, insets, text sizes and mark sizes. A row's text and a mark read one size smaller
     * than the list, and a description two sizes smaller.
     *
     * @remarks
     *   A row takes the inset scale at both ends. The label, the field, the select-all row, the
     *   group labels, the empty text and the summary take the same start inset, so every text
     *   starts on one line.
     */
    size: onSlots({
      clearTrigger: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      content: sizeVariants(
        (size) => ({ ...rowHeight(size), gap: dense(`{spacing.gap.${below(below(size))}}`) }),
        ["sm", "md", "lg"],
      ),
      control: sizeVariants(
        (size) => ({
          ...banded(dense(`{spacing.inset.${size}}`), dense(`{spacing.inset.${size}}`)),
          columnGap: dense(`{spacing.gap.${below(size)}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({
          ...banded(dense(`{spacing.inset.${size}}`), dense(`{spacing.inset.${size}}`)),
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      input: sizeVariants((size) => ({ textStyle: `label.${size}` }), ["sm", "md", "lg"]),
      item: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${size}}`),
          minBlockSize: "6",
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemCheckbox: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      itemDescription: sizeVariants(
        (size) => ({ textStyle: `body.${below(below(size))}` }),
        ["sm", "md", "lg"],
      ),
      itemGroup: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(below(size))}}`) }),
        ["sm", "md", "lg"],
      ),
      itemGroupLabel: sizeVariants(
        (size) => ({
          paddingBlockStart: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${below(below(size))}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemIndicator: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      label: sizeVariants(
        (size) => ({ ...aligned(dense(`{spacing.inset.${size}}`)), textStyle: `label.${size}` }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
      selectAll: sizeVariants(
        (size) => ({
          ...banded(dense(`{spacing.inset.${size}}`), dense(`{spacing.inset.${size}}`)),
          columnGap: dense(`{spacing.gap.${size}}`),
          minBlockSize: "6",
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      valueText: sizeVariants(
        (size) => ({
          ...aligned(dense(`{spacing.inset.${size}}`)),
          textStyle: `label.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * Background, edge and corners of the frame. `surface` raises the frame and `plain` leaves it
     * transparent.
     *
     * @remarks
     *   The frame contains the field, the select-all row and the rows, and clips its overflow to
     *   its corners. The label and the summary render outside it, and the rows scroll inside the
     *   content.
     */
    variant: {
      surface: { frame: surface() },

      plain: { frame: { background: "transparent" } },
    },
  },
});
