/**
 * Recipe for the pin input: a row of square boxes, one per character of a code.
 *
 * @remarks
 *   Four slots. The root is the `fieldset` that groups the boxes, with the element's edge, margin,
 *   padding and minimum width cleared. The label names the group. The control lays the boxes in a
 *   row, and sizes an `svg` between them to 1.25 times the text in the muted ink. Each input is a
 *   square box that reads the theme's field fragment and field looks, so its edge, surface, focus
 *   ring and states match every text field. A box is as wide as it is tall on the control scale, 32
 *   to 48px from `xs` to `xl`, and at least a `control.md` square under a coarse pointer. The gap
 *   between boxes reads the gap scale one size smaller. `attached` joins the boxes into one strip
 *   with shared edges and square inner corners. A hovered or focused attached box is raised above
 *   its neighbours, so its whole edge shows. The recipe has no `palette` axis, because a field's
 *   color reports a state, and no `effect` axis, because an effect would compete with the focus
 *   ring.
 */

import {
  below,
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
 * Sizes the recipe offers: the control scale from `xs` to `xl`.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Defines the pin input recipe: outline boxes at size `md`, apart, by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      "& > svg": { boxSize: "1.25em", color: "fg.muted", flexShrink: "0" },
      alignItems: "center",
      display: "inline-flex",
      isolation: "isolate",
    },
    input: {
      ...field(),
      _touch: { minBlockSize: "control.md", minInlineSize: "control.md" },
      appearance: "none",
      borderRadius: "l2",
      flexShrink: "0",
      fontVariantNumeric: "tabular-nums",
      padding: "0",
      textAlign: "center",
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" },
    root: {
      alignItems: "flex-start",
      borderStyle: "none",
      display: "flex",
      flexDirection: "column",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: "pin-input",
  compoundVariants: [
    /**
     * Sets the gap between attached boxes to zero at every size.
     *
     * @remarks
     *   The rule is a compound because the size axis writes the gap, and the compiler emits the
     *   size axis after the attached axis in the same cascade layer.
     */
    { attached: true, css: { control: { gap: "0" } }, name: "joined" },
  ],
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^PinInput(\.\w+)?$/u],
  slots: ["root", "label", "control", "input"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Whether the boxes join into one strip.
     *
     * @remarks
     *   Each box after the first overlaps the one before it by one edge width, so two boxes share
     *   one edge. A hovered box is raised one level and a focused box two, above the neighbour that
     *   overlaps it.
     */
    attached: {
      true: {
        input: {
          _focusVisible: { zIndex: "2" },
          _hover: { zIndex: "1" },
          "&:not(:first-child)": {
            borderEndStartRadius: "0",
            borderStartStartRadius: "0",
            marginInlineStart: "calc({borderWidths.control} * -1)",
          },
          "&:not(:last-child)": { borderEndEndRadius: "0", borderStartEndRadius: "0" },
        },
      },
    },

    /**
     * Box size, text size and gaps. A box is a square on the control scale, the text reads the
     * label role at the normal weight, and the gap between boxes reads the gap scale one size
     * smaller.
     */
    size: onSlots({
      control: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(size)}}`), textStyle: `label.${size}` }),
        SIZES,
      ),
      input: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.control.${size}}`),
          fontWeight: "normal",
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
    }),

    /**
     * Status the boxes report. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: onSlot("input", fieldStatusVariants()),

    /**
     * Edges and surface of each box: the theme's three field looks.
     */
    variant: onSlot("input", fieldVariants()),
  },
});
