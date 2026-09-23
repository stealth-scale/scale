/**
 * Defines the styles a navigation list is drawn with.
 *
 * @remarks
 *   Ten parts. The root is the list, an item is a row, a link is the destination a reader presses,
 *   and an action and a badge sit at the end of a row. A branch is a row that opens: the trigger is
 *   the row, the indicator is the mark that turns, and the content is the list beneath it. The
 *   skeleton is the shape of a row still on its way.
 *   A row is drawn from the theme's `row` fragment rather than borrowed from the button. A
 *   destination is not a control, and a row carrying two recipes carried two heights, whichever the
 *   stylesheet happened to write last.
 *   A nested list reuses the item and the link rather than naming a second pair. The content mutes
 *   the ink and every row below it inherits, so one rule says a nested row is quieter and the parts
 *   a caller composes stay the same at every depth. It slides open and closed from the height the
 *   branch's machine measures, through the theme's collapse motion, and the mark on the row turns
 *   a quarter as it opens, so a reader sees the list arrive rather than appear.
 *   `iconic` draws the rows as squares with their words read but not seen. It is a variant rather
 *   than an attribute read from an ancestor, so the slot recipe hands it to every part through the
 *   root and no part selects on a scope it does not own. A row collapsed to a square gives back the
 *   room it was keeping for whatever it carries at its end: that room is still reserved while the
 *   count and the control are only hidden, and a row that carried a control came out at 51.59
 *   pixels wide beside squares of 24.
 *   The count, the control and the mark that opens a branch all stand in one column at the row's
 *   end. They are three different things to the markup and one column to a reader.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  HIGHLIGHTS,
  highlightVariants,
  interactive,
  onSlots,
  row,
  type Scale,
  sizeVariants,
  type SystemStyleObject,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * The class this recipe is compiled under, which a selector reaching across parts reads.
 *
 * @remarks
 *   The binding writes one class per part, `nav-list__action`, and stamps no attribute naming the
 *   part. A rule that selects another part therefore selects the class, and builds it from this
 *   constant so the two cannot drift. The keyboard reads the same constant to find the rows, for
 *   the same reason.
 */
export const CLASS = "nav-list";

/**
 * Selects the control at the end of a row from a rule written on the row.
 */
const ACTION = `.${CLASS}__action`;

/**
 * Selects the count at the end of a row from a rule written on the row.
 */
const BADGE = `.${CLASS}__badge`;

/**
 * Selects whichever of the two things a row carries at its end, for a rule that has to leave room
 * for either.
 */
const TRAILED = `:is(${ACTION}, ${BADGE})`;

/**
 * Writes what a row collapsed to a mark is drawn as: a square holding the mark alone, with the
 * words it was written with kept for a screen reader.
 *
 * @remarks
 *   The words go out of sight rather than out of the document, because a destination with no name
 *   is one a screen reader announces as `link` and nothing else. Clipping them with the square's
 *   overflow would leave them taking room inside it and squashing the mark they were meant to leave
 *   alone, so they are taken out of the flow instead. A mark drawn as `svg` is what stays; anything
 *   else a caller wants seen goes in one.
 */
const SQUARED = {
  "& > :not(svg)": { srOnly: true },
  aspectRatio: "square",
  inlineSize: "auto",
  justifyContent: "center",
};

/**
 * Writes what every row a reader presses shares: the theme's row, the whole width of the list, and
 * words that are cut short rather than wrapped.
 */
const PRESSABLE = {
  ...row(),
  ...interactive(),
  _hover: { background: "colorPalette.subtle" },
  cursor: "button",
  inlineSize: "full",
  justifyContent: "flex-start",
  minInlineSize: "0",
};

