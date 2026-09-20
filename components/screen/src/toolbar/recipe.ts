/**
 * Defines the styles a toolbar is drawn with.
 *
 * @remarks
 *   Five parts. The root is the row, the start, centre and end are the bands inside it, the
 *   separator parts one set of controls from the next, and the search covers the row where it is
 *   opened on a narrow one.
 *   A band left out takes no room. The centre takes what the other two leave and cuts a long title
 *   short rather than wrapping the row, because a toolbar that grows to two lines moves everything
 *   under it.
 *   The gap is stated once on the root as a property every band reads, so one value moves all of
 *   them and a band drawn by a caller reads the same number. It is the gap two steps below the
 *   toolbar's own size, because the controls in a bar sit close: a bar of icon buttons at the
 *   gap of a form reads as a row of separate things rather than as one bar.
 *   Neither a group of controls nor a rule between them is a part here. The layout package draws a
 *   `Group`, which joins controls into one and knows how to square the corners between them, and
 *   this restyles only the rule, which has to stretch to the row's height rather than sit at a
 *   length of its own.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

import { FOLDED, FOLDING } from "#folding/index.ts";

/**
 * The property the root states the gap between controls in, which every band reads.
 */
export const GAP = "--toolbar-gap";

/**
 * Writes what every band shares: a row of controls, centred on their middle.
 */
const BAND = { alignItems: "center", display: "flex", gap: `var(${GAP})`, minInlineSize: "0" };

/**
 * Draws a plain toolbar at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...FOLDING, flexShrink: "0" },
    center: {
      ...BAND,
      ...truncate(),
      "& > *": { minInlineSize: "0", overflow: "hidden", textOverflow: "ellipsis" },
      flex: "1",
      justifyContent: "center",
    },
    end: { ...BAND, marginInlineStart: "auto" },
    folded: { ...FOLDED, alignItems: "center", flexShrink: "0", justifyContent: "center" },
    root: { ...BAND, inlineSize: "100%", position: "relative" },
    search: {
      "&[data-opened]": {
        "& > *": { inlineSize: "100%" },
        alignItems: "center",
        background: "bg",
        display: "flex",
        inset: "0",
        position: "absolute",
        zIndex: "1",
      },
      minInlineSize: "0",
    },
    separator: { alignSelf: "stretch", blockSize: "auto" },
    start: BAND,
  },
  className: "toolbar",
  defaultVariants: { radius: "l2", size: "md", variant: "plain" },
  jsx: [/^Toolbar(\.\w+)?$/u],
  slots: ["root", "start", "center", "end", "action", "folded", "separator", "search"],
  variants: {
    radius: onSlot("root", cornerVariants(["l1", "l2", "l3"])),

    size: onSlots({
      root: sizeVariants((size) => ({ [GAP]: `{spacing.gap.${below(below(size))}}` })),
      separator: sizeVariants((size) => ({ marginBlock: dense(`{spacing.gap.${size}}`) })),
    }),

    /**
     * Whether the row is raised on a surface of its own or drawn against what holds it.
     *
     * @remarks
     *   A row with an edge is inset by its own gap, so the controls stand off the edge. Without
     *   it a filled control sat against the edge and a field at the end drew its border over the
     *   row's. The plain row has no edge and keeps its controls flush with what holds it.
     */
    variant: {
      outline: { root: { borderColor: "border", borderWidth: "hairline", padding: `var(${GAP})` } },
      plain: { root: { background: "transparent" } },
      surface: { root: { ...surface(), padding: `var(${GAP})` } },
    },
  },
});
