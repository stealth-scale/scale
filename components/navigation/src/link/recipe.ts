/**
 * States what a link is: words a person follows to somewhere else, drawn in the theme's link ink
 * and underlined either always or under a pointer.
 *
 * @remarks
 *   The ink, the visited ink, the cursor and the focus ring all come from the theme's own link
 *   fragment, so a theme that decides what a link looks like decides it once for every link. The
 *   box is inline so a link sits in a line of words, and it lays its content out in a row so a
 *   mark beside the words is centred on them rather than sitting on the baseline.
 *   The underline is the one thing this recipe adds. A link inside a paragraph is found by its
 *   underline as much as by its colour, and a reader who cannot tell the two inks apart has
 *   nothing else to go on, which is why colour alone is not enough to mark a link.
 */

import { defineRecipe, dense, link } from "@stealthscale/theme/authoring";

/**
 * Draws a link underlined under a pointer until a caller asks for one that always is.
 */
export const recipe = defineRecipe({
  base: {
    ...link(),
    alignItems: "center",
    borderRadius: "l1",
    display: "inline-flex",
    gap: dense("{spacing.gap.xs}"),
  },
  className: "link",
  defaultVariants: { variant: "plain" },
  jsx: [/^Link$/u],
  variants: {
    /**
     * Whether the link takes the ink of the words around it rather than the theme's link ink.
     *
     * @remarks
     *   For a link that is the title of a card or the brand in a bar, where the surface it sits on
     *   already says it is pressed and the link ink would read as a second colour on the page. The
     *   underline under a pointer and the focus ring stay, so the link is still found.
     */
    inherit: { true: { _visited: { color: "inherit" }, color: "inherit" } },

    /**
     * Whether the underline is drawn at rest or only under a pointer.
     */
    variant: {
      plain: { textDecoration: "none" },
      underline: { textDecoration: "underline" },
    },
  },
});
