/**
 * Recipe for the color picker: a label, a control of a text input and a trigger, and a panel of an
 * area, channel sliders, channel inputs and swatches that opens under the trigger or renders in
 * place.
 *
 * @remarks
 *   Twenty-four slots. The text inputs read the theme's field fragment, its three looks, its status
 *   axis and the control scale, so a color picker, a select and an input of one size match. The
 *   trigger, the eye dropper and the format trigger are buttons in the field's look, the trigger a
 *   square of the input's height around the value swatch. The panel fills with `bg.popover` inside
 *   a hairline edge and a large shadow, and a panel rendered in place drops the shadow, the layer
 *   and the motion of a floating one. The area is 176px high, a slider's track 12px thick, and both
 *   thumbs are 16px circles. The alpha track paints its gradient over the color swatch's
 *   checkerboard. A swatch trigger is a square of 24, 28 or 32px, and its indicator is a circle in
 *   `bg.panel`, so the glyph inside it contrasts with the circle and not with the swatch's color.
 *   The recipe has no `palette` axis, because a field's color reports a state, and no `effect`
 *   axis, because a glow would compete with the focus ring and the status edge.
 */

import {
  below,
  controlSizes,
  defineSlotRecipe,
  dense,
  field,
  FIELD_EDGE,
  fieldStatusVariants,
  fieldVariants,
  interactive,
  motion,
  onSlots,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

import {
  CHECKER,
  CLASS,
  controlSide,
  fieldButton,
  GRADIENT,
  swatchSide,
  thumb,
} from "#color-picker/metrics.ts";
import { flushed, glyph, inset, label, labelSizes, root, rootSizes, SIZES } from "#dropdown.ts";

/**
 * Draws each field look on the text inputs and the three buttons.
 */
const LOOKS = onSlots({
  channelInput: fieldVariants(),
  eyeDropperTrigger: fieldVariants(),
  formatTrigger: fieldVariants(),
  trigger: fieldVariants(),
});

/**
 * Sets a part's text one size smaller than the picker, on the label role.
 */
const SMALLER = sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), SIZES);

