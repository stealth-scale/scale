/**
 * Defines the styles a listbox is drawn with.
 *
 * @remarks
 *   Eleven parts. The root frames the set, the label names it, the input narrows it, and the
 *   content is the list itself. An item holds its words, a line of explanation under them, and the
 *   mark saying it is chosen, and a group gathers items under a heading.
 *   A row is drawn from the theme's `row` fragment. Focus stays on the list and a highlight moves
 *   over the rows, which is why a row carries no ring and no press of its own, and why the
 *   `highlight` axis reads the same three marks a menu reads. The row repaints under a pointer
 *   even so, because a pointer that reaches a row it can pick has to be answered.
 *   A row wraps, and the line of explanation takes a whole line of it. The words and the mark stay
 *   on the first line, so a column of marks reads straight down however tall each row becomes, and
 *   a row's height is a floor rather than a fixed measure.
 *   The content scrolls rather than the root, so a label and a field above it stay put while the
 *   rows move under them.
 */

import {
  below,
  columnCounts,
  cornerVariants,
  type Count,
  COUNTS,
  defineSlotRecipe,
  dense,
  highlightVariants,
  interactive,
  onSlot,
  onSlots,
  row,
  type Scale,
  sizeVariants,
  surface,
  type SystemStyleObject,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Writes one entry per count of columns: the template the count draws, and the display a grid
 * needs beside it, because the list is a flex column until a caller asks for tiles.
 */
function tiled(): Record<Count, SystemStyleObject> {
  const columned = columnCounts();

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the entries are built from the counts, one per count
  return Object.fromEntries(
    COUNTS.map((count) => [count, { ...columned[count], display: "grid" }]),
  ) as Record<Count, SystemStyleObject>;
}

/**
 * The room the list leaves round its rows.
 *
 * @remarks
 *   Every look leaves it, not the raised one alone, so a row sits the same distance from the
 *   list's edge whatever the list is drawn on. A row is a shape a highlight is drawn round, and a
 *   shape flush with its container has nowhere to draw one.
 */
const PAD = "{spacing.gap.xs}";

/**
 * Writes the insets a band across the list takes: the room the list leaves, given back as a
 * negative margin, and added again as padding so the band's words land on the line the rows' words
 * are on.
 *
 * @remarks
 *   A field or a select-all row is a band rather than a row within the list, so the rule under it
 *   reaches both edges while its words still line up with the rows beneath. Take the room back
 *   without adding it to the padding and the band's words sit a step to the left of every row.
 *   The width goes back to automatic first. A band drawn from the row fragment is the full width
 *   of the list's content box, and a negative margin on a fixed width slides the box sideways
 *   rather than widening it, which left a gap at one end and an overhang at the other. The room
 *   above comes off the first band alone, because only the first one meets the list's top edge.
 */
function banded(start: string, end: string): SystemStyleObject {
  const back = `calc(${PAD} * -1)`;

  return {
    "&:first-child": { marginBlockStart: back },
    inlineSize: "auto",
    marginInline: back,
    paddingInlineEnd: `calc(${PAD} + ${end})`,
    paddingInlineStart: `calc(${PAD} + ${start})`,
  };
}

/**
 * Writes the inset a part outside the list takes, so its words start on the line the rows' words
 * start on.
 *
 * @remarks
 *   The label above the list and the summary below it stand outside the box the rows sit in. Drawn
 *   flush with that box they begin a step to the left of every row, which reads as two columns of
 *   text rather than one. The inset is the room the list leaves round its rows plus the room a row
 *   leaves before its own words, which is what a row's first letter sits behind.
 */
function aligned(start: string): SystemStyleObject {
  return { paddingInlineStart: `calc(${PAD} + ${start})` };
}

/**
 * The property the list publishes one row's height in, for whatever counts rows into a measure.
 */
export const ROW_HEIGHT = "--listbox-row";

/**
 * Writes the height one row of a given size comes to, as a property the list publishes.
 *
 * @remarks
 *   A transfer holds two lists to one height and a window turns a scroll position into a row, and
 *   both need to know how tall a row is before a row is drawn. The height is written from the same
 *   two values the row itself is written from, so a theme that moves either moves both, and it is
 *   published rather than duplicated because a second copy of the arithmetic drifts from the first.
 *   It holds for a list of single-line rows. A row carrying a line of explanation is taller than
 *   this says, and a measure counted off it comes out short.
 */
function rowHeight(size: Scale): SystemStyleObject {
  const floor = "{sizes.6}";
  const padding = dense(`{spacing.gap.${below(size)}}`);

  return { [ROW_HEIGHT]: `calc(${floor} + ${padding} + ${padding})` };
}

/**
 * Draws a plain listbox at the middle size, tinting the row the highlight is on.
 *
 * @remarks
 *   The control is the band the field sits in, and it carries the rule, the room and the focus.
 *   The field itself writes no box at all. A boxed field there drew a second border inside the
 *   list's and the ring a field carries drew a third on focus, so the band takes the flushed
 *   treatment instead: one rule underneath, which changes colour while anything inside the band has
 *   focus. The control that empties the field sits at the band's end rather than over the field,
 *   because the field is a flex child of the band and shortening it is what keeps the typing out
 *   from under the control.
 *   The band ends closer to the list's edge than a row does. The room a row leaves at its end is
 *   for a mark nobody presses, and the same room round a control leaves it stranded in the middle
 *   of the band's end.
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
    empty: { color: "fg.muted", textAlign: "start" },
    input: {
      _disabled: { layerStyle: "disabled" },
      _placeholder: { color: "fg.muted" },
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
    item: { ...row(), _hover: { background: "bg.muted" }, justifyContent: "space-between" },
    itemCheckbox: {
      "[data-selected] &, [data-state=checked] &, [data-state=indeterminate] &": {
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
          ...banded(dense(`{spacing.gap.${size}}`), dense(`{spacing.gap.${below(size)}}`)),
          columnGap: dense(`{spacing.gap.${below(size)}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `label.${size}`,
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
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemCheckbox: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      itemDescription: sizeVariants(
        (size) => ({ textStyle: `label.${below(below(size))}` }),
        ["sm", "md", "lg"],
      ),
      itemGroup: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${size}}`) }),
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
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
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
          textStyle: `label.${size}`,
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
     *   The surface is on the list rather than on the frame around it, so the label and the field
     *   above it stand outside the box the rows sit in. Only the inline axis is clipped, because
     *   the block axis is where the rows scroll and a clip on both would take the scrolling away.
     */
    variant: {
      plain: { content: { background: "transparent" } },
      surface: { content: { ...surface(), overflowX: "clip" } },
    },
  },
});
