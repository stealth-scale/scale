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
 *   A page holding an aside becomes a grid from the large breakpoint up: every band across the
 *   top and the foot, and the body beside the aside between them, the aside as wide as what it
 *   holds. That is read off the window, because the aside is a rail of the kind a docs page keeps
 *   beside its text, and the width the rail is worth its room at is the one the window gives the
 *   whole screen. Below it the root stays a column and the aside stacks under the body, or leaves
 *   the page where it says it folds to nothing. An aside told to stick keeps to the top of its
 *   row, under the shell's pinned bars, while the body scrolls past.
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
 * The property the root states the room at the page's inline edges in.
 */
export const GUTTER = "--page-gutter";

/**
 * The property the root states how wide the page reads in.
 */
export const MEASURE = "--page-measure";

/**
 * The property a band reads the room it leaves before the measure from.
 *
 * @remarks
 *   A band runs edge to edge so its surface is full bleed, and its padding is what holds the
 *   content to the measure. The alignment axis writes this property and every band reads it, so
 *   the header, the body and the footer stay in one column whichever way the page is aligned.
 */
const LEAD = "--page-lead";

/**
 * Writes what every band shares: edge to edge, with the content held to the measure by padding.
 */
const BAND = {
  flexShrink: "0",
  minInlineSize: "0",
  paddingInlineEnd: `max(var(${GUTTER}), calc(100% - var(${MEASURE}, 100%) - var(${LEAD}, var(${GUTTER}))))`,
  paddingInlineStart: `var(${LEAD}, var(${GUTTER}))`,
};

/**
 * The property the shell states the height of its pinned bars in, which anything that sticks
 * keeps under.
 */
const SHELL_TOP = "--app-shell-sticky-top";

/**
 * Writes what a band told to stick shares: it stays put at the top, over the page and filled.
 *
 * @remarks
 *   The fill is not optional. A band the page scrolls through is not sticking to anything a reader
 *   can see, so a band that sticks takes the page's own surface.
 *   The edge is not optional either. A sticky element whose inset is `auto` sticks to nothing at
 *   all, which is what every band told to stick did: they were positioned and never moved.
 *   The edge is the shell's own, so a band keeps under whatever bars the shell has pinned rather
 *   than sliding behind them.
 *   The layer is the `sticky` token rather than a number of its own, which is what the shell pins
 *   its own bars at. A band and a bar that stick to the same edge are one order, and two scales
 *   for it means a number here has to be read against a token there every time either moves.
 */
const STUCK = {
  background: "bg",
  insetBlockStart: `var(${SHELL_TOP}, 0px)`,
  position: "sticky",
  zIndex: "sticky",
};

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
 * Selects a root holding an aside, which lays its bands out as a grid from the large breakpoint.
 */
const WITH_ASIDE = `&:has(> .${CLASS}__aside)`;

/**
 * Writes the rows and the columns of a page holding an aside: every band across, and the body
 * beside the aside.
 *
 * @remarks
 *   The body's row takes the height the page has left over and every other row takes its content's.
 *   The root is at least as tall as the shell's main, and a grid shares its spare height between
 *   every `auto` row, so a short page opened its empty bands as blank rows and stretched the header
 *   until the trail, the title and the description stood a screen apart.
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
    context: { ...ROW, gridArea: "context" },
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
      // The one band that sticks to the foot, so it takes the edge back off the shared rule.
      "&[data-sticky]": { ...STUCK, insetBlockEnd: "0", insetBlockStart: "auto" },
      gridArea: "footer",
    },
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
    // Written against the element rather than bare, so it beats the line a strip's own variant
    // draws. A slot's base and a recipe's variants are separate layers and the variant is the later
    // of the two, so a bare rule here lost to it and the band drew one line under the strip's.
    tabs: { "&": { borderBlockEndWidth: "0" } },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
    toolbar: { ...BAND, ...ROW, "&[data-sticky]": STUCK, gridArea: "toolbar" },
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
     * Where the column sits when the measure is narrower than the room it is given.
     *
     * @remarks
     *   The alignment moves the room a band leaves before its content, not the root. The root runs
     *   edge to edge so a band's surface is full bleed, and automatic margins on a full-width root
     *   move nothing: a centred page and a start-aligned one measured the same 1,846-pixel root
     *   with the content held at the start of both.
     */
    align: {
      start: { root: { [LEAD]: `var(${GUTTER})` } },

      center: {
        root: { [LEAD]: `max(var(${GUTTER}), calc((100% - var(${MEASURE}, 100%)) / 2))` },
      },
    },

    /**
     * Whether a hairline parts the bands from one another.
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
     * The room at the page's inline edges, which every band reads.
     *
     * @remarks
     *   A page opens at the extra-large inset, because a page is read at arm's length and its
     *   bands want more room at the edge than a control wants inside it. A folded page pulls the
     *   gutter in.
     */
    gutter: onSlots({ root: sizeVariants((size) => ({ [GUTTER]: `{spacing.inset.${size}}` })) }),

    /**
     * How wide the column reads.
     *
     * @remarks
     *   Named for the measure rather than for the width, because a styled element already takes
     *   `width` as a style prop and an axis of that name could never be stated per breakpoint.
     *   The two measures are the theme's page sizes, so a theme moves them without a recipe.
     */
    measure: {
      full: { root: { [MEASURE]: "100%" } },
      narrow: { root: { [MEASURE]: "{sizes.page.narrow}" } },
      wide: { root: { [MEASURE]: "{sizes.page.wide}" } },
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
