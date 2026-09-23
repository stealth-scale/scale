/**
 * Recipe for the multi-line text field.
 *
 * @remarks
 *   Two slots. The root is the box that carries the edge and measures the text, and the control is
 *   the `textarea`. The surface, edge, ink and states come from the theme's wrapped field fragment,
 *   read through the control inside the box. A growing field measures nothing in JavaScript: the
 *   root is a grid of one cell that holds the control and a hidden copy of its text, and the copy
 *   sets the cell's height. The copy is the root's `::after`, whose `content` reads an attribute
 *   the component writes. The trailing space in the copy keeps a final empty line open. The root
 *   carries the inset and the two measured boxes carry none, so both wrap at the same width. The
 *   inset is one size smaller than the size, the same as the input's inline inset. The recipe has
 *   no `palette` axis, because a field's color reports a state, and no `effect` axis, because a
 *   glow or a pulse would compete with the focus ring and the status edge.
 */

import {
  below,
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  defineSlotRecipe,
  dense,
  fieldStatusVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  wrappedField,
  wrappedFieldVariants,
} from "@stealthscale/theme/authoring";

/**
 * Attribute on the root that carries a copy of the text.
 */
export const VALUE = "data-value";

/**
 * Styles the control and the copy alike, so both wrap at the same width and the copy measures what
 * the control renders.
 */
const MEASURED = {
  font: "inherit",
  gridArea: "1 / 1 / 2 / 2",
  letterSpacing: "inherit",
  margin: "0",
  overflowWrap: "break-word",
  padding: "0",
  whiteSpace: "pre-wrap",
};

/**
 * Defines the textarea recipe: an outline field at size `md` with a vertical resize handle by
 * default.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...MEASURED,
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "inherit",
      inlineSize: "full",
      outline: "none",
    },
    root: {
      "&::after": { ...MEASURED, content: `attr(${VALUE}) " "`, visibility: "hidden" },
      ...wrappedField(),
      borderRadius: "l2",
      display: "grid",
      inlineSize: "full",
    },
  },
  className: "textarea",
  compoundVariants: [
    {
      css: { control: { resize: "none" } },
      grip: ["both", "vertical"],
      grows: true,
      name: "measured",
    },
  ],
  defaultVariants: { grip: "vertical", size: "md", variant: "outline" },
  jsx: [/^Textarea$/u],
  slots: ["root", "control"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Axes the resize handle drags along. Each value writes the CSS `resize` property.
     *
     * @remarks
     *   The axis is not named `resize`, because a styled element takes every CSS property as a prop
     *   and a style prop of the same name shadows the axis.
     */
    grip: {
      both: { control: { resize: "both" } },
      none: { control: { resize: "none" } },
      vertical: { control: { resize: "vertical" } },
    },

    /**
     * Whether the field takes its height from its content. The control hides its own scrollbar.
     */
    grows: { true: { control: { overflow: "hidden" } } },

    /**
     * Text size and inset. The text reads the body role, and the inset on every side reads the
     * inset scale one size smaller.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.inset.${below(size)}}`),
          paddingInlineEnd: `var(${CONTROL_INSET_END}, ${dense(`{spacing.inset.${below(size)}}`)})`,
          paddingInlineStart: `var(${CONTROL_INSET_START}, ${dense(`{spacing.inset.${below(size)}}`)})`,
          textStyle: `body.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * Status the field reports. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: onSlot("root", fieldStatusVariants()),

    /**
     * Edges and surface of the field.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, the same as the flushed
     *   input.
     */
    variant: onSlot("root", {
      ...wrappedFieldVariants(),
      flushed: {
        layerStyle: "field.wrapped.flushed",
        paddingInlineEnd: `var(${CONTROL_INSET_END}, ${dense("{spacing.inset.xs}")})`,
        paddingInlineStart: `var(${CONTROL_INSET_START}, ${dense("{spacing.inset.xs}")})`,
      },
    }),
  },
});