/**
 * Defines the color picker recipe: outline fields at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    area: { blockSize: "44", borderRadius: "l2", flexShrink: "0" },
    areaBackground: { blockSize: "full", borderRadius: "inherit", boxShadow: "inset" },
    areaThumb: thumb(),
    channelInput: {
      ...field(),
      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        appearance: "none",
        margin: "0",
      },
      "&[type=number]": { appearance: "textfield" },
      appearance: "none",
      borderRadius: "l2",
      fontVariantNumeric: "tabular-nums",
      inlineSize: "full",
      minInlineSize: "0",
      textAlign: "start",
    },
    channelSlider: {
      alignItems: "center",
      columnGap: dense("{spacing.gap.md}"),
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      rowGap: dense("{spacing.gap.xs}"),
    },
    channelSliderLabel: { color: "fg.muted", fontWeight: "medium", gridColumn: "1" },
    channelSliderThumb: { ...thumb(), translate: "-50% -50%" },
    channelSliderTrack: {
      "&[data-channel=alpha]": {
        backgroundImage: `var(${GRADIENT}), ${CHECKER}`,
        backgroundPosition: "0 0, 0 50%",
        backgroundSize: "auto, {spacing.2} {spacing.2}",
      },
      backgroundImage: `var(${GRADIENT})`,
      blockSize: dense("{sizes.3}"),
      borderRadius: "full",
      boxShadow: "inset",
      gridColumn: "1 / -1",
      touchAction: "none",
    },
    channelSliderValueText: {
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      gridColumn: "2",
      justifySelf: "end",
    },
    content: {
      "&:not([data-inline])": {
        ...motion("slide-fade.in", "slide-fade.out"),
        boxShadow: "lg",
        zIndex: "popover",
      },
      "&[hidden]": { display: "none" },
      background: "bg.popover",
      borderColor: "border",
      borderRadius: "l3",
      borderStyle: "solid",
      borderWidth: "hairline",
      color: "fg",
      display: "flex",
      flexDirection: "column",
      inlineSize: "min({sizes.64}, var(--available-width, {sizes.64}))",
      outline: "0",
    },
    control: { alignItems: "center", display: "flex", inlineSize: "full", minInlineSize: "0" },
    eyeDropperTrigger: fieldButton(),
    formatTrigger: { ...fieldButton(), textTransform: "uppercase" },
    label: label(),
    root: root(),
    swatchGroup: { display: "flex", flexWrap: "wrap" },
    swatchIndicator: {
      "&[hidden]": { display: "none" },
      "& > svg": { boxSize: "75%" },
      alignItems: "center",
      background: "bg.panel",
      borderRadius: "full",
      boxSize: "62.5%",
      color: "fg",
      display: "flex",
      justifyContent: "center",
    },
    swatchTrigger: {
      ...interactive(),
      "& > *": { gridArea: "1 / 1" },
      borderRadius: "l1",
      display: "grid",
      flexShrink: "0",
      padding: "0",
      placeItems: "center",
    },
    trigger: { ...fieldButton(), _expanded: { [FIELD_EDGE]: "{colors.fg.subtle}" } },
    valueText: { fontVariantNumeric: "tabular-nums", textAlign: "start" },
    view: { display: "flex", flexDirection: "column" },
  },
  className: CLASS,
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^ColorPicker(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "trigger",
    "valueSwatch",
    "valueText",
    "positioner",
    "content",
    "area",
    "areaBackground",
    "areaThumb",
    "channelSlider",
    "channelSliderLabel",
    "channelSliderValueText",
    "channelSliderTrack",
    "channelSliderThumb",
    "channelInput",
    "swatchGroup",
    "swatchTrigger",
    "swatch",
    "swatchIndicator",
    "eyeDropperTrigger",
    "formatTrigger",
    "view",
  ],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Height, insets and text of the inputs and the buttons, the side of a swatch trigger, and the
     * panel's padding and gaps. The panel's area and sliders keep one size.
     */
    size: onSlots({
      channelInput: sizeVariants(
        (size) => ({
          ...controlSizes()[size],
          "&[type=number]": {
            paddingInlineEnd: dense("{spacing.inset.xs}"),
            paddingInlineStart: dense("{spacing.inset.xs}"),
          },
          fontWeight: "normal",
          paddingInlineEnd: inset(size),
          paddingInlineStart: inset(size),
        }),
        SIZES,
      ),
      channelSliderLabel: SMALLER,
      channelSliderValueText: SMALLER,
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.inset.${below(size)}}`),
          padding: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      control: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      eyeDropperTrigger: sizeVariants(
        (size) => ({ "& svg": { boxSize: glyph(size) }, boxSize: controlSide(size) }),
        SIZES,
      ),
      formatTrigger: sizeVariants(
        (size) => ({
          blockSize: controlSide(size),
          paddingInline: inset(size),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      label: labelSizes(),
      root: rootSizes(),
      swatchGroup: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
      swatchTrigger: sizeVariants((size) => ({ boxSize: swatchSide(size) }), SIZES),
      trigger: sizeVariants(
        (size) => ({
          "&:has(> .color-picker__valueText)": {
            gap: dense(`{spacing.gap.${below(size)}}`),
            paddingInline: inset(size),
          },
          blockSize: controlSide(size),
          minInlineSize: controlSide(size),
          padding: dense("{spacing.gap.xs}"),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      valueText: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      view: sizeVariants((size) => ({ gap: dense(`{spacing.inset.${below(size)}}`) }), SIZES),
    }),

    /**
     * Status the color picker reports. Each value sets the edge and the focus ring of the text
     * inputs and the trigger from that status's palette.
     */
    status: onSlots({ channelInput: fieldStatusVariants(), trigger: fieldStatusVariants() }),

    /**
     * Field look of the text inputs and the buttons, one of the three a text field offers.
     *
     * @remarks
     *   On the root and on the panel, which a caller portals out of the root, `flushed` sets the
     *   smallest inset of the scale at every size, the same as the input's.
     */
    variant: { ...LOOKS, flushed: { ...LOOKS.flushed, content: flushed(), root: flushed() } },
  },
});
