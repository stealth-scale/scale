/**
 * Recipe for the fieldset: a legend, the fields of a group and the texts about the group.
 *
 * @remarks
 *   Four slots: root, legend, helper text and error text. The root clears the `fieldset` element's
 *   border, padding, margin and minimum inline size, so it shrinks inside a flex or grid parent.
 *   The root is a flex container with the size's gap between every child. The legend floats,
 *   because a floated legend is not the rendered legend a browser draws in the border and lays out
 *   apart from the flex items, so the gap reaches it. It still names the group, because the
 *   accessible name reads the first `legend` child. The legend reads the heading role one size
 *   smaller than the group, which sets it one font size above the field labels, so it reads as the
 *   heading of the group. The helper and error texts read the body role one size smaller, the
 *   same as a field's. The status axis sets the palette of the error text.
 *   The recipe has no `palette` axis, because the group's only color reports a state, and no
 *   `effect` axis, because the group draws no box of its own.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  type Scale,
  sizeVariants,
  statusEmitted,
  statusVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the fieldset offers: `sm`, `md` and `lg`.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Returns the style of the group's texts at one size: the body role one size smaller, at the snug
 * line height.
 */
function described(size: Scale): SystemStyleObject {
  return { lineHeight: "snug", textStyle: `body.${below(size)}` };
}

/**
 * Defines the fieldset recipe: a vertical group at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    errorText: {
      "& > svg": {
        blockSize: "1em",
        flexShrink: "0",
        inlineSize: "1em",
        marginBlockStart: "calc((1lh - 1em) / 2)",
      },
      alignItems: "start",
      color: "colorPalette.fg",
      display: "flex",
    },
    helperText: { color: "fg.muted" },
    legend: { float: "inline-start", inlineSize: "full", padding: "0" },
    root: {
      borderStyle: "none",
      colorPalette: "error",
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: "fieldset",
  defaultVariants: { orientation: "vertical", size: "md" },
  jsx: [/^Fieldset(\.\w+)?$/u],
  slots: ["root", "legend", "helperText", "errorText"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Direction the group's fields run in.
     *
     * @remarks
     *   `horizontal` wraps the fields in rows, each from a 12rem basis, so two fields share a row
     *   and a field that does not fit wraps. The legend and the texts take a row each.
     */
    orientation: {
      horizontal: {
        errorText: { minInlineSize: "full" },
        helperText: { minInlineSize: "full" },
        legend: { minInlineSize: "full" },
        root: { "& > *": { flexBasis: "48", flexGrow: "1" }, flexFlow: "row wrap" },
      },
      vertical: { root: { flexDirection: "column" } },
    },

    /**
     * Text size and gap. The legend reads the heading role one size smaller: 16, 18 and 20.25px at
     * `sm`, `md` and `lg`, over field labels of 14.2, 16 and 18px. The texts read the body role one
     * size smaller, and the gap reads the gap scale at the size. The size also reaches every field
     * inside the group that states none.
     */
    size: onSlots({
      errorText: sizeVariants(
        (size) => ({ ...described(size), gap: dense(`{spacing.gap.${size}}`) }),
        SIZES,
      ),
      helperText: sizeVariants(described, SIZES),
      legend: sizeVariants((size) => ({ textStyle: `heading.${below(size)}` }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
    }),

    /**
     * Status the group reports. Each value sets the palette of the error text, which defaults to
     * the error palette.
     */
    status: onSlot("root", statusVariants()),
  },
});
