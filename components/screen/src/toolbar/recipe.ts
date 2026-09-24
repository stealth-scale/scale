/**
 * Recipe for a toolbar: a row of controls with a start, a centre and an end band, and a search.
 *
 * @remarks
 *   A band left out takes no room. The centre takes the room the other bands leave and truncates a
 *   long title, because a toolbar on two lines moves everything under it. The root sets the gap as
 *   `--toolbar-gap`, which every band reads. The gap is two gap sizes smaller than the toolbar's
 *   size, so a row of controls reads as one bar. The layout package's `Group` joins controls, and
 *   the separator is the layout divider stretched to the row's height. The search and its content
 *   have no minimum width, and the search takes the room the bands leave, down to zero, because the
 *   bands keep the width of their controls. An opened search covers the row. The recipe has no
 *   `palette` axis, because the controls in the row set their own palettes, and no `effect` axis,
 *   because the row is not a control.
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
 * Custom property the root sets to the gap between controls, which every band reads.
 */
export const GAP = "--toolbar-gap";

/**
 * Styles every band: a row of controls, centred on the cross axis.
 */
const BAND = { alignItems: "center", display: "flex", gap: `var(${GAP})`, minInlineSize: "0" };

/**
 * Defines the toolbar recipe: a plain row at size `md` with `l2` corners by default.
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
    end: { ...BAND, flexShrink: "0", marginInlineStart: "auto" },
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
      "& > *": { minInlineSize: "0" },
      flex: "1 1 0",
      minInlineSize: "0",
    },
    separator: { alignSelf: "stretch", blockSize: "auto" },
    start: { ...BAND, flexShrink: "0" },
  },
  className: "toolbar",
  defaultVariants: { radius: "l2", size: "md", variant: "plain" },
  jsx: [/^Toolbar(\.\w+)?$/u],
  slots: ["root", "start", "center", "end", "action", "folded", "separator", "search"],
  variants: {
    /**
     * Corner radius of an outlined or surface row.
     */
    radius: onSlot("root", cornerVariants(["l1", "l2", "l3"])),

    /**
     * Size of the gap and of the separator's block margin.
     */
    size: onSlots({
      root: sizeVariants((size) => ({ [GAP]: `{spacing.gap.${below(below(size))}}` })),
      separator: sizeVariants((size) => ({ marginBlock: dense(`{spacing.gap.${size}}`) })),
    }),

    /**
     * Look of the row.
     *
     * @remarks
     *   `outline` and `surface` pad the row by its gap, so the controls start inside the row's
     *   edge. `plain` has no edge and no padding.
     */
    variant: {
      surface: { root: { ...surface(), padding: `var(${GAP})` } },

      outline: { root: { borderColor: "border", borderWidth: "hairline", padding: `var(${GAP})` } },

      plain: { root: { background: "transparent" } },
    },
  },
});
