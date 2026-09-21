/**
 * Styles a code block as a bordered panel with a header bar above a scrolling monospaced passage,
 * coloured one shade per token kind.
 *
 * @remarks
 *   Every value here is a semantic token, so the whole recipe resolves against whichever colour
 *   mode the root pins the panel to, and a theme that moves its modes moves every code block with
 *   it. The token colours select on the `data-token` attribute the code part writes and draw from
 *   the theme's `code` family, with diff additions and removals taking their own colours. The
 *   highlighter's finer classes are folded into that coarse set: a literal takes the number
 *   colour, a property the attribute colour, a selector the type colour, and meta the comment
 *   colour.
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
 * The two size steps the block offers, matching the steps of the theme's code text styles.
 */
const STEPS = ["sm", "md"] as const;

/**
 * The colour rule for each token kind, keyed on the attribute the code part writes.
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
 * The `code-block` slot recipe over its six slots, medium by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    code: { ...INKS, display: "block", fontFamily: "mono", whiteSpace: "pre" },
    content: { margin: "0", overflowX: "auto" },
    control: { alignItems: "center", display: "flex", flexShrink: "0" },
    header: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
    },
    root: {
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
     * The text size of the code, with the title set one step below it.
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