/**
 * Writes the room a row takes at one size: as tall as a tag of that name, with the label, the
 * inset and the gap a step below it, and the page being read set in the ink and semibold.
 *
 * @remarks
 *   A list of destinations is read down a column, twenty rows at a time, and a row set in the
 *   label of a control at the same name reads as a column of buttons, so the words and the inset
 *   step down. They stepped down twice, which put the three sizes on three neighbouring steps of
 *   the label scale: a small list and a large one differed by a pixel of type and a reader could
 *   not tell the page's three steps apart. One step down keeps a row short and leaves the steps
 *   the distance the scale meant them to have. The current page's weight is written here beside the
 *   label rather than on the row's base, because the label states a weight of its own and the
 *   compiler lets a variant's value beat the base's, whichever was written later.
 *   The weight and nothing else. The ink of the current row belongs to the `highlight` axis, which
 *   states a fill and the ink that reads on it. Written here as well it won: `size` is declared
 *   after `highlight`, so a row marked with the solid fill was drawn in the page's own ink on the
 *   palette's solid, and the words of the page a reader was on disappeared into the mark.
 *   The row is never shorter than the grid step at twenty-four CSS pixels, whatever the theme's
 *   density and whatever step it is drawn at. A row is a target a reader points at, and a small
 *   list under a theme drawn tighter measured 20.5 pixels with 2.9 between rows, which is under
 *   both what 2.5.8 asks of a target and what its spacing exception allows.
 */
function rowed(size: Scale): SystemStyleObject {
  return {
    _currentPage: { fontWeight: "semibold" },
    blockSize: `max({sizes.6}, ${dense(`{sizes.tag.${size}}`)})`,
    gap: dense(`{spacing.gap.${below(size)}}`),
    paddingInline: dense(`{spacing.inset.${below(size)}}`),
    textStyle: `label.${below(size)}`,
  };
}

/**
 * Writes what sits at the end of a row: over the row, centred against it, out of the flow.
 *
 * @remarks
 *   Out of the flow so that the mark filling the row a reader is on runs the whole width of it. In
 *   the flow the fill stopped where the control began and left a notch at the end of the row.
 */
const BESIDE = {
  insetInlineEnd: "0",
  position: "absolute",
  top: "50%",
  translate: "0 -50%",
};

/**
 * Writes the column every mark at the end of a row stands in: a square on the tag scale holding
 * whatever it is given in the middle of it.
 *
 * @remarks
 *   One square for all three, because a count, a control and the mark that opens a branch are the
 *   same column of a list to anybody reading down it. Each was placed by its own rule before: the
 *   count and the control are drawn over the row and the mark is a child of it, so the three stood
 *   at three widths from the row's end and none of them lined up with the other two. Measured at
 *   the middle step on a row ending at 416.84: the count's middle at 401.22, the control's at
 *   408.84 and the mark's at 397.74. A minimum rather than a width. A count of three digits is
 *   wider than the square and grows back along the row; a mark never is.
 */
function trailing(size: Scale): SystemStyleObject {
  const square = dense(`{sizes.tag.${below(size)}}`);

  return {
    alignItems: "center",
    blockSize: square,
    display: "flex",
    justifyContent: "center",
    minInlineSize: square,
  };
}

/**
 * Writes the room a row keeps between the column at its end and its own edge, which is the room it
 * keeps at the other end.
 */
function tucked(size: Scale): SystemStyleObject {
  return { marginInlineEnd: dense(`{spacing.inset.${below(size)}}`) };
}

/**
 * Writes the room a row leaves at its end for whatever is drawn over it: the row's own inset, the
 * gap, and the square the mark stands in.
 *
 * @remarks
 *   Both the count and the control are drawn over the row, so the words under either ran on until
 *   they met it. The longest row of a list sized to its own contents had its last word crossed out
 *   by a pencil.
 */
function reserved(size: Scale): string {
  const inset = dense(`{spacing.inset.${below(size)}}`);

  return `calc(${inset} + ${dense(`{spacing.gap.${below(size)}}`)} + ${dense(`{sizes.tag.${below(size)}}`)})`;
}

