/**
 * Declares the code block slot recipe: a bordered panel with a header bar over a horizontally
 * scrolling passage of monospaced code, one ink per token kind.
 *
 * @remarks
 *   Every value is a semantic token, so the recipe resolves against the colour mode the root sets
 *   on the panel. The token inks select on the `data-token` attribute the code part writes and read
 *   the theme's `code` family. Finer highlighter kinds map to that set: a literal takes the number
 *   ink, a property the attribute ink, a selector the type ink, and meta the comment ink. The
 *   recipe has no `palette` axis, because the inks come from the `code` family, and no `effect`
 *   axis, because a code block is running content and not a surface that asks for attention.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Lists the sizes the block offers, which match the theme's code text styles.
 */
const STEPS = ["sm", "md"] as const;

/**
 * Maps each token kind to its ink, keyed on the attribute the code part writes.
 */
const INKS: SystemStyleObject = {
  "& [data-token=attr]": { color: "code.attr" },
  "& [data-token=comment]": { color: "code.comment" },
  "& [data-token=deleted]": { color: "code.deleted" },
  "& [data-token=function]": { color: "code.function" },
  "& [data-token=heading]": { fontWeight: "semibold" },
  "& [data-token=inserted]": { color: "code.inserted" },
  "& [data-token=keyword]": { color: "code.keyword" },
  "& [data-token=link]": { color: "fg.link" },
  "& [data-token=literal]": { color: "code.number" },
  "& [data-token=meta]": { color: "code.comment" },
  "& [data-token=number]": { color: "code.number" },
  "& [data-token=operator]": { color: "fg.muted" },
  "& [data-token=property]": { color: "code.attr" },
  "& [data-token=selector]": { color: "code.type" },
  "& [data-token=string]": { color: "code.string" },
  "& [data-token=tag]": { color: "code.tag" },
  "& [data-token=type]": { color: "code.type" },
};

/**
 * Styles a code block at the md size.
 */
export const recipe = defineSlotRecipe({
  base: {
    /**
     * The code is as wide as its longest line and never narrower than the scrolling region, so its
     * box contains every line and the region scrolls it.
     */
    code: {
      ...INKS,
      display: "block",
      fontFamily: "mono",
      inlineSize: "max-content",
      minInlineSize: "full",
      whiteSpace: "pre",
    },
    /**
     * The scrolling region renders no outline of its own. The root renders the ring while the
     * region has focus.
     */
    content: { _focusVisible: { outlineStyle: "none" }, margin: "0", overflowX: "auto" },
    control: { alignItems: "center", display: "flex", flexShrink: "0" },
    header: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
    },
    /**
     * The root renders the focus ring outside the panel while the scrolling region has focus.
     *
     * @remarks
     *   The root clips its content, and Firefox clips an outline on a scroll container to its top
     *   edge, so an outline on the region itself shows as one line.
     */
    root: {
      "&:has(.code-block__content:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
      background: "bg",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "hairline",
      color: "fg",
      colorPalette: "neutral",
      overflow: "hidden",
    },
    title: {
      color: "fg.muted",
      minInlineSize: "0",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  className: "code-block",
  defaultVariants: { size: "md" },
  jsx: [/^CodeBlock(\.\w+)?$/u],
  slots: ["root", "header", "title", "control", "content", "code"],
  variants: {
    /**
     * Code text style, content inset and header spacing, with the title one size smaller than the
     * code.
     */
    size: onSlots({
      code: sizeVariants((size) => ({ textStyle: `code.${size}` }), STEPS),
      content: sizeVariants((size) => ({ padding: dense(`{spacing.inset.${size}}`) }), STEPS),
      header: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInlineEnd: dense(`{spacing.gap.${size}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      title: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), STEPS),
    }),
  },
});
