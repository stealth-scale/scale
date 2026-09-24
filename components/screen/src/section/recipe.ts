/**
 * Recipe for a section of a page: a header over a body and a footer, plain or on a card.
 *
 * @remarks
 *   The header is a grid of two rows, so the title, the actions and the description are siblings
 *   placed by area name. The title's column shrinks, and the actions keep the end of the title's
 *   row at every width. The root sets the card's inner room as `--section-room`, which every band's
 *   padding reads, so a body with `data-bleed` drops its padding while the other bands keep theirs.
 *   The description stops at the reading measure and reads the body role one size smaller than the
 *   section. The title reads the heading role one size smaller, so a section reads as part of its
 *   page. The gap between the bands is two gap sizes larger than the section's size. `annotated`
 *   moves the header into a column beside the body and folds it back over the body while the root
 *   is `data-narrow`, which the component measures. A section scrolled to by its id stops one gap
 *   under the shell's sticky bars. The recipe has no `palette` axis, because a section is layout
 *   on the page's surface and its content sets its own palettes, and no `effect` axis, because a
 *   section is not a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  onSlots,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

import { FOLDED, FOLDING } from "#folding/index.ts";

/**
 * Maps each size to the gap two sizes larger, between the bands.
 */
const AIRED = { lg: "2xl", md: "xl", sm: "lg" } as const;

/**
 * Custom property the root sets to the card's inner room, which every band's padding reads.
 */
export const ROOM = "--section-room";

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
    actions: { ...ROW, flexWrap: "nowrap", gridArea: "actions", justifySelf: "end" },
    body: { minInlineSize: "0" },
    description: {
      gridArea: "description",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    folded: { ...FOLDED, alignItems: "center", flexShrink: "0", justifyContent: "center" },
    footer: { ...ROW, justifyContent: "space-between" },
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
      minInlineSize: "0",
      scrollMarginBlockStart: "calc(var(--app-shell-sticky-top, 0px) + {spacing.gap.lg})",
    },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
  },
  className: "section",
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
          },
          alignItems: "start",
          display: "grid",
          gridTemplateAreas: '"header body" "header footer"',
          gridTemplateColumns: "minmax({sizes.xs}, 1fr) minmax(0, 2fr)",
          rowGap: "0",
        },
      },
      name: "aside",
    },
    {
      css: {
        body: {
          "&[data-bleed]": { ...divider("horizontal"), padding: "0" },
          padding: `var(${ROOM})`,
        },
        footer: {
          ...divider("horizontal"),
          borderBlockStartWidth: "hairline",
          padding: `var(${ROOM})`,
        },
        header: { padding: `var(${ROOM})`, paddingBlockEnd: "0" },
        root: { ...surface(), gap: "0" },
      },
      name: "raised",
      variant: "surface",
    },
  ],
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Section(\.\w+)?$/u],
  slots: [
    "root",
    "header",
    "title",
    "description",
    "actions",
    "action",
    "folded",
    "body",
    "footer",
  ],
  variants: {
    /**
     * Whether the header renders in a column beside the body.
     */
    annotated: { true: { root: { columnGap: dense("{spacing.gap.2xl}") } } },

    /**
     * Size of the title, the description, the gaps and the card's inner room.
     */
    size: onSlots({
      actions: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingInlineStart: dense(`{spacing.gap.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      description: sizeVariants(
        (size) => ({ textStyle: `body.${below(size)}` }),
        ["sm", "md", "lg"],
      ),
      footer: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${AIRED[size]}}`),
          [ROOM]: `{spacing.inset.${size}}`,
        }),
        ["sm", "md", "lg"],
      ),
      title: sizeVariants((size) => ({ textStyle: `heading.${below(size)}` }), ["sm", "md", "lg"]),
    }),

    /**
     * Look of the section: plain on the page, or raised as a card.
     *
     * @remarks
     *   `plain` sets a hairline above a section that follows another section, with the `2xl` gap
     *   on both sides of it. The selector reads the root's class on both sides, so a heading before
     *   the section gets no rule. `surface` raises the section as a card and clips its content to
     *   the card's corners, so a body with `data-bleed` keeps them.
     */
    variant: {
      surface: { root: { overflow: "clip" } },

      plain: {
        root: {
          "& + &": {
            borderBlockStartWidth: "hairline",
            borderColor: "border",
            marginBlockStart: dense("{spacing.gap.2xl}"),
            paddingBlockStart: dense("{spacing.gap.2xl}"),
          },
        },
      },
    },
  },
});
