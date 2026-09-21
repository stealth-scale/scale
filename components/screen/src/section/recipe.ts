/**
 * Defines the styles a section of a page is drawn with.
 *
 * @remarks
 *   Seven parts. The root stacks a header, a body and a footer. The header is a grid of two rows,
 *   so the title, the actions beside it and the description under it are written flat and placed by
 *   name: the title's column is the one that gives, and the actions keep the end of its row at
 *   every width.
 *   The room a card keeps is stated once on the root as a property every band reads, so a body told
 *   to bleed drops the padding and runs to the card's edges while its neighbours keep theirs. One
 *   value moves all of them.
 *   The description stops at the reading measure, which the theme states in characters rather than
 *   in a length, so the line a reader follows holds its count at every type size. It is set a text
 *   step below the section in the page's own ink, and the title a heading step below the page's,
 *   so a section reads as a part of the page it is on rather than as a page of its own. The bands
 *   are parted by the gap two steps above the size, because a title needs more air below it than
 *   two controls need between them.
 *   `annotated` moves the header into a column beside the body, which is how a settings page reads.
 *   It folds back over the body on a narrow root, measured by the component and written as
 *   `data-narrow`, so a consumer writes no breakpoint.
 *   A section scrolled to by its id stops a gap under the shell's pinned bars rather than under
 *   them, so a title reached from a table of contents is read rather than covered.
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
 * Maps each size to the gap two steps above it, which parts the header from the body.
 */
const AIRED = { lg: "2xl", md: "xl", sm: "lg" } as const;

/**
 * The property the root states the room a card keeps in, which every band reads.
 */
export const ROOM = "--section-room";

/**
 * Writes a row that wraps: laid across, centred on the middle, and able to shrink.
 */
const ROW = { alignItems: "center", display: "flex", flexWrap: "wrap", minInlineSize: "0" };

/**
 * Draws a plain section at the middle size, its header over its body.
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
     * Whether the header stands in a column beside the body rather than over it.
     */
    annotated: { true: { root: { columnGap: dense("{spacing.gap.2xl}") } } },

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
     * Whether the section is raised on the page as a card or drawn plain against it.
     *
     * @remarks
     *   A plain section draws one hairline, above itself, and only where another section stands
     *   before it. The rule reads the root's own class on both sides, so it never fires against a
     *   heading or anything else the page put there. The hairline keeps one large gap on either
     *   side, so two sections read as two rather than as one list with a line through it.
     *   A card clips what it holds to its corners, so a body told to bleed runs to the edge without
     *   squaring the corner it runs into.
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
