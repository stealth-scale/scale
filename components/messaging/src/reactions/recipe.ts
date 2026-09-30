/**
 * Declares the reactions' slot recipe: a row of reactions under a message, and the choices of the
 * picker that adds one.
 *
 * @remarks
 *   Each reaction and each choice is the actions `Button`, so its looks, its pressed state and its
 *   focus ring are the button's own. The recipe lays out the row and the choices, and sets the
 *   glyphs and counts inside the buttons. The root is a `fieldset`, whose border, margin and
 *   padding the recipe removes. A count is set in tabular figures, so a count that changes keeps
 *   its width.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Styles a row of reactions 4px apart at the foundation's metrics.
 */
export const recipe = defineSlotRecipe({
  base: {
    choices: {
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.xs}"),
    },
    count: {
      fontVariantNumeric: "tabular-nums",
    },
    glyph: {
      display: "inline-flex",
      lineHeight: "1",
    },
    root: {
      alignItems: "center",
      borderWidth: "0",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.xs}"),
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: "reactions",
  jsx: [/^Reactions\.\w+$/u],
  slots: ["root", "glyph", "count", "choices"],
});
