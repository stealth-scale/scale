/**
 * Recipe for a toolbar: a row of controls with a start, a centre and an end band, and a search.
 *
 * @remarks
 *   A band left out takes no room. The centre takes the room the other bands leave and truncates a
 *   long title, because a toolbar on two lines moves everything under it. The root sets the gap as
 *   `--toolbar-gap`, which every band reads: the gap token of the toolbar's size, 8px at `md`. The
 *   layout package's `Group` joins controls, and the separator is the layout divider stretched to
 *   the row's height. The search is 15rem wide and does not grow, because the centre takes the free
 *   room. As a child of the row it shrinks down to zero before a band's controls do. A field's
 *   percentage width gives a band no content width, so the search states an inline size. An opened
 *   search covers the whole row, the padding and the edge of an outline or surface row included,
 *   and the root hides its other children while it is open, so the row needs no fill of its own on
 *   any surface. The recipe has no `palette`
 *   axis, because the controls in the row set their own palettes, and no `effect` axis, because the
 *   row is not a control.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

import { FOLDING } from "#folding/folding.ts";

/**
 * Custom property the root sets to the gap between controls, which every band reads.
 */
export const GAP = "--toolbar-gap";

/**
 * Custom property the root sets to its own padding in the outline and surface looks.
 */
export const INSET = "--toolbar-inset";

/**
 * Custom property the outline and surface looks set to the root's edge width, which an opened
 * search covers.
 */
export const EDGE = "--toolbar-edge";

/**
 * Styles every band: a row of controls, centred on the cross axis.
 */
const BAND = { alignItems: "center", display: "flex", gap: `var(${GAP})`, minInlineSize: "0" };

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "toolbar";

/**
 * Selects a root while its search is open.
 */
const SEARCHING = `&:has(.${CLASS}__search[data-opened])`;

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
    group: { flexShrink: "0" },
    root: {
      ...BAND,
      inlineSize: "100%",
      position: "relative",
      [SEARCHING]: { [`& > :not(.${CLASS}__search)`]: { visibility: "hidden" } },
    },
    search: {
      "&[data-opened]": {
        "& > :first-child": { flex: "1" },
        alignItems: "stretch",
        display: "flex",
        inlineSize: "auto",
        inset: `calc(var(${EDGE}, 0px) * -1)`,
        position: "absolute",
        zIndex: "1",
      },
      "& > *": { minInlineSize: "0" },
      flex: "0 1 auto",
      inlineSize: "60",
      minInlineSize: "0",
    },
    separator: { alignSelf: "stretch", blockSize: "auto" },
    start: { ...BAND, flexShrink: "0" },
  },
  className: CLASS,
  defaultVariants: { radius: "l2", size: "md", variant: "plain" },
  jsx: [/^Toolbar(\.\w+)?$/u],
  slots: ["root", "start", "center", "end", "action", "group", "separator", "search"],
  variants: {
    /**
     * Corner radius of an outlined or surface row.
     */
    radius: onSlot("root", cornerVariants(["l1", "l2", "l3"])),

    /**
     * Size of the gap and of the separator's block margin.
     */
    size: onSlots({
      root: sizeVariants((size) => ({ [GAP]: `{spacing.gap.${size}}` })),
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
      surface: {
        root: {
          ...surface(),
          [EDGE]: "{borderWidths.hairline}",
          [INSET]: `var(${GAP})`,
          padding: `var(${INSET})`,
        },
      },

      outline: {
        root: {
          borderColor: "border",
          borderWidth: "hairline",
          [EDGE]: "{borderWidths.hairline}",
          [INSET]: `var(${GAP})`,
          padding: `var(${INSET})`,
        },
      },

      plain: { root: { background: "transparent" } },
    },
  },
});
