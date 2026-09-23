/**
 * States what a text field is: a box a person types one line into, drawn in a look, a size and the
 * palette of its status.
 *
 * @remarks
 *   The surface, the edge, the ink, the placeholder, the focus ring and every state a field enters
 *   come from the theme's own field fragment, so a theme decides what a field looks like once for
 *   every field, and the three looks are layer styles it owns. What is left here is the shape and
 *   the inset the flushed look drops.
 *   The size reads the control scale, so a field lines up with a button of the same name beside it
 *   and both move when a theme restates the scale. A field fills the width it is given rather than
 *   sizing itself to its content, because a row of fields of different widths reads as a form that
 *   was laid out by hand.
 *   The focus ring is drawn inside the box. A ring outside it would be clipped where a field sits
 *   flush against the edge of a panel, which is where fields usually sit.
 */

import {
  controlSizes,
  defineRecipe,
  dense,
  field,
  fieldStatusVariants,
  fieldVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

/**
 * Draws an outlined field at the middle size until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    ...field(),
    appearance: "none",
    borderRadius: "l2",
    textAlign: "start",
    width: "full",
  },
  className: "input",
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^Input$/u],
  staticCss: [statusEmitted()],
  variants: {
    size: controlSizes(),
    status: fieldStatusVariants(),

    /**
     * How the edge of the field is drawn.
     *
     * @remarks
     *   The flushed look keeps the smallest inset of the scale rather than the inset of its own
     *   step. Dropped outright its text sat hard against the end of the rule under it and read as
     *   text that had overrun the field; kept at its own step it stood as far in as an outlined
     *   field, which is the indent a flushed field exists to avoid.
     */
    variant: {
      ...fieldVariants(),
      flushed: { layerStyle: "field.flushed", paddingInline: dense("{spacing.inset.xs}") },
    },
  },
});
