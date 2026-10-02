/**
 * Declares the Markdown slot recipe: the column a document's blocks stack in, and the few elements
 * no component of the library renders.
 *
 * @remarks
 *   Every block is a component of the library, which styles itself, so the recipe sets the rhythm
 *   between blocks and nothing inside them. The root is a column as wide as its container up to the
 *   theme's `prose` measure, so a document that streams in keeps its width. One gap separates the
 *   blocks, and a heading after another block takes a gap more above it. Only the caret reads
 *   `:last-child`, and no rule reads `:has()` or `:empty`, so a block appended while text streams
 *   in restyles no block before it and moves the caret to its own end. The caret is an empty box
 *   drawn after the last block while the document is `aria-busy`, pulsing at the theme's ambient
 *   pace, so a screen reader reads nothing for it. A table cell whose column the author centred
 *   reads `data-align=center`. Links render inline, so a link wraps with the words around it and a
 *   footnote reference keeps a box to press. A task's box is a hairline square the recipe renders
 *   where the caller passes no glyph, filled while the task is done, and filled with `CanvasText`
 *   under forced colors, which remove every background.
 */

import {
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Lists the sizes a document offers: a comment's and a page's.
 */
const STEPS = ["sm", "md"] as const;

/**
 * Centres the cells of a column the author centred, which the table's own recipe cannot know.
 */
const CENTRED: SystemStyleObject = {
  "& .table__cell[data-align=center], & .table__columnHeader[data-align=center]": {
    textAlign: "center",
  },
};

/**
 * Sets every link of the document inline, so a link wraps with the words around it and a
 * footnote reference keeps a box inside its `sup`, whose line height is 0.
 */
const INLINE: SystemStyleObject = { "& .link": { display: "inline" } };

/**
 * Draws the caret after the last block of a document whose text still arrives.
 *
 * @remarks
 *   The box has no text, so a screen reader reads nothing for it. It is painted in the text's own
 *   ink, and in `CanvasText` under forced colors, which remove every background.
 */
const CARET: SystemStyleObject = {
  "&[aria-busy=true] > :last-child::after": {
    _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
    animationStyle: "pulse",
    backgroundColor: "currentcolor",
    blockSize: "1em",
    content: '""',
    display: "inline-block",
    inlineSize: "0.5em",
    marginInlineStart: "0.125em",
    verticalAlign: "text-bottom",
  },
};

/**
 * Styles a Markdown document at the md size.
 */
export const recipe = defineSlotRecipe({
  base: {
    deleted: { color: "fg.muted", textDecorationLine: "line-through" },
    flow: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    footnotes: { color: "fg.muted", display: "flex", flexDirection: "column" },
    image: {
      blockSize: "auto",
      borderRadius: "l2",
      maxInlineSize: "full",
      verticalAlign: "middle",
    },
    reference: { lineHeight: "0" },
    root: {
      ...CARET,
      ...CENTRED,
      ...INLINE,
      color: "fg",
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      maxInlineSize: "prose",
      minInlineSize: "0",
    },
    taskMark: {
      _highContrast: {
        "&[data-checked]": { background: "CanvasText", forcedColorAdjust: "none" },
      },
      "&[data-checked]": { background: "colorPalette.solid", borderColor: "colorPalette.solid" },
      borderColor: "border.emphasized",
      borderRadius: "l1",
      borderWidth: "hairline",
      boxSize: "0.875em",
      colorPalette: "primary",
      flexShrink: "0",
    },
  },
  className: "markdown",
  defaultVariants: { size: "md" },
  jsx: ["Markdown"],
  slots: ["root", "flow", "image", "deleted", "reference", "footnotes", "taskMark"],
  variants: {
    /**
     * Body text style and block gaps: a comment's at `sm`, a page's at `md`.
     */
    size: onSlots({
      flow: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      footnotes: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          textStyle: size === "md" ? "body.sm" : "body.xs",
        }),
        STEPS,
      ),
      root: sizeVariants(
        (size) => ({
          "& > :is(h1, h2, h3, h4, h5, h6):not(:first-child)": {
            marginBlockStart: dense(`{spacing.gap.${size}}`),
          },
          gap: dense(`{spacing.gap.${size === "md" ? "lg" : "md"}}`),
          textStyle: `body.${size}`,
        }),
        STEPS,
      ),
    }),
  },
});
