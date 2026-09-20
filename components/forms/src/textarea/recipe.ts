/**
 * Defines the styles a textarea is drawn with.
 *
 * @remarks
 *   Two parts. The root is the box that measures the text, and the control is the textarea itself.
 *   The surface, the edge, the ink and every state come from the theme's field fragment, so a theme
 *   decides what a field looks like once for every field.
 *   A growing textarea is drawn without measuring anything in JavaScript. The root is a grid of one
 *   cell holding both the control and a copy of its text, and the copy is what gives the cell its
 *   height. The copy is the `content` of the root's `::after`, read from an attribute the component
 *   writes, so the box grows on the same frame a person types and no state is written from an
 *   effect.
 *   The trailing space in the copy holds the height open while a line ends in a newline, which a
 *   browser otherwise collapses. The root carries the inset and the two measured boxes carry none,
 *   so both wrap at the same width.
 */

import {
  defineSlotRecipe,
  dense,
  field,
  fieldStatusVariants,
  fieldVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

/**
 * The attribute the root carries a copy of the text in.
 */
export const VALUE = "data-value";

/**
 * Writes what the control and the copy of its text share, so the two wrap identically and the copy
 * measures what the control draws.
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
 * Draws an outlined textarea at the middle size until a caller says otherwise.
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
      ...field(),
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
     * Which way a person can drag the box bigger, which is the CSS `resize` property.
     *
     * @remarks
     *   Named `grip` rather than `resize`, because a styled element already takes every CSS
     *   property as a prop and a style prop of the same name shadows the axis.
     */
    grip: {
      both: { control: { resize: "both" } },
      none: { control: { resize: "none" } },
      vertical: { control: { resize: "vertical" } },
    },

    /**
     * Whether the box takes its height from the text rather than from a number of lines.
     */
    grows: { true: { control: { overflow: "hidden" } } },

    size: onSlots({
      root: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        ["sm", "md", "lg"],
      ),
    }),

    status: onSlot("root", fieldStatusVariants()),

    /**
     * How the edge of the field is drawn.
     */
    variant: onSlot("root", {
      ...fieldVariants(),
      flushed: { layerStyle: "field.flushed", paddingInline: "0" },
    }),
  },
});
