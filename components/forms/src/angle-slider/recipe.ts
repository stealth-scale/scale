/**
 * Recipe for the angle slider: a dial a person turns a thumb around to pick an angle.
 *
 * @remarks
 *   Nine slots. The root is the `fieldset` that groups the dial under its label, with the element's
 *   edge, margin, padding and minimum width reset, and stacks the label over the dial. The control
 *   is the dial, a circle that centres its value text. The track is the ring, a fill masked to the
 *   ring's thickness and inset by the thumb's overhang, so a thumb on the ring ends at the dial's
 *   edge. The range inside the track is a conic gradient from the top to the value, which the
 *   track's mask clips to the ring, and a dot of the ring's thickness rounds its start. The thumb
 *   covers its end. The thumb and each marker start at the dial's centre, and a
 *   `rotate` and a `translateY` of the ring's radius move them onto the ring. The thumb turns by
 *   the root's `--value` rather than the machine's `--angle`, because the theme registers `--angle`
 *   without inheritance for its moving border. The dial is 6, 8 and 10rem wide from `sm` to `lg`,
 *   the ring is as thick as the slider's track, and the thumb is a circle of the tag height in the
 *   slider's looks. An invalid dial takes the error palette, and a read-only thumb dashes its edge.
 *   Under forced colors the ring fills with `Canvas` inside a hairline `CanvasText` edge and the
 *   range with `Highlight`, because `Highlight` is dark in some themes and reads only against
 *   `Canvas`. The thumb and the range turn the other way under `rtl`, where the machine mirrors the
 *   markers.
 */

import {
  axis,
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  sizeVariants,
  type SystemStyleObject,
  touchTarget,
} from "@stealthscale/theme/authoring";

import { LOOKS, THICKNESSES, THUMBS, TRACKS } from "#slider/recipe.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
const CLASS = "angle-slider";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Maps each size to the sizes token the dial is as wide as: 6, 8 and 10rem.
 */
const DIALS: Readonly<Record<(typeof SIZES)[number], string>> = { lg: "40", md: "32", sm: "24" };

/**
 * Custom property with the dial's width, set by the size axis and read by the control, the thumb
 * and the markers.
 */
const DIAL = "--angle-slider-dial";

/**
 * Custom property with the ring's thickness, set by the size axis and read by the track and the
 * start of the range.
 */
const THICK = "--angle-slider-thick";

/**
 * Custom property with the thumb's side, set by the size axis and read by the thumb, the markers
 * and the track's inset.
 */
const SIDE = "--angle-slider-side";

/**
 * Moves an element from the dial's centre onto the middle of the ring, in the direction its
 * `rotate` turns it. The ring's middle lies half a thumb inside the dial's edge.
 */
const OUTWARD = `translateY(calc((var(${DIAL}) - var(${SIDE})) / -2))`;

/**
 * Turns the thumb clockwise by the root's `--value`, in degrees.
 */
const TURNED = "calc(var(--value) * 1deg)";

/**
 * Masks an element to the ring. The mask is clear inside the ring, opaque over its thickness, and
 * blends over a hairline at the inner edge.
 */
const RING = `radial-gradient(farthest-side, transparent calc(100% - var(${THICK}) - {borderWidths.hairline}), black calc(100% - var(${THICK})))`;

/**
 * Selects a marker in a dial that renders a range, where a marker the value has passed lies on
 * the range.
 */
const RANGED = `.${CLASS}__control:has(.${CLASS}__range) &`;

/**
 * Returns the conic gradient that fills the ring from the top to the value in one color.
 *
 * @param color - The fill, a color value the gradient takes as it is.
 * @returns The gradient.
 */
function swept(color: string): string {
  return `conic-gradient(${color} calc(var(--value) * 1deg), transparent 0)`;
}

/**
 * Places the thumb and each marker at the dial's centre, ready for the machine's `rotate`.
 */
const CENTRED: SystemStyleObject = {
  left: "50%",
  position: "absolute",
  top: "50%",
  transform: OUTWARD,
  translate: "-50% -50%",
};

