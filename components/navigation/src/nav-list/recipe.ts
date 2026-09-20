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
 *   root and no part selects on a scope it does not own.
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
 *   constant so the two cannot drift.
 */
const CLASS = "nav-list";

/**
 * Selects the control at the end of a row from a rule written on the row.
 */
const ACTION = `.${CLASS}__action`;

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
 * inset and the gap two steps below it, and the page being read set in the ink and semibold.
 *
 * @remarks
 *   A list of destinations is read down a column, twenty rows at a time, and a row set in the
 *   label of a control at the same name reads as a column of buttons. The words and the inset step
 *   down twice, so a medium list is a column of short rows in the smallest label, which is how a
 *   sidebar keeps its whole tree in view. The current page's weight is written here beside the
 *   label rather than on the row's base, because the label states a weight of its own and the
 *   compiler lets a variant's value beat the base's, whichever was written later.
 */
function rowed(size: Scale): SystemStyleObject {
  return {
    _currentPage: { color: "fg", fontWeight: "semibold" },
    blockSize: dense(`{sizes.tag.${size}}`),
    gap: dense(`{spacing.gap.${below(below(size))}}`),
    paddingInline: dense(`{spacing.inset.${below(below(size))}}`),
    textStyle: `label.${below(below(size))}`,
  };
}

/**
 * Writes what sits at the end of a row: over the row, centred against it, out of the flow.
 */
const BESIDE = {
  insetInlineEnd: "0",
  position: "absolute",
  top: "50%",
  translate: "0 -50%",
};

/**
 * Draws a column of rows at the middle size, tinting the row the reader is on.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: BESIDE,
    badge: { ...BESIDE, pointerEvents: "none" },
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
      transitionProperty: "common",
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
        link: { ...SQUARED },
        trigger: { ...SQUARED },
      },
      iconic: true,
      name: "squared",
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
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          marginInlineStart: dense(`{spacing.inset.${below(size)}}`),
          paddingBlock: "0.5",
          paddingInlineStart: dense(`{spacing.inset.${below(size)}}`),
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
