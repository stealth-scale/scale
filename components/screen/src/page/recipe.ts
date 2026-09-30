/**
 * Recipe for a page: a column of bands, from a banner and a header to a body and a footer.
 *
 * @remarks
 *   The root is a column at least as tall as its container, so the footer of a short page renders
 *   at the container's end. Every band runs edge to edge, so a sticky band's fill and hairline span
 *   the full width, and each band's content starts at the gutter. A page with a measure stops its
 *   content there, at the start or centred as `align` sets. The header is a grid of three rows, so
 *   the context, the leading mark, the title, the meta, the actions and the description are
 *   siblings placed by area name, and a part left out takes no room. The title's column shrinks,
 *   so its text wraps while the actions keep the end of its row. The root sets the gutter and the
 *   measure as custom properties that every band reads. The page measures its own width and sets
 *   `folded` below the `sm` breakpoint. From the `lg` breakpoint of the window, a page with an
 *   aside becomes a grid with the aside beside the body, because a rail beside the text needs the
 *   window's width. Below it the aside stacks under the body, or leaves the page with
 *   `folds="hide"`. A sticky aside keeps to the top of its row, under the shell's sticky bars. The
 *   recipe has no `palette` axis, because a page is layout on the page's surface, and no `effect`
 *   axis, because a page is not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  onSlots,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

import { FOLDING } from "#folding/folding.ts";
import { CLASS, FLAT_PALETTE, tabbed, TABS, TABS_IN_NAV, TITLES } from "#page/metrics.ts";

/**
 * Custom property the root sets to the room at the page's inline edges.
 */
export const GUTTER = "--page-gutter";

/**
 * Custom property the root sets to the width of the page's content.
 */
export const MEASURE = "--page-measure";

/**
 * Custom property a band reads as its start padding before the measure.
 *
 * @remarks
 *   A band runs edge to edge, so its fill is full bleed, and its padding keeps the content in the
 *   measure. The `align` axis sets this property and every band reads it, so the header, the body
 *   and the footer share one column at either alignment.
 */
const LEAD = "--page-lead";

/**
 * Styles every band: edge to edge, with padding that keeps the content in the measure.
 */
const BAND = {
  flexShrink: "0",
  minInlineSize: "0",
  paddingInlineEnd: `max(var(${GUTTER}), calc(100% - var(${MEASURE}, 100%) - var(${LEAD}, var(${GUTTER}))))`,
  paddingInlineStart: `var(${LEAD}, var(${GUTTER}))`,
};

/**
 * Custom property the shell sets to the height of its sticky bars, under which a sticky band stops.
 */
const SHELL_TOP = "--app-shell-sticky-top";

/**
 * Custom property the root sets on each sticky band to the height of the sticky bands before it.
 */
export const STICKY_OFFSET = "--page-sticky-offset";

/**
 * Custom property the root sets on itself to the height of every band that sticks to the top.
 */
export const STICKY_TOP = "--page-sticky-top";

/**
 * Custom property a sticky aside takes, set to the height of the area that scrolls the page.
 */
export const SCROLLPORT = "--page-scrollport";

/**
 * Room a focus ring takes outside an element: its offset and its width.
 */
const RING_ROOM = "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))";

/**
 * Styles a sticky band: at the top, under the shell's sticky bars and the page's sticky bands
 * before it, on the page's fill.
 *
 * @remarks
 *   A sticky band takes the page's fill, because the page scrolls under it. Its inset reads the
 *   shell's sticky height and the height of the sticky bands before it, because a sticky element
 *   with an `auto` inset does not stick and two bands at one inset cover each other. Its z-index is
 *   the `sticky` token the shell's bars use, so a band and a bar at one edge share one order.
 */
const STUCK = {
  background: "bg",
  insetBlockStart: `calc(var(${SHELL_TOP}, 0px) + var(${STICKY_OFFSET}, 0px))`,
  position: "sticky",
  zIndex: "sticky",
};

/**
 * Styles a row that centres its items, wraps and shrinks.
 */
const ROW = { alignItems: "center", display: "flex", flexWrap: "wrap", minInlineSize: "0" };

/**
 * Selects a band followed by the navigation, which then has the hairline.
 */
const BEFORE_NAV = `&:has(+ .${CLASS}__nav)`;

/**
 * Selects a root with an aside, which lays its bands out as a grid from the `lg` breakpoint.
 */
const WITH_ASIDE = `&:has(> .${CLASS}__aside)`;

/**
 * Class name of the toolbar's recipe, whose root the navigation band keeps on the row of its tabs.
 */
export const TOOLBAR = "toolbar";

/**
 * Selects a toolbar in the navigation band.
 */
const TOOLBAR_IN_NAV = `& > .${TOOLBAR}__root`;

/**
 * Selects a strip of tabs in the navigation band, by the orientation the tabs' own line look
 * selects too.
 */
const STRIP_IN_NAV = `& .${CLASS}__tabs[data-orientation]`;

/**
 * Styles the grid of a page with an aside: every band across, and the body beside the aside.
 *
 * @remarks
 *   The body's row takes the remaining height and every other row takes its content's height,
 *   because the root is at least as tall as the shell's main region and a grid shares spare height
 *   between its `auto` rows.
 */