/**
 * Selects the row a reader presses from a rule written on the item that holds it, whichever of the
 * two kinds of row it is.
 */
const PRESSED = `:is(.${CLASS}__link, .${CLASS}__trigger)`;

/**
 * Selects the row naming the page being read, off the attribute a screen reader reads it by.
 */
const CURRENT = '[aria-current="page"]';

/**
 * Draws a column of rows at the middle size, tinting the row the reader is on.
 *
 * @remarks
 *   The count beside a row states its own ink rather than taking the row's. It is placed at the
 *   end of the row rather than inside the link, and a mark that fills the link stops at the link's
 *   edge, so a count that took the ink meant to read on that fill was drawn in it on the page
 *   instead: white on white beside a row marked with the solid fill.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: BESIDE,
    badge: { ...BESIDE, color: "fg.muted", pointerEvents: "none" },
    branch: { listStyle: "none", minInlineSize: "0" },
    content: {
      _closed: { animationStyle: "collapse.out" },
      _open: { animationStyle: "collapse.in" },
      "&[hidden]": { display: "none" },
      borderColor: "border",
      borderInlineStartWidth: "hairline",
      color: "fg.muted",
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      overflow: "hidden",
      padding: "0",
    },
    indicator: {
      _motionReduce: { transitionDuration: "0s" },
      _open: { rotate: "90deg" },
      _rtl: { _open: { rotate: "90deg" }, rotate: "180deg" },
      color: "fg.muted",
      display: "flex",
      flexShrink: "0",
      marginInlineStart: "auto",
      transitionDuration: "press",
      transitionProperty: "rotate",
      transitionTimingFunction: "press",
    },
    item: { listStyle: "none", minInlineSize: "0", position: "relative" },
    link: PRESSABLE,
    root: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    skeleton: { alignItems: "center", display: "flex" },
    trigger: {
      ...PRESSABLE,
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "colorPalette.fg",
    },
  },
  className: CLASS,
  compoundVariants: [
    {
      css: {
        action: { display: "none" },
        badge: { srOnly: true },
        content: { display: "none" },
        indicator: { display: "none" },
        item: { [`&:has(> ${TRAILED}) > ${PRESSED}`]: { paddingInlineEnd: "0" } },
        link: { ...SQUARED },
        trigger: { ...SQUARED },
      },
      iconic: true,
      name: "squared",
      variant: "list",
    },

    /**
     * The count beside the row a reader is on takes the ink that reads on the mark filling it.
     *
     * @remarks
     *   Only where the mark is a fill. A count is drawn over the row rather than inside it, so on a
     *   row filled with the palette's solid the muted ink it takes everywhere else stood at 3.1:1
     *   from what it was drawn on, which is under what 1.4.3 asks of text. The tint and the bar
     *   leave the row on the page's own surface, where the muted ink is what a count should read
     *   in.
     *   The count follows the row in the document, so the rule reads the row as a sibling rather
     *   than asking the item what it holds.
     */
    {
      css: {
        badge: {
          [`${PRESSED}${CURRENT} ~ &`]: { color: "colorPalette.contrast" },
        },
      },
      highlight: "fill",
      name: "counted",
      variant: "list",
    },
  ],
  defaultVariants: {
    highlight: "tint",
    radius: "l2",
    reveal: "always",
    size: "md",
    variant: "list",
  },
  jsx: [/^NavList(\.\w+)?$/u],
  slots: [
    "root",
    "item",
    "link",
    "action",
    "badge",
    "branch",
    "trigger",
    "indicator",
    "content",
    "skeleton",
  ],
  variants: {
    /**
     * How the row naming the page the reader is on is marked.
     */
    highlight: onSlots({
      link: highlightVariants(HIGHLIGHTS, "_currentPage"),
      trigger: highlightVariants(HIGHLIGHTS, "_currentPage"),
    }),

    /**
     * Whether the rows are drawn as squares holding a mark, their words read but not seen.
     *
     * @remarks
     *   The words stay in the document under `srOnly`, because a row with no name is no row to a
     *   screen reader. The sidebar that collapses states this; the list never measures anything.
     */
    iconic: { true: { root: { alignItems: "center" } } },

    radius: onSlots({
      link: cornerVariants(["l1", "l2", "l3", "full"]),
      trigger: cornerVariants(["l1", "l2", "l3", "full"]),
    }),

    /**
     * When the control beside a row is drawn.
     *
     * @remarks
     *   A control revealed on hover stays drawn under a coarse pointer, where there is no hover to
     *   reveal it with, and while anything inside the row holds focus, so a keyboard reaches it.
     */
    reveal: {
      always: { action: { opacity: "1" } },
      hover: {
        action: {
          _touch: { opacity: "1" },
          opacity: "0",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
        },
        item: {
          [`&:focus-within ${ACTION}, &:hover ${ACTION}`]: { opacity: "1" },
        },
      },
    },

    size: onSlots({
      action: sizeVariants((size) => ({ ...trailing(size), ...tucked(size) }), ["sm", "md", "lg"]),

      /**
       * The count beside a row reads a step under the row's own words.
       *
       * @remarks
       *   The slot stated no size at all, so a count stayed one measure through every step and a
       *   large list carried the same small tag a small list did.
       */
      badge: sizeVariants(
        (size) => ({
          ...trailing(size),
          ...tucked(size),
          textStyle: `label.${below(below(size))}`,
        }),
        ["sm", "md", "lg"],
      ),
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          marginInlineStart: dense(`{spacing.inset.${below(size)}}`),
          paddingBlock: "0.5",
          paddingInlineStart: dense(`{spacing.inset.${below(size)}}`),
        }),
        ["sm", "md", "lg"],
      ),

      indicator: sizeVariants(trailing, ["sm", "md", "lg"]),
      /**
       * The room a row leaves at its end for whatever is drawn over it.
       *
       * @remarks
       *   A count as well as a control. Both are drawn over the row, and the rule asked only about
       *   the control, so a row whose words ran as far as its count had them written under it.
       *   The rule is written on this axis rather than on the item's base, because the compiler
       *   puts a recipe's variants in a layer over its base and the row's own `paddingInline` is
       *   written by the axis of the same name. A layer beats specificity, so the same rule on the
       *   base, three classes deep, lost to a variant one class deep.
       */
      item: sizeVariants(
        (size) => ({
          [`&:has(> ${TRAILED}) > ${PRESSED}`]: { paddingInlineEnd: reserved(size) },
        }),
        ["sm", "md", "lg"],
      ),
      link: sizeVariants(rowed, ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(below(size))}}`) }),
        ["sm", "md", "lg"],
      ),
      skeleton: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          gap: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInline: dense(`{spacing.inset.${below(below(size))}}`),
        }),
        ["sm", "md", "lg"],
      ),
      trigger: sizeVariants(rowed, ["sm", "md", "lg"]),
    }),

    /**
     * Whether the rows run down the side of a page or across the foot of a screen.
     *
     * @remarks
     *   The dock is the pattern a thumb reaches: a handful of destinations in equal columns, each a
     *   mark over its words. It keeps clear of the room a device reserves at the foot of the
     *   screen for a home indicator.
     *   It is named `dock` rather than `bar` because the `highlight` axis already offers `bar`, and
     *   two values of that name on one slot compile to one class that the later of them wins.
     */
    variant: {
      dock: {
        item: { flex: "1" },
        link: { blockSize: "auto", flexDirection: "column", justifyContent: "center" },
        root: {
          alignItems: "stretch",
          flexDirection: "row",
          paddingBlockEnd: "safe.bottom",
        },
      },
      list: { link: truncate(), trigger: truncate() },
    },
  },
});
