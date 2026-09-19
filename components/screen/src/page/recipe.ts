/**
 * Defines the styles a page is drawn with.
 *
 * @remarks
 *   The root is a column at least as tall as what holds it, so a footer sits at the foot of a short
 *   page. Every band runs edge to edge, so a band that sticks runs its fill and its hairline across
 *   the whole width, and what each band holds starts at the gutter. A page with a measure stops
 *   there and leaves the spare room at the end, which is how an application reads, or centres it
 *   where `align` asks.
 *   The header is a grid of three rows, so the context above the title, what leads it, the title,
 *   the marks beside it, the actions and the description are written flat and placed by name. A
 *   part left out takes no room. The title's column is the one that gives, so its words wrap while
 *   the actions keep the end of its row.
 *   The gutter and the measure are properties the root states and every band reads, so one value
 *   moves all of them and a band that bleeds reads the same numbers to line its own cells up.
 *   Narrowness is measured on the root, not on the window, so a page beside an open sidebar folds
 *   on its own room.
 */

import {
  defineSlotRecipe,
  divider,
  onSlots,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

import { FOLDED, FOLDING } from "#folding/folding.ts";

/**
 * The property the root states the room at the page's inline edges in.
 */
export const GUTTER = "--page-gutter";

/**
 * The property the root states how wide the page reads in.
 */
export const MEASURE = "--page-measure";

/**
 * Writes what every band shares: edge to edge, starting at the gutter and stopping at the measure.
 */
const BAND = {
  flexShrink: "0",
  minInlineSize: "0",
  paddingInlineEnd: `max(var(${GUTTER}), calc(100% - var(${MEASURE}, 100%) - var(${GUTTER})))`,
  paddingInlineStart: `var(${GUTTER})`,
};

/**
 * Writes what a band told to stick shares: it stays put, over the page and filled.
 *
 * @remarks
 *   The fill is not optional. A band the page scrolls through is not sticking to anything a reader
 *   can see, so a band that sticks takes the page's own surface.
 */
const STUCK = { background: "bg", position: "sticky", zIndex: "1" };

/**
 * Writes a row that wraps: laid across, centred on the middle, and able to shrink.
 */
const ROW = { alignItems: "center", display: "flex", flexWrap: "wrap", minInlineSize: "0" };

/**
 * The class this recipe is compiled under, which a selector reaching across bands reads.
 *
 * @remarks
 *   The binding writes one class per band, `page__nav`, and stamps no attribute naming the band. A
 *   rule that selects another band therefore selects the class, and builds it from this constant so
 *   the two cannot drift.
 */
const CLASS = "page";

/**
 * Selects a band with the navigation under it, which carries the hairline then.
 */
const BEFORE_NAV = `&:has(+ .${CLASS}__nav)`;

/**
 * The steps a page is read at, which a section inside it reads too.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * The heading role the title is set in at each step, one step above the section's at the same
 * step.
 *
 * @remarks
 *   A page's title is the one heading above every section on it. Set in the same role as a
 *   section's title, the two read as the same level and the outline the headings draw is flat.
 */
const TITLES = {
  lg: { textStyle: "heading.xl" },
  md: { textStyle: "heading.lg" },
  sm: { textStyle: "heading.md" },
};

/**
 * Draws a full-width page at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...FOLDING, flexShrink: "0" },
    actions: { ...ROW, flexWrap: "nowrap", gridArea: "actions", justifySelf: "end" },
    aside: { minInlineSize: "0" },
    banner: { ...BAND, flexShrink: "0" },
    body: {
      ...BAND,
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minBlockSize: "0",
    },
    context: { ...ROW, gridArea: "context" },
    description: {
      color: "fg.muted",
      gridArea: "description",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    folded: { ...FOLDED, alignItems: "center", flexShrink: "0", justifyContent: "center" },
    footer: { ...BAND, ...ROW, "&[data-sticky]": { ...STUCK, insetBlockEnd: "0" } },
    header: {
      ...BAND,
      "&[data-sticky]": STUCK,
      alignItems: "center",
      [BEFORE_NAV]: { borderBlockEndWidth: "0" },
      display: "grid",
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
    },
    tabs: { borderBlockEndWidth: "0" },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
    toolbar: { ...BAND, ...ROW, "&[data-sticky]": STUCK },
    trail: { color: "fg.muted" },
  },
  className: CLASS,
  compoundVariants: [
    {
      css: {
        header: {
          gridTemplateAreas:
            '"context context context" "leading title actions" "meta meta meta" "description description description"',
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
        },
      },
      folded: true,
      name: "stacked",
    },
  ],
  defaultVariants: { align: "start", divided: true, gutter: "md", measure: "full", size: "md" },
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
     * Where the column sits when the measure is narrower than the room it is given.
     */
    align: {
      center: { root: { marginInline: "auto" } },
      start: { root: { marginInline: "0" } },
    },

    /**
     * Whether a hairline parts the bands from one another.
     */
    divided: {
      true: {
        footer: { ...divider("horizontal"), borderBlockStartWidth: "sm" },
        header: { ...divider("horizontal"), borderBlockEndWidth: "sm" },
        nav: { ...divider("horizontal"), borderBlockEndWidth: "sm" },
        toolbar: { ...divider("horizontal"), borderBlockEndWidth: "sm" },
      },
    },

    /**
     * The room at the page's inline edges, which every band reads.
     */
    gutter: onSlots({ root: sizeVariants((size) => ({ [GUTTER]: `{spacing.inset.${size}}` })) }),

    /**
     * How wide the column reads.
     *
     * @remarks
     *   Named for the measure rather than for the width, because a styled element already takes
     *   `width` as a style prop and an axis of that name could never be stated per breakpoint.
     */
    measure: {
      full: { root: { [MEASURE]: "100%" } },
      narrow: { root: { [MEASURE]: "{sizes.3xl}" } },
      wide: { root: { [MEASURE]: "{sizes.7xl}" } },
    },

    /**
     * Whether the page has measured itself as too narrow for a header laid out in one row.
     *
     * @remarks
     *   A folded page also pulls its gutter in by one step, because the room that reads as generous
     *   beside a wide column reads as waste beside a narrow one. The component states this from
     *   what it measured. A consumer never sets it.
     *   Named `folded` rather than `narrow` because `measure` already offers `narrow`, and two
     *   values of that name on the root compile to one class the later of them wins.
     */
    folded: { true: { root: { [GUTTER]: "{spacing.inset.sm}" } } },

    /**
     * How large the page draws what names it, and how much room its bands keep.
     *
     * @remarks
     *   Three steps rather than the whole scale, because a page is read at the size a reader reads
     *   a page at and the steps beyond these belong to a display heading. A section inside a page
     *   reads this too, so a page states the size once for everything on it.
     */
    size: onSlots({
      actions: sizeVariants(
        (size) => ({ gap: `gap.${size}`, paddingInlineStart: `inset.${size}` }),
        STEPS,
      ),
      banner: sizeVariants((size) => ({ paddingBlock: `inset.${size}` }), STEPS),
      body: sizeVariants((size) => ({ paddingBlock: `inset.${size}` }), STEPS),
      context: sizeVariants((size) => ({ gap: `gap.${size}` }), STEPS),
      description: sizeVariants((size) => ({ textStyle: `body.${size}` }), STEPS),
      footer: sizeVariants(
        (size) => ({ gap: `gap.${size}`, paddingBlock: `inset.${size}` }),
        STEPS,
      ),
      header: sizeVariants((size) => ({ paddingBlock: `inset.${size}` }), STEPS),
      leading: sizeVariants((size) => ({ marginInlineEnd: `gap.${size}` }), STEPS),
      meta: sizeVariants(
        (size) => ({ gap: `gap.${size}`, marginInlineStart: `gap.${size}` }),
        STEPS,
      ),
      nav: sizeVariants((size) => ({ gap: `gap.${size}` }), STEPS),
      title: TITLES,
      toolbar: sizeVariants((size) => ({ gap: `gap.${size}`, paddingBlock: `gap.${size}` }), STEPS),
    }),
  },
});