const BESIDE = {
  columnGap: dense("{spacing.gap.xl}"),
  display: "grid",
  gridTemplateAreas:
    '"banner banner" "header header" "nav nav" "toolbar toolbar" "body aside" "footer footer"',
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gridTemplateRows: "auto auto auto auto 1fr auto",
};

/**
 * Sizes the page offers, which a section in the page reads too.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Selects a navigation band with a strip of tabs, which is flush with the band's hairline.
 */
const WITH_TABS = `&:has(> .${TABS}__root)`;

/**
 * Defines the page recipe: a full-width page at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...FOLDING, flexShrink: "0" },
    actions: {
      ...ROW,
      flexWrap: "nowrap",
      gridArea: "actions",
      justifySelf: "end",
      paddingInlineStart: dense("{spacing.inset.xl}"),
    },
    /**
     * The aside, beside the body from the `lg` breakpoint and under it below.
     *
     * @remarks
     *   Beside the body a sticky aside is a column at most as tall as the area that scrolls the
     *   page, less the sticky bars and bands above it and a gap at each end. Its scroll area fills
     *   the column, so the end of a long aside remains reachable while it sticks.
     */
    aside: {
      "&[data-folds=hide]": { lgDown: { display: "none" } },
      "&[data-sticky]": {
        alignSelf: "start",
        insetBlockStart: `calc(var(${SHELL_TOP}, 0px) + var(${STICKY_TOP}, 0px) + {spacing.gap.xl})`,
        lg: {
          display: "flex",
          flexDirection: "column",
          maxBlockSize: `calc(var(${SCROLLPORT}, 100dvh) - var(${SHELL_TOP}, 0px) - var(${STICKY_TOP}, 0px) - {spacing.gap.xl} * 2)`,
        },
        position: "sticky",
      },
      gridArea: "aside",
      lg: { paddingInlineStart: "0" },
      minInlineSize: "0",
      paddingInline: `var(${GUTTER})`,
    },
    /**
     * The padding of a sticky aside's scroll area, the room a focus ring takes at its edges.
     */
    asideContent: { padding: RING_ROOM },
    /**
     * A sticky aside's scroll area, pulled out on every side by the room its content's padding
     * takes, so the content keeps its place.
     */
    asideScroller: { margin: `calc(${RING_ROOM} * -1)` },
    banner: { ...BAND, flexShrink: "0", gridArea: "banner" },
    body: {
      ...BAND,
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gridArea: "body",
      minBlockSize: "0",
    },
    context: { ...ROW, gridArea: "context", minInlineSize: "0" },
    description: {
      color: "fg.subtle",
      gridArea: "description",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    /**
     * Lays the footer out as a row that sticks to the bottom edge when told to.
     *
     * @remarks
     *   A sticky footer resets the top inset the shared sticky rule sets.
     */
    footer: {
      ...BAND,
      ...ROW,
      "&[data-sticky]": { ...STUCK, insetBlockEnd: "0", insetBlockStart: "auto" },
      gridArea: "footer",
    },
    /**
     * Lays the header out in three rows: the context, the title's row and the description.
     *
     * @remarks
     *   The rows have no gap. The context row keeps a small margin above the title's row, and the
     *   line heights part the title from the description. The columns have no gap, because the
     *   parts beside the title belong to its line. Every part names its area, because the grid
     *   places a part without one in the first free cell.
     */
    header: {
      ...BAND,
      "&[data-sticky]": STUCK,
      alignItems: "center",
      display: "grid",
      gridArea: "header",
      gridTemplateAreas:
        '"context context context context" "leading title meta actions" "description description description description"',
      gridTemplateColumns: "auto auto minmax(0, 1fr) auto",
    },
    leading: {
      display: "flex",
      gridArea: "leading",
      marginInlineEnd: dense("{spacing.gap.lg}"),
    },
    meta: { ...ROW, gridArea: "meta" },
    nav: {
      ...BAND,
      "&[data-sticky]": STUCK,
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.lg}"),
      gridArea: "nav",
      justifyContent: "space-between",
      [TABS_IN_NAV]: { flex: "0 1 auto", inlineSize: "auto", minInlineSize: "0" },
      [TOOLBAR_IN_NAV]: { flex: "0 1 auto", inlineSize: "auto" },
    },
    palette: { inlineSize: "var(--reference-width)", overflow: "clip" },
    picker: {
      "& > span": truncate(),
      flex: "1",
      justifyContent: "space-between",
      minInlineSize: "0",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      flexGrow: "1",
      inlineSize: "100%",
      minBlockSize: "100%",
      minInlineSize: "0",
      [WITH_ASIDE]: { lg: BESIDE },
    },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
    toolbar: { ...BAND, ...ROW, "&[data-sticky]": STUCK, gridArea: "toolbar" },
    trail: {
      "& > svg": { _rtl: { transform: "scaleX(-1)" } },
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      gridArea: "context",
      justifySelf: "start",
      minInlineSize: "0",
    },
  },
  className: CLASS,
  compoundVariants: [
    /**
     * Moves the meta of a folded header onto its own row under the title.
     *
     * @remarks
     *   The meta drops the start margin it has beside the title, so it starts where the title and
     *   the description start, and keeps a small margin above and below. The actions keep the `sm`
     *   inset from the title.
     */
    {
      css: {
        actions: { paddingInlineStart: dense("{spacing.inset.sm}") },
        header: {
          gridTemplateAreas:
            '"context context context" "leading title actions" "meta meta meta" "description description description"',
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
        },
        meta: { marginBlock: dense("{spacing.gap.sm}"), marginInlineStart: "0" },
      },
      folded: true,
      name: "stacked",
    },
  ],
  defaultVariants: { align: "start", divided: true, gutter: "xl", measure: "full", size: "md" },
  jsx: [/^Page(\.\w+)?$/u],
  slots: [
    "root",
    "banner",
    "header",
    "context",
    "leading",
    "title",
    "meta",
    "description",
    "actions",
    "action",
    "nav",
    "tabs",
    "picker",
    "palette",
    "toolbar",
    "body",
    "aside",
    "asideScroller",
    "asideContent",
    "footer",
    "trail",
  ],
  variants: {
    /**
     * Position of the content when the measure is narrower than the page.
     *
     * @remarks
     *   The axis sets the start padding of every band. The root runs edge to edge, so a band's fill
     *   is full bleed, and automatic margins on a full-width root would move nothing.
     */
    align: {
      start: { root: { [LEAD]: `var(${GUTTER})` } },

      center: {
        root: { [LEAD]: `max(var(${GUTTER}), calc((100% - var(${MEASURE}, 100%)) / 2))` },
      },
    },

    /**
     * Whether a hairline separates the bands.
     *
     * @remarks
     *   A header followed by the navigation leaves the hairline to the navigation, and a strip of
     *   tabs in the navigation drops its own line, so the strip has one line under it and none
     *   above. The strip's rule outweighs the tabs' own line look, whose selector names the
     *   orientation, because both are in the variants layer.
     */
    divided: {
      true: {
        footer: { ...divider("horizontal"), borderBlockStartWidth: "hairline" },
        header: {
          ...divider("horizontal"),
          [BEFORE_NAV]: { borderBlockEndWidth: "0" },
          borderBlockEndWidth: "hairline",
        },
        nav: {
          ...divider("horizontal"),
          borderBlockEndWidth: "hairline",
          [STRIP_IN_NAV]: { borderBlockEndWidth: "0" },
        },
        toolbar: { ...divider("horizontal"), borderBlockEndWidth: "hairline" },
      },
    },

    /**
     * Room at the page's inline edges, which every band reads.
     *
     * @remarks
     *   The default is the `xl` inset. A folded page sets the `md` inset.
     */
    gutter: onSlots({ root: sizeVariants((size) => ({ [GUTTER]: `{spacing.inset.${size}}` })) }),

    /**
     * Width of the page's content.
     *
     * @remarks
     *   The axis is not named `width`, because `width` is a style prop of a styled element.
     *   `narrow` and `wide` read the theme's page sizes.
     */
    measure: {
      full: { root: { [MEASURE]: "100%" } },
      narrow: { root: { [MEASURE]: "{sizes.page.narrow}" } },
      wide: { root: { [MEASURE]: "{sizes.page.wide}" } },
    },

    /**
     * Whether the page is narrower than the `sm` breakpoint, which the page sets from its own
     * width.
     *
     * @remarks
     *   A folded page has the `md` gutter. The axis is not named `narrow`, because `measure` has a
     *   `narrow` value and two values of one name compile to one class.
     */
    folded: { true: { root: { [GUTTER]: "{spacing.inset.md}" } } },

    /**
     * Size of the title, the description, the actions and the bands' padding.
     *
     * @remarks
     *   The page offers three sizes, because larger steps belong to a display heading. A section in
     *   the page reads this size too.
     */
    size: onSlots({
      actions: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      aside: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      banner: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      body: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      context: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          marginBlockEnd: size === "lg" ? "{spacing.1}" : "{spacing.0.5}",
          textStyle: `body.${below(size)}`,
        }),
        STEPS,
      ),
      description: {
        lg: { textStyle: "body.md" },
        md: { textStyle: "body.md" },
        sm: { textStyle: "body.sm" },
      },
      footer: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      header: sizeVariants(
        (size) => ({
          [BEFORE_NAV]: { paddingBlockEnd: dense(`{spacing.gap.${size}}`) },
          paddingBlock: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      meta: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          marginInlineStart: dense(`{spacing.gap.${size}}`),
        }),
        STEPS,
      ),
      nav: sizeVariants(
        (size) => ({
          ...tabbed(size),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          [WITH_TABS]: { paddingBlock: "0" },
        }),
        STEPS,
      ),
      palette: sizeVariants(() => FLAT_PALETTE, STEPS),
      title: TITLES,
      toolbar: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
        }),
        STEPS,
      ),
      trail: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `body.${below(size)}`,
        }),
        STEPS,
      ),
    }),
  },
});
