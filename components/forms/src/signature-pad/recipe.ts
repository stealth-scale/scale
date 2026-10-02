/**
 * Styles a signature pad: the group, its label, the box a person draws in, the strokes, the guide
 * line and the button that clears the strokes.
 *
 * @remarks
 *   The root is the `fieldset` that groups the parts, with the element's edge, margin, padding and
 *   minimum width reset. The control is the theme's field at the whole width and at least 160, 208
 *   or 256px tall, so its edge, focus ring, invalid edge, disabled look and dashed read-only edge
 *   are the field's looks. The strokes fill in the palette's solid color, `neutral` by default, and
 *   in `CanvasText` under forced colors. The guide is a dashed line in the emphasized border color
 *   near the control's bottom, where a signature starts. The clear trigger is the input group's
 *   square button in the control's top end corner. The recipe has no `effect` axis, because an
 *   effect would compete with the strokes and the focus ring.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  field,
  fieldVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Size of a signature pad.
 */
type Size = (typeof SIZES)[number];

/**
 * Maps each size to the sizes token the control is at least as tall as: 160, 208 and 256px.
 */
const HEIGHTS: Readonly<Record<Size, string>> = { lg: "64", md: "52", sm: "40" };

/**
 * Defines the signature pad recipe, which defaults to an outline pad at size `md` in the neutral
 * palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: { ...trigger(), position: "absolute", zIndex: "1" },
    control: {
      ...field(),
      borderRadius: "l3",
      inlineSize: "full",
      justifySelf: "stretch",
      position: "relative",
      touchAction: "none",
      userSelect: "none",
    },
    guide: {
      borderBlockEndColor: "border.emphasized",
      borderBlockEndStyle: "dashed",
      borderBlockEndWidth: "control",
      pointerEvents: "none",
      position: "absolute",
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" },
    root: {
      borderStyle: "none",
      display: "grid",
      inlineSize: "full",
      justifyItems: "start",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    segment: {
      _highContrast: { fill: "CanvasText" },
      blockSize: "full",
      fill: "colorPalette.solid",
      inlineSize: "full",
      insetBlockStart: "0",
      insetInlineStart: "0",
      overflow: "visible",
      pointerEvents: "none",
      position: "absolute",
    },
  },
  className: "signature-pad",
  defaultVariants: { palette: "neutral", size: "md", variant: "outline" },
  jsx: [/^SignaturePad(\.\w+)?$/u],
  slots: ["root", "label", "control", "segment", "guide", "clearTrigger"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Palette the strokes fill in.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Height of the control, the guide's inset, the clear trigger's square and corner, and the text
     * at each size. The control is at least 160, 208 or 256px tall.
     */
    size: onSlots({
      clearTrigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          insetBlockStart: dense(`{spacing.gap.${below(size)}}`),
          insetInlineEnd: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      control: sizeVariants((size) => ({ minBlockSize: dense(`{sizes.${HEIGHTS[size]}}`) }), SIZES),
      guide: sizeVariants(
        (size) => ({
          insetBlockEnd: dense(`{spacing.inset.${size}}`),
          insetInline: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ rowGap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
    }),

    /**
     * Edges and surface of the control: the field's outline or subtle look.
     */
    variant: onSlot("control", fieldVariants(["subtle", "outline"])),
  },
});