/**
 * Widens the thumb's target under a coarse pointer. The thumb restates its absolute position
 * there, because the target sets `position: relative` on its element.
 */
const { _touch: TOUCH } = touchTarget();

/**
 * Defines the angle slider recipe, which defaults to the outline look at size `md` in the primary
 * palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      _disabled: { cursor: "disabled" },
      alignContent: "center",
      blockSize: `var(${DIAL})`,
      borderRadius: "full",
      cursor: "slider",
      display: "grid",
      flexShrink: "0",
      inlineSize: `var(${DIAL})`,
      justifyItems: "center",
      position: "relative",
    },
    label: { color: "fg", fontWeight: "medium" },
    marker: {
      ...CENTRED,
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      background: "fg.muted",
      borderRadius: "full",
      boxSize: "1",
      [RANGED]: {
        "&[data-state=under-value]": {
          _highContrast: { background: "HighlightText" },
          background: "colorPalette.contrast",
        },
      },
    },
    markerGroup: { inset: "0", pointerEvents: "none", position: "absolute" },
    range: {
      _before: {
        _highContrast: { background: "Highlight" },
        background: "colorPalette.solid",
        borderRadius: "full",
        boxSize: `var(${THICK})`,
        content: '""',
        insetBlockStart: "0",
        left: "50%",
        position: "absolute",
        translate: "-50% 0",
      },
      _highContrast: { backgroundImage: swept("Highlight"), forcedColorAdjust: "none" },
      _rtl: { scale: "-1 1" },
      backgroundImage: swept("var(--colors-color-palette-solid)"),
      inset: "0",
      position: "absolute",
    },
    root: {
      _disabled: { layerStyle: "disabled" },
      alignItems: "flex-start",
      borderStyle: "none",
      display: "flex",
      flexDirection: "column",
      inlineSize: "fit",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    thumb: {
      ...CENTRED,
      _disabled: { cursor: "disabled" },
      _rtl: { rotate: `calc(${TURNED} * -1)` },
      _touch: { ...TOUCH, position: "absolute" },
      "&[data-readonly]": { borderStyle: "dashed" },
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "indicator",
      boxSize: `var(${SIDE})`,
      cursor: "slider",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      outline: "none",
      rotate: TURNED,
    },
    track: {
      _highContrast: {
        forcedColorAdjust: "none",
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      borderRadius: "full",
      inset: `calc((var(${SIDE}) - var(${THICK})) / 2)`,
      maskImage: RING,
      position: "absolute",
    },
    valueText: { color: "fg", fontVariantNumeric: "tabular-nums" },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md", variant: "outline" },
  jsx: [/^AngleSlider(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "track",
    "range",
    "thumb",
    "markerGroup",
    "marker",
    "valueText",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The palette the range, the thumb's edge and the focus ring read. An invalid dial reads the
     * error palette instead.
     */
    palette: onSlot(
      "root",
      axis(PALETTES, (palette) => ({
        _invalid: { colorPalette: "error" },
        colorPalette: palette,
      }))(),
    ),

    /**
     * The dial's width, the ring's thickness on the gap scale, the thumb's side on the tag scale,
     * the label's text role and the value's heading role at each size. The gap between the label
     * and the dial is one gap size smaller.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({
          [DIAL]: dense(`{sizes.${DIALS[size]}}`),
          gap: dense(`{spacing.gap.${below(size)}}`),
          [SIDE]: dense(`{sizes.tag.${size}}`),
          textStyle: `label.${size}`,
          [THICK]: dense(`{spacing.gap.${THICKNESSES[size]}}`),
        }),
        SIZES,
      ),
      valueText: sizeVariants((size) => ({ textStyle: `heading.${size}` }), SIZES),
    }),

    /**
     * The ring and the thumb in each look, the slider's two. Each look restates the ring's forced
     * color, because a look's fill applies over the base.
     */
    variant: onSlots({
      thumb: axis(LOOKS, (look) => THUMBS[look])(),
      track: axis(LOOKS, (look) => ({
        ...TRACKS[look],
        _highContrast: { backgroundColor: "Canvas" },
      }))(),
    }),
  },
});
