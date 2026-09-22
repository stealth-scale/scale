/**
 * States what a sample is: one drawing of a component, captioned with the value it was drawn for
 * and held in a box the specimen chooses the look of.
 *
 * @remarks
 *   The caption sits above the box rather than inside it, so a look drawn round the drawing frames
 *   the component and not the words that name it. A matrix and a board both draw their cells as
 *   samples, so one page that uses each reads the same in both.
 *   The looks are written here from semantic tokens rather than read off the theme's flat layer
 *   styles. Every flat look states an ink, and a sample holds whatever a specimen puts in it, so a
 *   look that moved the ink would move the ink of the component being shown.
 *   The place axis says where the drawing sits in the cell. The box fills the cell whatever the
 *   value, and the value places the drawing inside it.
 *   No value shrinks the box to the drawing. A box sized to its content is a containing block the
 *   width of that content, so a component that measures itself against the room it is given has
 *   nothing to measure against: the container drawn at every one of its fourteen measures came out
 *   at one width on 2026-09-22, the width of the sentence inside it. The earlier default fitted
 *   the drawing, to keep a box drawn round a toolbar from framing the room beside it, and no page
 *   in the library ever drew a box round a sample. A page that wants one back wants it on the look
 *   that draws the box, not on the place.
 *   The span is for a sample laid out on a board, which is the library's grid. A sample outside a
 *   grid is unaffected by it.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  spanCounts,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Writes the edge a drawn look carries.
 */
const EDGE = { borderColor: "border", borderStyle: "solid", borderWidth: "hairline" };

/**
 * Writes the room a look that draws a box leaves round the component inside it.
 *
 * @remarks
 *   A look that draws nothing leaves no room either, so a plain sample takes exactly the width and
 *   the height of what it holds and a page of plain samples is spaced by the board alone.
 */
const ROOM: SystemStyleObject = {
  borderRadius: "l2",
  padding: dense("{spacing.inset.md}"),
};

/**
 * Draws a sample with nothing round it, at the start of its cell, until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    body: {
      alignItems: "flex-start",
      display: "flex",
      maxInlineSize: "full",
      minInlineSize: "0",
    },
    caption: { maxInlineSize: "full" },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      maxInlineSize: "full",
      minInlineSize: "0",
    },
  },
  className: "sample",
  defaultVariants: { place: "start", variant: "plain" },
  jsx: [/^Sample$/u],
  slots: ["root", "caption", "body"],
  variants: {
    /**
     * Where the drawing sits in the cell.
     */
    place: {
      center: { body: { inlineSize: "full", justifyContent: "center" } },
      end: { body: { inlineSize: "full", justifyContent: "flex-end" } },
      start: { body: { inlineSize: "full", justifyContent: "flex-start" } },
      stretch: { body: { alignItems: "stretch", flexDirection: "column", inlineSize: "full" } },
    },

    /**
     * How many of a board's columns the sample reaches across.
     */
    span: { ...onSlot("root", spanCounts()), full: { root: { gridColumn: "1 / -1" } } },

    /**
     * How the box round the drawing is drawn.
     */
    variant: {
      subtle: { body: { ...ROOM, background: "bg.subtle" } },

      surface: { body: { ...ROOM, ...EDGE, background: "bg.subtle" } },

      outline: { body: { ...ROOM, ...EDGE } },

      plain: { body: { background: "transparent", borderWidth: "0", padding: "0" } },
    },
  },
});
