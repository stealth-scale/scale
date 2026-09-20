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
 *   The place axis says how wide the box is and where the drawing sits in it. It fits the drawing
 *   until a caller asks for more, because a box is there to frame a component and a box wider than
 *   the component frames the room beside it instead: a toolbar of three controls in a box that
 *   filled a grid column read as a control adrift in a panel. The other four fill the cell, which
 *   is what a column of boxes the same width asks for, and place the drawing in it.
 *   Fitting is also what keeps a matrix of a control at every size on one card. A control that
 *   fills whatever it is given asks its column for the width it would take stretched, so eight
 *   fields drawn at `start` asked for more than the card holds and the last three fell off the
 *   edge. A scene whose component should reach the far side of its column states `place="start"`
 *   itself.
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
 * Draws a sample with nothing round it, at the start of its box, until a caller says otherwise.
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
  defaultVariants: { place: "fit", variant: "plain" },
  jsx: [/^Sample$/u],
  slots: ["root", "caption", "body"],
  variants: {
    /**
     * How wide the box is, and where the drawing sits in it.
     */
    place: {
      center: { body: { inlineSize: "full", justifyContent: "center" } },
      end: { body: { inlineSize: "full", justifyContent: "flex-end" } },
      fit: { body: { inlineSize: "fit-content" } },
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
      outline: { body: { ...ROOM, ...EDGE } },
      plain: { body: { background: "transparent", borderWidth: "0", padding: "0" } },
      subtle: { body: { ...ROOM, background: "bg.subtle" } },
      surface: { body: { ...ROOM, ...EDGE, background: "bg.subtle" } },
    },
  },
});
