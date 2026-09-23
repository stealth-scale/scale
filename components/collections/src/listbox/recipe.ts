/**
 * Defines the styles a listbox is drawn with.
 *
 * @remarks
 *   Twelve parts. The root frames the set, the label names it, the frame is the box it is drawn
 *   in, the input narrows it, and the content is the list itself. An item holds its words, a line
 *   of explanation under them, and the mark saying it is chosen, and a group gathers items under a
 *   heading.
 *   A row is drawn from the theme's `row` fragment. Focus stays on the list and a highlight moves
 *   over the rows, which is why a row carries no ring and no press of its own, and why the
 *   `highlight` axis reads the same three marks a menu reads. The row repaints under a pointer
 *   even so, because a pointer that reaches a row it can pick has to be answered.
 *   A row's words are set a step quieter than the size names, which is the rule a menu's rows
 *   follow: a list of rows beside a page set in the step's own type reads as a heavier page rather
 *   than as a list. They were set in the label scale, so every row of every list carried the
 *   medium weight a label is set in and a large list read as a column of headings.
 *   A group spaces its rows the way the list spaces ungrouped ones. The group's own gap stood a
 *   step of the scale between every pair of rows, so grouping a list pushed its rows three times
 *   further apart than leaving them loose. The room above a group's heading is the heading's own
 *   padding, which is where it belongs.
 *   A row wraps, and the line of explanation takes a whole line of it. The words and the mark stay
 *   on the first line, so a column of marks reads straight down however tall each row becomes, and
 *   a row's height is a floor rather than a fixed measure.
 *   The content scrolls rather than the frame around it, so the field and the select-all row above
 *   it stay put while the rows move under them.
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
  row,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

import { aligned, banded, firstLine, PAD, rowHeight, tiled } from "#listbox/metrics.ts";

export { ROW_HEIGHT } from "#listbox/metrics.ts";

/**
 * Draws a plain listbox at the middle size, tinting the row the highlight is on.
 *
 * @remarks
 *   The placeholder is drawn in the tertiary ink rather than the text ink. It names what the field
 *   narrows rather than saying anything, and at the text ink it read as a row that had been typed
 *   in already.
 *   The control is the band the field sits in, and it carries the rule, the room and the focus.
 *   The field itself writes no box at all. A boxed field there drew a second border inside the
 *   list's and the ring a field carries drew a third on focus, so the band takes the flushed
 *   treatment instead: one rule underneath, which changes colour while anything inside the band has
 *   focus. The control that empties the field sits at the band's end rather than over the field,
 *   because the field is a flex child of the band and shortening it is what keeps the typing out
 *   from under the control.
 *   Every band ends where a row ends, so the control that empties the field stands in the column
 *   the rows' own marks stand in. Ending the band closer to the edge put the control ten pixels
 *   outside that column, which reads as a control belonging to the box rather than to the list.
 *   The label above the list, the summary below it and the group labels within it all keep the
 *   inset a row keeps, so every word on the list starts on one line, and a list raised on a surface
 *   keeps a small gap between its frame and its rows, the way a menu's panel does.
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
      alignItems: "start",
      justifyContent: "space-between",
    },
    itemCheckbox: {
      "[data-selected] > &, [data-state=checked] > &, [data-state=indeterminate] > &": {
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
  variants: {
    /**
     * How the row the list has moved its highlight onto is marked.
     */
    highlight: onSlot("item", highlightVariants()),

    /**
     * Which way the rows run.
     *
     * @remarks
     *   The machine decides which arrows move the highlight and says so on the list, and the
     *   recipe draws the rows the way they move. The two are one axis, because a list a reader
     *   moves through sideways and reads downwards is a list that answers the wrong key.
     *   A row across takes its own width rather than the whole line, and the row's words stop
     *   truncating, because a row that is as wide as its words has nothing to cut.
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
     * How many columns the rows are laid out in, for a list drawn as tiles.
     *
     * @remarks
     *   The count belongs to the collection as well, because the machine has to know where a
     *   tile's neighbours are before the arrows can reach one. A grid drawn in four columns and
     *   told it has three answers the arrows wrongly, so a caller states the same count in both
     *   places or in neither.
     */
    columns: onSlot("content", tiled()),

    radius: onSlot("item", cornerVariants(["l1", "l2", "l3"])),

    /**
     * How a row a person has picked is marked, beside the mark at its end.
     *
     * @remarks
     *   A picked row and the row the arrows are on are two different things, so each has its own
     *   axis and a row can carry both. The fills are the flat looks rather than the interactive
     *   ones, because a picked row is a statement and not a control: an interactive fill would
     *   repaint under a pointer and fight the row's own hover. Each look restates that hover, since
     *   the compiler layers a variant over the base and a look written without one would take the
     *   hover away from every picked row.
     *   Plain leans on the mark at the row's end alone. It is the one to check a long list against,
     *   because a picked row that is otherwise drawn like the rest is a row nobody finds again.
     *   None draws nothing at all, for a list whose rows each carry a box. The box already says
     *   which rows are in the set, and a fill behind it says the same thing a second time.
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
          ...banded(dense(`{spacing.gap.${size}}`), dense(`{spacing.inset.${size}}`)),
          columnGap: dense(`{spacing.gap.${below(size)}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.gap.${size}}`),
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
          paddingInlineEnd: dense(`{spacing.inset.${size}}`),
          paddingInlineStart: dense(`{spacing.gap.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemCheckbox: sizeVariants(
        (size) => firstLine(dense(`{sizes.icon.${below(size)}}`)),
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
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `label.${below(below(size))}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemIndicator: sizeVariants(
        (size) => firstLine(dense(`{sizes.icon.${below(size)}}`)),
        ["sm", "md", "lg"],
      ),
      label: sizeVariants(
        (size) => ({ ...aligned(dense(`{spacing.gap.${size}}`)), textStyle: `label.${size}` }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
      selectAll: sizeVariants(
        (size) => ({
          ...banded(dense(`{spacing.gap.${size}}`), dense(`{spacing.inset.${size}}`)),
          columnGap: dense(`{spacing.gap.${size}}`),
          minBlockSize: "6",
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      valueText: sizeVariants(
        (size) => ({
          ...aligned(dense(`{spacing.gap.${size}}`)),
          textStyle: `label.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * Whether the list is raised on a surface of its own or drawn against what holds it.
     *
     * @remarks
     *   The surface is on the frame rather than on the list inside it, so the field that narrows
     *   the list and the row that turns all of it on stand inside the box with the rows. Only the
     *   label above and the summary below stand outside it. The frame hides its overflow, which is
     *   what cuts the rows back to its corner; the rows scroll inside the list, so the field and
     *   the row above them stay put while they move.
     */
    variant: {
      surface: { frame: surface() },

      plain: { frame: { background: "transparent" } },
    },
  },
});
