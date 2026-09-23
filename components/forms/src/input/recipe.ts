/**
 * Recipe for the single-line text field.
 *
 * @remarks
 *   The surface, edge, ink, placeholder, focus ring and states come from the theme's field fragment
 *   and its three field looks, so every field in a theme matches. The sizes read the control scale,
 *   so an input and a button of the same size are the same height. The inline inset is one size
 *   smaller than a button's: 12px at `md` and 40px at `4xl`. Typed text is set at the normal weight
 *   of body text, the same as the textarea's, and not at a label's medium weight. The field fills
 *   the inline size of its container. The recipe has no `palette` axis, because a field's color
 *   reports a state, and no `effect` axis, because a glow or a pulse would compete with the focus
 *   ring and the status edge.
 */

import {
  below,
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  controlSizes,
  defineRecipe,
  dense,
  field,
  fieldStatusVariants,
  fieldVariants,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

/**
 * Defines the input recipe: an outline field at size `md` by default.
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
    /**
     * Height, text size and inline inset. The height and text read the control scale at the same
     * size, and the inset reads it one size smaller.
     *
     * @remarks
     *   The inset is written through the control's inset properties, so a component that places
     *   something inside the field opens the side it needs without writing padding of its own.
     */
    size: sizeVariants((size) => ({
      ...controlSizes()[size],
      fontWeight: "normal",
      paddingInlineEnd: `var(${CONTROL_INSET_END}, ${dense(`{spacing.inset.${below(size)}}`)})`,
      paddingInlineStart: `var(${CONTROL_INSET_START}, ${dense(`{spacing.inset.${below(size)}}`)})`,
    })),

    /**
     * Status the field reports. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: fieldStatusVariants(),

    /**
     * Edges and surface of the field.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, so its text starts near the
     *   start of its edge. The inset goes through the control's inset properties, the same as
     *   at every size.
     */
    variant: {
      ...fieldVariants(),
      flushed: {
        layerStyle: "field.flushed",
        paddingInlineEnd: `var(${CONTROL_INSET_END}, ${dense("{spacing.inset.xs}")})`,
        paddingInlineStart: `var(${CONTROL_INSET_START}, ${dense("{spacing.inset.xs}")})`,
      },
    },
  },
});
