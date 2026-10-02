/**
 * Recipe for a section of a page: a header over a body and a footer, plain or on a card.
 *
 * @remarks
 *   The header is a grid of two rows, so the title, the actions and the description are siblings
 *   placed by area name. The title's column shrinks, and the actions keep the end of the title's
 *   row at every width. The root sets four custom properties per size: the gap between the bands,
 *   the gap after the section before it, the card's inner room and the footer's block padding. A
 *   card's bands pad themselves from them, so a body with `data-bleed` drops its padding while the
 *   other bands keep theirs. A bleeding body overlaps the footer by one hairline, so a table's rule
 *   under its last row and the footer's rule render as one line. The room is the inset of the
 *   section's size, the inline padding of a table cell at that size, so a table in a bleeding body
 *   starts its first column under the title. The description stops at the reading measure and
 *   reads the body role one size smaller than the section. The title reads the heading role one
 *   size smaller, so a section reads as part of its page. `annotated` moves the header into a
 *   column beside the body and folds it back over the body while the root is `data-narrow`, which
 *   the component measures. An annotated card raises the body and the footer as one card and leaves
 *   the header on the page. A section scrolled to by its id stops one gap under the shell's sticky
 *   bars and the page's sticky bands. The recipe has no `palette` axis, because a section is layout
 *   on the page's surface and its content sets its own palettes, and no `effect` axis, because a
 *   section is not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

import { FOLDING } from "#folding/folding.ts";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "section";

/**
 * Selects a section that follows another section.
 */
const AFTER = `.${CLASS}__root + &`;

/**
 * Selects a band of a narrow section.
 */
const NARROW = `.${CLASS}__root[data-narrow] > &`;

/**
 * Selects the actions of a narrow section.
 */
const NARROW_ACTIONS = `.${CLASS}__root[data-narrow] > .${CLASS}__header > &`;

/**
 * Selects a band followed by the footer.
 */
const BEFORE_FOOTER = `&:has(+ .${CLASS}__footer)`;

/**
 * Custom property the root sets to the card's inner room, which every band's padding reads.
 */
export const ROOM = "--section-room";

/**
 * Custom property the root sets to the gap between its bands.
 */
const BANDS = "--section-bands";

/**
 * Custom property the root sets to the gap after the section before it.
 */
const APART = "--section-apart";

/**
 * Custom property the root sets to the block padding of a card's footer.
 */
const FOOTING = "--section-footing";

/**
 * Maps each size to the gap two sizes larger, between the bands.
 */
const AIRED = { lg: "2xl", md: "xl", sm: "lg" } as const;

/**
 * Maps each size to the gap three sizes larger, after the section before.
 */
const SPACED = { lg: "3xl", md: "2xl", sm: "xl" } as const;

/**
 * Styles a row that centres its items, wraps and shrinks.
 */
const ROW = { alignItems: "center", display: "flex", flexWrap: "wrap", minInlineSize: "0" };

