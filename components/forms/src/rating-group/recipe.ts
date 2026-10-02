/**
 * Recipe for the rating group: a row of glyphs a person picks a score from.
 *
 * @remarks
 *   Seven slots. The root is the group, which stacks the label over the row of items. Each item is
 *   a square of the tag height, never under 24px, and a 40px square under a coarse pointer, so
 *   every glyph is a target WCAG 2.5.8 accepts. The indicator stacks the caller's glyph twice at
 *   the icon size: an empty glyph in the emphasized border ink, which keeps the 3:1 WCAG 1.4.11
 *   sets for the scale's shape, and a filled glyph in the palette's solid over it. The filled glyph
 *   shows on every item up to the value, or the value under the pointer, and a half item clips it
 *   to its first half, the right half under `rtl`. An invalid rating takes the error palette. Under
 *   forced colors the empty glyph keeps `CanvasText` and the filled glyph takes `Highlight`.
 */

import {
  axis,
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  PALETTES,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
const CLASS = "rating-group";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Custom property with an item's side, set by the size axis and read by the items.
 */
const SIDE = "--rating-group-side";

/**
 * Custom property with a glyph's side, set by the size axis and read by the indicator.
 */
const GLYPH = "--rating-group-glyph";

/**
 * Selects the filled glyph of an item up to the value.
 */
const REACHED = `.${CLASS}__item[data-highlighted] &`;

/**
 * Selects the filled glyph of the item the value fills by half.
 */
const HALVED = `.${CLASS}__item[data-half] &`;

/**
 * Selects the filled glyph of a half item under `rtl`, where the item's first half is at its
 * inline start.
 */
const HALVED_RTL = `.${CLASS}__item[data-half][dir=rtl] &`;

/**
 * Places both glyphs of an indicator over each other, filling the indicator.
 */
const LAYER: SystemStyleObject = {
  "& > svg": { blockSize: "full", inlineSize: "full" },
  alignItems: "center",
  display: "flex",
  inset: "0",
  justifyContent: "center",
  position: "absolute",
};

/**
 * Defines the rating group recipe, which defaults to size `md` in the primary palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { alignItems: "center", display: "inline-flex" },
    item: {
      _disabled: { cursor: "disabled" },
      _touch: { blockSize: "control.md", inlineSize: "control.md" },
      alignItems: "center",
      blockSize: `var(${SIDE})`,
      borderRadius: "l1",
      cursor: "radio",
      display: "inline-flex",
      flexShrink: "0",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
      inlineSize: `var(${SIDE})`,
      justifyContent: "center",
      outline: "none",
      userSelect: "none",
    },
    itemEmpty: {
      ...LAYER,
      _highContrast: { color: "CanvasText" },
      color: "border.emphasized",
    },
    itemFilled: {
      ...LAYER,
      _highContrast: { color: "Highlight", forcedColorAdjust: "none" },
      "& > svg": { blockSize: "full", fill: "currentColor", inlineSize: "full" },
      color: "colorPalette.solid",
      [HALVED]: { clipPath: "inset(0 50% 0 0)" },
      [HALVED_RTL]: { clipPath: "inset(0 0 0 50%)" },
      [REACHED]: { visibility: "visible" },
      visibility: "hidden",
    },
    itemIndicator: {
      blockSize: `var(${GLYPH})`,
      display: "inline-flex",
      flexShrink: "0",
      inlineSize: `var(${GLYPH})`,
      pointerEvents: "none",
      position: "relative",
    },
    label: { color: "fg", fontWeight: "medium" },
    root: {
      _disabled: { layerStyle: "disabled" },
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      inlineSize: "fit",
    },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md" },
  jsx: [/^RatingGroup(\.\w+)?$/u],
  slots: ["root", "label", "control", "item", "itemIndicator", "itemEmpty", "itemFilled"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The palette the filled glyphs and the focus ring read. An invalid rating reads the error
     * palette instead.
     */
    palette: onSlot(
      "root",
      axis(PALETTES, (palette) => ({
        _invalid: { colorPalette: "error" },
        colorPalette: palette,
      }))(),
    ),

    /**
     * The item's side on the tag scale, never under 24px, the glyph on the icon scale, and the
     * label's text role at each size. The gap between the label and the row is one gap size
     * smaller.
     */
    size: onSlot(
      "root",
      sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          [GLYPH]: dense(`{sizes.icon.${size}}`),
          [SIDE]: `max({sizes.6}, ${dense(`{sizes.tag.${size}}`)})`,
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
    ),
  },
});
