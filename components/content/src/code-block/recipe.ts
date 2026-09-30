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
 *   axis, because a code block is running content and not a surface that asks for attention. The
 *   slots of a diff take their styles from `diff-styles.ts` and the code's inks.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import { DIFF } from "#code-block/diff-styles.ts";

/**
 * Lists the sizes the block offers, which match the theme's code text styles.
 */
const STEPS = ["sm", "md"] as const;

/**
 * Custom property the scroll area's root reads for the style of its focus ring.
 */
const RING_STYLE = "--scroll-area-ring-style";

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
    ...DIFF,
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
     * The `pre` inside the scroll area. Its padding is the code's inset, which scrolls with the
     * code.
     */
    content: { margin: "0" },
    control: { alignItems: "center", display: "flex", flexShrink: "0" },
    diff: { ...DIFF.diff, ...INKS },
    header: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
    },
    /**
     * The root renders the focus ring outside the panel while the scrolling region has focus.
     *
     * @remarks
     *   The root clips its content, so a ring on the scroll area inside it would be cut off. The
     *   root sets the scroll area's ring style to `none` and renders the ring itself.
     */
    root: {
      "&:has(.code-block__viewport:focus-visible)": {
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
      [RING_STYLE]: "none",
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
  slots: [
    "root",
    "header",
    "title",
    "control",
    "viewport",
    "content",
    "code",
    "diff",
    "line",
    "number",
    "mark",
    "text",
    "change",
    "fold",
    "filler",
    "empty",
    "stat",
  ],
  variants: {
    /**
     * Code text style, content inset and header spacing, with the title one size smaller than the
     * code.
     */
    size: onSlots({
      code: sizeVariants((size) => ({ textStyle: `code.${size}` }), STEPS),
      content: sizeVariants((size) => ({ padding: dense(`{spacing.inset.${size}}`) }), STEPS),
      diff: sizeVariants((size) => ({ textStyle: `code.${size}` }), STEPS),
      empty: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `label.${below(size)}`,
        }),
        STEPS,
      ),
      fold: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `label.${below(size)}`,
        }),
        STEPS,
      ),
      header: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${size}}`),
          paddingInlineEnd: dense(`{spacing.gap.${size}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
      stat: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), STEPS),
      title: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), STEPS),
    }),
  },
});
