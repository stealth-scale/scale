/**
 * Recipe for the field: a label, a control and the texts under the control.
 *
 * @remarks
 *   Eight slots: root, label, required indicator, optional indicator, control, helper text, counter
 *   and error text. The optional indicator reads in the muted ink at the body weight, so it is
 *   quieter than the label it follows.
 *   The root is a dense grid and every part states its column, so the layout does not depend on
 *   the order a caller writes the parts in. Any other child of the root takes the control's
 *   column, so a select, a radio group or an input group lays out as the control does. In the
 *   vertical and floating orientations the counter takes the end of the label's row, and the
 *   control and the helper and error texts take the full width under it. In the horizontal
 *   orientation the label takes the first column, the control and the texts the second, and the
 *   counter an `auto` third column that is empty without a counter.
 *   The status axis sets the palette on the error text, the required indicator and the control,
 *   and not on the root, because the control's focus ring reads the palette. The error text and
 *   the required indicator default to the error palette. The recipe has no `palette` axis, because
 *   a field's colors report a state, and no `effect` axis, because the field renders no box of
 *   its own.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  fieldStatusVariants,
  onSlots,
  type Scale,
  sizeVariants,
  statusEmitted,
  statusVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the field offers: `sm`, `md` and `lg`.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Class name of the recipe, which the floating label's selector reads.
 */
const CLASS = "field";

/**
 * Custom property that sets how far a floating label drops to the middle of the control: the row
 * gap plus half the control's height.
 */
const DROP = "--field-drop";

/**
 * Custom property that sets where typed text starts inside the control: a text box's inline
 * inset, one size below the field's, plus its edge. A floating label takes it, so its words start
 * where typed text does: 13px from the box's edge at `md`.
 */
const INSET = "--field-inset";

/**
 * Selects a child of the root that is the control or takes its place: every child but the label,
 * the counter and the texts under the control.
 */
const CONTROLLING = `& > :not(.${CLASS}__label, .${CLASS}__counter, .${CLASS}__helperText, .${CLASS}__errorText)`;

/**
 * Returns the style of the texts under the control at one size: the body role one size smaller,
 * at the snug line height.
 */
function described(size: Scale): SystemStyleObject {
  return { lineHeight: "snug", textStyle: `body.${below(size)}` };
}

/**
 * Returns the style of the error text at one size: the texts' style, with the size's gap between
 * the status mark and the words.
 */
function messaged(size: Scale): SystemStyleObject {
  return { ...described(size), gap: dense(`{spacing.gap.${size}}`) };
}

/**
 * Defines the field recipe: a vertical field at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { minInlineSize: "0" },
    counter: {
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      justifySelf: "end",
      whiteSpace: "nowrap",
    },
    errorText: {
      "& > svg": {
        blockSize: "1em",
        flexShrink: "0",
        inlineSize: "1em",
        marginBlockStart: "calc((1lh - 1em) / 2)",
      },
      alignItems: "start",
      color: "colorPalette.fg",
      colorPalette: "error",
      display: "flex",
    },
    helperText: { color: "fg.muted" },
    label: {
      _disabled: { layerStyle: "disabled" },
      alignItems: "center",
      display: "inline-flex",
      fontWeight: "medium",
      gap: dense("{spacing.gap.xs}"),
    },
    optionalIndicator: { color: "fg.muted", fontWeight: "normal" },
    requiredIndicator: { color: "colorPalette.fg", colorPalette: "error", lineHeight: "1" },
    root: { display: "grid", gridAutoFlow: "dense", inlineSize: "full" },
  },
  className: CLASS,
  defaultVariants: { orientation: "vertical", size: "md" },
  jsx: [/^Field(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "requiredIndicator",
    "optionalIndicator",
    "control",
    "helperText",
    "counter",
    "errorText",
  ],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Where the label is placed against the control.
     *
     * @remarks
     *   Each value places the label, the control, the counter and the two texts, because the three
     *   lay them out over different columns. `horizontal` centres the label and the counter against
     *   the control. `floating` translates the label down over the control and keeps its row, so
     *   nothing under the field moves when the label rises. The label rises while a text box or
     *   textarea in the field has focus or has a value, so a box inside an input group floats its
     *   label too. A box's placeholder is
     *   transparent until the box takes focus, so its words never render under the resting label.
     */
    orientation: {
      floating: {
        counter: { gridColumn: "2 / 3" },
        errorText: { gridColumn: "1 / -1" },
        helperText: { gridColumn: "1 / -1" },
        label: {
          _motionReduce: { transitionDuration: "0s" },
          color: "fg.muted",
          gridColumn: "1 / 2",
          justifySelf: "start",
          paddingInline: `var(${INSET})`,
          pointerEvents: "none",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
          translate: `0 calc(50% + var(${DROP}))`,
        },
        root: {
          "& :is(input, textarea):not(:focus)::placeholder": { opacity: "0" },
          [`&:has(:is(input, textarea):focus) .${CLASS}__label,
            &:has(:is(input, textarea):not(:placeholder-shown)) .${CLASS}__label`]: {
            color: "fg",
            paddingInline: "0",
            translate: "0 0",
          },
          [CONTROLLING]: { gridColumn: "1 / -1" },
          gridTemplateColumns: "minmax(0, 1fr) auto",
        },
      },
      horizontal: {
        counter: { alignSelf: "center", gridColumn: "3 / 4" },
        errorText: { gridColumn: "2 / 3" },
        helperText: { gridColumn: "2 / 3" },
        label: { alignSelf: "center", gridColumn: "1 / 2" },
        root: {
          [CONTROLLING]: { gridColumn: "2 / 3" },
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
        },
      },
      vertical: {
        counter: { gridColumn: "2 / 3" },
        errorText: { gridColumn: "1 / -1" },
        helperText: { gridColumn: "1 / -1" },
        label: { gridColumn: "1 / 2" },
        root: {
          [CONTROLLING]: { gridColumn: "1 / -1" },
          gridTemplateColumns: "minmax(0, 1fr) auto",
        },
      },
    },

    /**
     * Text size and spacing of every part. The label reads the label role at the size, and the
     * texts under the control read the body role one size smaller.
     */
    size: onSlots({
      counter: sizeVariants(described, SIZES),
      errorText: sizeVariants(messaged, SIZES),
      helperText: sizeVariants(described, SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${size}}`),
          [DROP]: `calc(${dense(`{spacing.gap.${below(size)}}`)} + ${dense(`{sizes.control.${size}}`)} / 2)`,
          [INSET]: `calc(${dense(`{spacing.inset.${below(size)}}`)} + {borderWidths.control})`,
          rowGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
    }),

    /**
     * Status the field reports. Each value sets the palette of the error text and the required
     * indicator, and the control's edge.
     *
     * @remarks
     *   The control takes the field fragment's status rule, which sets the edge from the line
     *   family, because the palette's border role is two steps darker than the line the contrast
     *   gate measures against a panel.
     */
    status: onSlots({
      control: fieldStatusVariants(),
      errorText: statusVariants(),
      requiredIndicator: statusVariants(),
    }),
  },
});
