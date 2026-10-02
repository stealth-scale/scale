/**
 * Recipe for the editable: text that turns into a field in place.
 *
 * @remarks
 *   Seven slots. The root is a grid with the label on a row of its own above the area and the
 *   control. The area contains the preview and the input in one cell. The preview and the input
 *   share the font, the padding, the radius and the height at each size, so the text does not move
 *   when editing starts. The preview fills with `bg.muted` on hover, shows its placeholder in the
 *   muted ink and wraps a long value. The input takes an inside focus ring in the field's ring
 *   color. An invalid preview or input draws the error edge along its block end. The triggers are
 *   the input group's square buttons from `input-group/trigger.ts`. The recipe has no `palette`
 *   axis, because the text keeps the page's ink, and no `effect` axis, because an effect would
 *   compete with the focus ring.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Class name of the recipe, which the root's selector for the label reads.
 */
const CLASS = "editable";

/**
 * Sizes the recipe offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Returns the styles the preview and the input share, so the text keeps its place when one
 * replaces the other.
 */
function surface(): SystemStyleObject {
  return {
    _invalid: {
      borderBlockEndColor: "border.error",
      borderBlockEndStyle: "solid",
      borderBlockEndWidth: "indicator",
    },
    background: "transparent",
    borderRadius: "l2",
    borderStyle: "none",
    color: "fg",
    fontFamily: "inherit",
    inlineSize: "full",
    letterSpacing: "inherit",
    minInlineSize: "0",
    textAlign: "start",
  };
}

/**
 * Returns the height, the text and the inline padding the preview and the input share at one
 * size.
 */
function sized(size: (typeof SIZES)[number]): SystemStyleObject {
  return {
    minBlockSize: dense(`{sizes.control.${size}}`),
    paddingInline: dense(`{spacing.inset.${below(below(size))}}`),
    textStyle: `body.${size}`,
  };
}

/**
 * Defines the editable recipe: at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    area: { display: "grid", minInlineSize: "0" },
    control: { alignItems: "center", display: "inline-flex", flexShrink: "0", gap: "1" },
    input: {
      ...surface(),
      _placeholder: { color: "fg.muted" },
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
      outline: "none",
      paddingBlock: "0",
    },
    label: {
      _disabled: { layerStyle: "disabled" },
      color: "fg",
      fontWeight: "medium",
      gridColumn: "1 / -1",
    },
    preview: {
      ...surface(),
      _disabled: { cursor: "disabled", layerStyle: "disabled" },
      "&[data-placeholder-shown]": { color: "fg.muted" },
      "&[role=button]": { _hover: { background: "bg.muted" }, cursor: "field" },
      alignItems: "center",
      display: "flex",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
      overflowWrap: "anywhere",
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
      whiteSpace: "pre-wrap",
    },
    root: {
      [`& > .${CLASS}__label`]: { gridColumn: "1 / -1" },
      alignItems: "center",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      inlineSize: "full",
      minInlineSize: "0",
    },
    trigger: trigger(),
  },
  className: CLASS,
  defaultVariants: { size: "md" },
  jsx: [/^Editable(\.\w+)?$/u],
  slots: ["root", "label", "area", "preview", "input", "control", "trigger"],
  variants: {
    /**
     * Height, text and padding of the preview and the input, and the size of the triggers. The
     * height reads the control scale, the text the body role and the inline padding the inset
     * scale two sizes smaller. A trigger's text reads the label role at the same size, which sizes
     * its glyph.
     */
    size: onSlots({
      input: sizeVariants(sized, SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      preview: sizeVariants(sized, SIZES),
      root: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${below(size)}}`),
          rowGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      trigger: sizeVariants(
        (size) => ({ ...triggerSizes()[size], textStyle: `label.${size}` }),
        SIZES,
      ),
    }),
  },
});
