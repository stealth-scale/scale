/**
 * Declares the native select's slot recipe: the browser's own `select` in the box of a text field,
 * with the indicator the caller passes at its end.
 *
 * @remarks
 *   The field reads the theme's field fragment and its three looks, and the control scale for its
 *   height and text, so a select and an input of one size match. Its start inset is one size
 *   smaller than a button's, the same as the input's. Its end inset leaves room for the indicator:
 *   the inset, the icon one size smaller than the control, and the smallest gap. The indicator
 *   lies over the field's end and takes no pointer, so a press on it opens the select. It dims
 *   with a disabled field and takes the error ink with an invalid one. The list that opens is the
 *   browser's picker. The recipe sets only the options' ground, so the list follows the page's
 *   color scheme. The recipe has no `palette` axis, because a field's color reports a state, and
 *   no `effect` axis, because a glow would compete with the focus ring and the status edge.
 */

import {
  below,
  CONTROL_INSET_START,
  controlSizes,
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
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "native-select";

/**
 * Sizes the select offers, on the control scale.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Custom property the flushed look sets to the smallest inset, which the field's insets and the
 * indicator's place read over the size's own.
 */
const INSET = "--native-select-inset";

/**
 * Returns the inline inset of a size: the flushed look's where it sets one, else one size smaller
 * than a button's.
 */
function inset(size: (typeof SIZES)[number]): string {
  return `var(${INSET}, ${dense(`{spacing.inset.${below(size)}}`)})`;
}

/**
 * Styles an outline select at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    field: {
      ...field(),
      "& option, & optgroup": { background: "bg.panel", color: "fg" },
      [`&:disabled + .${CLASS}__indicator`]: { opacity: "disabled" },
      [`&[aria-invalid=true] + .${CLASS}__indicator`]: { color: "fg.error" },
      appearance: "none",
      borderRadius: "l2",
      minInlineSize: "0",
      textAlign: "start",
      width: "full",
    },
    indicator: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      insetBlock: "0",
      pointerEvents: "none",
      position: "absolute",
    },
    root: { display: "flex", inlineSize: "full", position: "relative" },
  },
  className: CLASS,
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^NativeSelect\.\w+$/u],
  slots: ["root", "field", "indicator"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Height, text and insets of the field, and the indicator's icon and place.
     */
    size: onSlots({
      field: sizeVariants(
        (size) => ({
          ...controlSizes()[size],
          fontWeight: "normal",
          paddingInlineEnd: `calc(${inset(size)} + ${dense(`{sizes.icon.${below(size)}}`)} + ${dense("{spacing.gap.xs}")})`,
          paddingInlineStart: `var(${CONTROL_INSET_START}, ${inset(size)})`,
        }),
        SIZES,
      ),
      indicator: sizeVariants(
        (size) => ({
          "& > svg": {
            blockSize: dense(`{sizes.icon.${below(size)}}`),
            inlineSize: dense(`{sizes.icon.${below(size)}}`),
          },
          insetInlineEnd: inset(size),
        }),
        SIZES,
      ),
    }),

    /**
     * Status the field reports. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: onSlot("field", fieldStatusVariants()),

    /**
     * Edges and surface of the field.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, the same as the input's, so
     *   its text starts near the start of its edge and the indicator ends near its end.
     */
    variant: {
      ...onSlot("field", fieldVariants()),
      flushed: {
        field: { layerStyle: "field.flushed" },
        root: { [INSET]: dense("{spacing.inset.xs}") },
      },
    },
  },
});
