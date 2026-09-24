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
 *   `folded` below the `md` breakpoint. From the `lg` breakpoint of the window, a page with an
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

import { FOLDED, FOLDING } from "#folding/folding.ts";

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
 * Styles a sticky band: at the top, under the shell's sticky bars, on the page's fill.
 *
 * @remarks
 *   A sticky band takes the page's fill, because the page scrolls under it. Its inset reads the
 *   shell's sticky height, because a sticky element with an `auto` inset does not stick. Its
 *   z-index is the `sticky` token the shell's bars use, so a band and a bar at one edge share one
 *   order.
 */
const STUCK = {
  background: "bg",
  insetBlockStart: `var(${SHELL_TOP}, 0px)`,
  position: "sticky",
  zIndex: "sticky",
};

/**
 * Styles a row that centres its items, wraps and shrinks.
 */
const ROW = { alignItems: "center", display: "flex", flexWrap: "wrap", minInlineSize: "0" };

/**
 * Class name of the recipe, which a selector across bands reads.
 *
 * @remarks
 *   The binding writes one class per band, such as `page__nav`, and no attribute that names the
 *   band. A selector for another band builds that class from this constant.
 */
const CLASS = "page";

/**
 * Selects a band followed by the navigation, which then has the hairline.
 */
const BEFORE_NAV = `&:has(+ .${CLASS}__nav)`;

/**
 * Selects a root with an aside, which lays its bands out as a grid from the `lg` breakpoint.
 */
const WITH_ASIDE = `&:has(> .${CLASS}__aside)`;

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
 * Heading role of the title at each size, one size larger than a section title's at that size.
 *
 * @remarks
 *   The page title is the one heading above every section title on the page, so it reads a larger
 *   role than theirs.
 */
const TITLES = {
  lg: { textStyle: "heading.xl" },
  md: { textStyle: "heading.lg" },
  sm: { textStyle: "heading.md" },
};

/**
 * Defines the page recipe: a full-width page at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...FOLDING, flexShrink: "0" },
    actions: { ...ROW, flexWrap: "nowrap", gridArea: "actions", justifySelf: "end" },
    aside: {
      "&[data-folds=hide]": { lgDown: { display: "none" } },
      "&[data-sticky]": {
        alignSelf: "start",
        insetBlockStart: `calc(var(${SHELL_TOP}, 0px) + {spacing.gap.xl})`,
        position: "sticky",
      },
      gridArea: "aside",
      lg: { paddingInlineStart: "0" },
      minInlineSize: "0",
      paddingInline: `var(${GUTTER})`,
    },
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
      color: "fg.muted",
      gridArea: "description",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    folded: { ...FOLDED, alignItems: "center", flexShrink: "0", justifyContent: "center" },
    footer: {
      ...BAND,
      ...ROW,
      // The footer sticks to the bottom edge, so it resets the top inset of the shared rule.
      "&[data-sticky]": { ...STUCK, insetBlockEnd: "0", insetBlockStart: "auto" },
      gridArea: "footer",
    },
    /**
     * Lays the header out in three rows: the context, the title's row and the description.
     *
     * @remarks
     *   The rows are a gap one size smaller apart, so the trail, the title and the description read
     *   as three parts. The columns have no gap, because the parts beside the title belong to its
     *   line. Every part names its area, because the grid places a part without one in the first
     *   free cell.
     */
    header: {
      ...BAND,
      "&[data-sticky]": STUCK,
      alignItems: "center",
      [BEFORE_NAV]: { borderBlockEndWidth: "0" },
      display: "grid",
      gridArea: "header",
      gridTemplateAreas:
        '"context context context context" "leading title meta actions" "description description description description"',
      gridTemplateColumns: "auto auto minmax(0, 1fr) auto",
    },
    leading: { display: "flex", gridArea: "leading" },
    meta: { ...ROW, gridArea: "meta" },
    nav: {
      ...BAND,
      "&[data-sticky]": STUCK,
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gridArea: "nav",
      justifyContent: "space-between",
    },
    palette: { inlineSize: "var(--reference-width)", overflow: "clip" },
    picker: { ...truncate(), flex: "1", justifyContent: "space-between", minInlineSize: "0" },
    root: {
      display: "flex",
      flexDirection: "column",
      inlineSize: "100%",
      minBlockSize: "100%",
      minInlineSize: "0",
      [WITH_ASIDE]: { lg: BESIDE },
    },
    // Nested under `&`, so it overrides the hairline the strip's own variant sets. The variants are
    // in a later layer than the base, and a bare base rule lost to them.
    tabs: { "&": { borderBlockEndWidth: "0" } },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
    toolbar: { ...BAND, ...ROW, "&[data-sticky]": STUCK, gridArea: "toolbar" },
    trail: { color: "fg.muted", gridArea: "context", justifySelf: "start", minInlineSize: "0" },
  },
  className: CLASS,
  compoundVariants: [
    /**
     * Moves the meta of a folded header onto its own row under the title.
     *
     * @remarks
     *   The meta drops the start margin it has beside the title, so it starts where the title and
     *   the description start.
     */
    {
      css: {
        header: {
          gridTemplateAreas:
            '"context context context" "leading title actions" "meta meta meta" "description description description"',
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
        },
        meta: { marginInlineStart: "0" },
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
    "folded",
    "nav",
    "tabs",
    "picker",
    "palette",
    "toolbar",
    "body",
    "aside",
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
     */
    divided: {
      true: {
        footer: { ...divider("horizontal"), borderBlockStartWidth: "hairline" },
        header: { ...divider("horizontal"), borderBlockEndWidth: "hairline" },
        nav: { ...divider("horizontal"), borderBlockEndWidth: "hairline" },
        toolbar: { ...divider("horizontal"), borderBlockEndWidth: "hairline" },
      },
    },

    /**
     * Room at the page's inline edges, which every band reads.
     *
     * @remarks
     *   The default is the `xl` inset. A folded page sets the `sm` inset.
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
     * Whether the page is narrower than the `md` breakpoint, which the page sets from its own
     * width.
     *
     * @remarks
     *   A folded page has the `sm` gutter. The axis is not named `narrow`, because `measure` has a
     *   `narrow` value and two values of one name compile to one class.
     */
    folded: { true: { root: { [GUTTER]: "{spacing.inset.sm}" } } },

    /**
     * Size of the title, the description, the actions and the bands' padding.
     *
     * @remarks
     *   The page offers three sizes, because larger steps belong to a display heading. A section in
     *   the page reads this size too.
     */
    size: onSlots({
      actions: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      aside: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      banner: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      body: sizeVariants((size) => ({ paddingBlock: dense(`{spacing.inset.${size}}`) }), STEPS),
      context: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${size}}`), textStyle: `body.${below(size)}` }),
        STEPS,
      ),
      description: sizeVariants((size) => ({ textStyle: `body.${size}` }), STEPS),
      footer: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      header: sizeVariants(
        (size) => ({
          paddingBlockEnd: dense(`{spacing.gap.${size}}`),
          paddingBlockStart: dense(`{spacing.inset.${size}}`),
          rowGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        STEPS,
      ),
      leading: sizeVariants((size) => ({ marginInlineEnd: dense(`{spacing.gap.${size}}`) }), STEPS),
      meta: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          marginInlineStart: dense(`{spacing.gap.${size}}`),
        }),
        STEPS,
      ),
      nav: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      title: TITLES,
      toolbar: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
        }),
        STEPS,
      ),
    }),
  },
});