/**
 * Defines the section recipe: a plain section at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...FOLDING, flexShrink: "0" },
    actions: {
      ...ROW,
      flexWrap: "nowrap",
      gridArea: "actions",
      justifySelf: "end",
      [NARROW_ACTIONS]: { paddingInlineStart: dense("{spacing.inset.sm}") },
      paddingInlineStart: dense("{spacing.inset.md}"),
    },
    body: { minInlineSize: "0" },
    description: {
      color: "fg.subtle",
      gridArea: "description",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    footer: {
      ...ROW,
      "& > :last-child:not(:first-child)": { marginInlineStart: "auto" },
      justifyContent: "space-between",
    },
    header: {
      alignItems: "center",
      display: "grid",
      gridTemplateAreas: '"title actions" "description description"',
      gridTemplateColumns: "minmax(0, 1fr) auto",
      minInlineSize: "0",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: `var(${BANDS})`,
      minInlineSize: "0",
      scrollMarginBlockStart:
        "calc(var(--app-shell-sticky-top, 0px) + var(--page-sticky-top, 0px) + {spacing.gap.lg})",
    },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
  },
  className: CLASS,
  compoundVariants: [
    {
      annotated: true,
      css: {
        actions: {
          justifySelf: "start",
          marginBlockStart: dense("{spacing.gap.md}"),
          paddingInlineStart: "0",
        },
        body: { gridArea: "body" },
        footer: { gridArea: "footer" },
        header: {
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          gridArea: "header",
        },
        root: {
          "&[data-narrow]": {
            gridTemplateAreas: '"header" "body" "footer"',
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateRows: "none",
          },
          alignItems: "start",
          display: "grid",
          gridTemplateAreas: '"header body" "header footer"',
          gridTemplateColumns: "minmax({sizes.xs}, 1fr) minmax(0, 2fr)",
          gridTemplateRows: "auto 1fr",
        },
      },
      name: "aside",
    },
    {
      css: {
        body: {
          "&:first-child": { paddingBlockStart: `var(${ROOM})` },
          "&[data-bleed]": {
            "&:first-child": { borderBlockStartWidth: "0" },
            [BEFORE_FOOTER]: { marginBlockEnd: "calc({borderWidths.hairline} * -1)" },
            borderBlockStartWidth: "hairline",
            borderColor: "border",
            padding: "0",
          },
          padding: `var(${ROOM})`,
          paddingBlockStart: "0",
        },
        footer: {
          borderBlockStartWidth: "hairline",
          borderColor: "border",
          paddingBlock: `var(${FOOTING})`,
          paddingInline: `var(${ROOM})`,
        },
        header: {
          "&:last-child": { paddingBlockEnd: `var(${ROOM})` },
          padding: `var(${ROOM})`,
          paddingBlockEnd: `var(${BANDS})`,
        },
        root: { ...surface(), gap: "0" },
      },
      name: "raised",
      variant: "surface",
    },
    {
      annotated: true,
      css: {
        body: {
          ...surface(),
          [BEFORE_FOOTER]: {
            borderBlockEndWidth: "0",
            borderEndEndRadius: "0",
            borderEndStartRadius: "0",
          },
          overflow: "clip",
          paddingBlockStart: `var(${ROOM})`,
        },
        footer: {
          ...surface(),
          [`.${CLASS}__body + &`]: { borderStartEndRadius: "0", borderStartStartRadius: "0" },
        },
        header: { [NARROW]: { marginBlockEnd: `var(${BANDS})` }, padding: "0" },
        root: {
          background: "none",
          borderWidth: "0",
          boxShadow: "none",
          overflow: "visible",
          rowGap: "0",
        },
      },
      name: "beside",
      variant: "surface",
    },
  ],
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Section(\.\w+)?$/u],
  slots: ["root", "header", "title", "description", "actions", "action", "body", "footer"],
  variants: {
    /**
     * Whether the header renders in a column beside the body.
     */
    annotated: { true: { root: { columnGap: dense("{spacing.gap.3xl}") } } },

    /**
     * Size of the title, the description, the gaps and the card's inner room.
     */
    size: onSlots({
      actions: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      description: sizeVariants(
        (size) => ({
          marginBlockStart: size === "lg" ? "{spacing.1}" : "{spacing.0.5}",
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
      footer: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({
          [APART]: dense(`{spacing.gap.${SPACED[size]}}`),
          [BANDS]: dense(`{spacing.gap.${AIRED[size]}}`),
          [FOOTING]: dense(`{spacing.inset.${below(size)}}`),
          [ROOM]: dense(`{spacing.inset.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      title: sizeVariants((size) => ({ textStyle: `heading.${below(size)}` }), ["sm", "md", "lg"]),
    }),

    /**
     * Look of the section: plain on the page, or raised as a card.
     *
     * @remarks
     *   Both looks keep the size's gap after a section before them. A plain section after another
     *   plain section renders a hairline in the middle of that gap. `surface` raises the section
     *   as a card and clips its content to the card's corners, so a body with `data-bleed` keeps
     *   them.
     */
    variant: {
      surface: { root: { [AFTER]: { marginBlockStart: `var(${APART})` }, overflow: "clip" } },

      plain: {
        root: {
          "& + &": {
            borderBlockStartWidth: "hairline",
            borderColor: "border",
            paddingBlockStart: `var(${APART})`,
          },
          [AFTER]: { marginBlockStart: `var(${APART})` },
        },
      },
    },
  },
});
