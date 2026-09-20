/**
 * States what a code block is: a panel holding a passage of code set in the code role, headed by
 * what the code is and whatever controls act on it, with each kind of token in its own ink.
 *
 * @remarks
 *   Six parts. The root is the panel, the header runs across its top holding the title and the
 *   control, the control holds whatever a page puts there, such as a clipboard trigger drawn as a
 *   button, the content is the box the code scrolls in, and the code is the passage itself. The
 *   panel is drawn in the dark mode whatever the page is in, which the root writes as an
 *   attribute, so every value here is a semantic token and resolves to the mode the panel is in:
 *   the page's surface, its ink, its lines and the code family for the tokens. A theme that moves
 *   its modes moves every code block.
 *   A token's kind is written as a data attribute by the code part, and the rules here read it,
 *   each from the code family the theme states: a keyword, a string, a number, a function, a type,
 *   a tag, an attribute and a comment in the theme's own inks for them, a change in the red or the
 *   green of the diff it is. The highlighter's finer kinds fold into those: a literal reads as a
 *   number, a property as an attribute, a selector as a type, and meta as a comment.
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
 * The steps a code block is set at, which read the code role at the same step.
 */
const STEPS = ["sm", "md"] as const;

/**
 * Inks each kind of token, selected by the attribute the code part writes.
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
 * Draws a code block at the middle size until a caller says otherwise.
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
     * How big the code is set, which the header reads a step down.
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
