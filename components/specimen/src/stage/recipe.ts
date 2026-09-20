/**
 * States what a stage is: the box a scene is drawn in, the width of the card's content until a
 * window's width is picked and held to that width from then on.
 *
 * @remarks
 *   A reader picks a width to see a scene as a phone or a tablet sees it. The library's screen
 *   components fold on their own width and never on the window's, and a matrix folds on the room
 *   it is given, so holding the box a scene is drawn in to a width is what shows the folding. The
 *   widths are where the theme's breakpoints start, read from the breakpoint tokens so a theme
 *   that moves one moves the stage with it, and a phone below them all at the smallest measure.
 *   Nothing here loads the page again in a frame: a media query in a scene's own style keeps
 *   following the window, and the catalogue's components write none.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Writes what a held stage shares: a dashed hairline a gap outside its box, so the width it is
 * held to can be seen against the card.
 *
 * @remarks
 *   An outline rather than a border, because a border would take room from the width the stage
 *   states and move the scene. Dashed, so it reads as a boundary the catalogue drew and not as
 *   part of the component on the stage. A stage the window decides draws none, because there is
 *   no width to show.
 */
const HELD = {
  outlineColor: "border.emphasized",
  outlineOffset: "gap.xs",
  outlineStyle: "dashed",
  outlineWidth: "hairline",
};

/**
 * Draws a stage the width of the card's content until a caller holds it to a window's width.
 */
export const recipe = defineRecipe({
  base: { inlineSize: "full" },
  className: "stage",
  jsx: [/^Stage$/u],
  variants: {
    /**
     * The window's width the stage is held to: the smallest measure for a phone, and where each
     * of the theme's breakpoints starts. A held stage shows its edge.
     */
    width: {
      "2xl": { ...HELD, maxInlineSize: "{breakpoints.2xl}" },
      lg: { ...HELD, maxInlineSize: "{breakpoints.lg}" },
      md: { ...HELD, maxInlineSize: "{breakpoints.md}" },
      phone: { ...HELD, maxInlineSize: "xs" },
      sm: { ...HELD, maxInlineSize: "{breakpoints.sm}" },
      xl: { ...HELD, maxInlineSize: "{breakpoints.xl}" },
    },
  },
});
