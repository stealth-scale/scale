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
 *   in a length, so the line a reader follows holds its count at every type size.
 *   `annotated` moves the header into a column beside the body, which is how a settings page reads.
 *   It folds back over the body on a narrow root, measured by the component and written as
 *   `data-narrow`, so a consumer writes no breakpoint.
 */

import {
  defineSlotRecipe,
  divider,
  onSlots,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

import { FOLDED, FOLDING } from "#folding/index.ts";

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
      color: "fg.muted",
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
    root: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    title: { gridArea: "title", minInlineSize: "0", overflowWrap: "anywhere" },
  },
  className: "section",
  compoundVariants: [
    {
      annotated: true,
      css: {
        actions: { justifySelf: "start", marginBlockStart: "gap.md", paddingInlineStart: "0" },
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
          borderBlockStartWidth: "sm",
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
    annotated: { true: { root: { columnGap: "gap.2xl" } } },

    size: onSlots({
      actions: sizeVariants(
        (size) => ({ gap: `gap.${size}`, paddingInlineStart: `gap.${size}` }),
        ["sm", "md", "lg"],
      ),
      description: sizeVariants((size) => ({ textStyle: `body.${size}` }), ["sm", "md", "lg"]),
      footer: sizeVariants((size) => ({ gap: `gap.${size}` }), ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({ gap: `gap.${size}`, [ROOM]: `{spacing.inset.${size}}` }),
        ["sm", "md", "lg"],
      ),
      title: sizeVariants((size) => ({ textStyle: `heading.${size}` }), ["sm", "md", "lg"]),
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
      plain: {
        root: {
          "& + &": {
            borderBlockStartWidth: "sm",
            borderColor: "border",
            marginBlockStart: "gap.2xl",
            paddingBlockStart: "gap.2xl",
          },
        },
      },
      surface: { root: { overflow: "clip" } },
    },
  },
});
