/**
 * Defines the styles a checkbox is drawn with.
 *
 * @remarks
 *   Four parts. The root is the label the whole control sits in, the control is the box, the
 *   indicator is the mark inside it, and the label is the words beside it.
 *   The box reads the theme's field fragment, so its edge, its hover and its invalid state are the
 *   ones every text field in the same form is drawn with. Three of the fragment's rules are
 *   restated. The ring is drawn outside, because a ring inside a box this small covers the mark.
 *   The coarse-pointer height is dropped, because the fragment raises a field to the middle control
 *   height and that would stretch a square into a rectangle. The target is widened by `touchTarget`
 *   instead, which leaves the drawn box alone and gives a coarse pointer a square of `control.md`,
 *   measuring 2.5rem against the theme's own base.
 *   The drawn box is 1rem, 1.25rem and 1.5rem across the three sizes. WCAG 2.2 asks for 24 by 24
 *   CSS pixels, which the root clears rather than the box: the root is the label and a press
 *   anywhere along it toggles, so the target is the row and its words. A checkbox drawn without a
 *   label at the small size is the one case that rests on the spacing exception.
 *   The indicator is hidden by the machine until the box is checked or indeterminate. A display of
 *   its own would defeat the attribute, so the slot restates `display: none` under it.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  field,
  fieldStatusVariants,
  justifyVariants,
  motionVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Writes how the space along the row is shared out where the box sits at the far end.
 */
const SPREAD = justifyVariants(["between"]);

/**
 * Draws a filled checkbox at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...field(),
      ...touchTarget(),
      alignItems: "center",
      display: "inline-flex",
      flexShrink: 0,
      focusVisibleRing: "outside",
      justifyContent: "center",
    },
    indicator: {
      "&[hidden]": { display: "none" },
      alignItems: "center",
      blockSize: "full",
      color: "inherit",
      display: "inline-flex",
      inlineSize: "full",
      justifyContent: "center",
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", userSelect: "none" },
    root: {
      _disabled: { layerStyle: "disabled" },
      cursor: "button",
      display: "inline-flex",
      userSelect: "none",
    },
  },
  className: "checkbox",
  defaultVariants: { align: "center", radius: "l1", size: "md", variant: "solid" },
  jsx: [/^Checkbox(\.\w+)?$/u],
  slots: ["root", "control", "indicator", "label"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Where the box sits against a label that runs to more than one line.
     */
    align: {
      start: { root: { alignItems: "flex-start" } },

      center: { root: { alignItems: "center" } },
    },

    motion: onSlot("indicator", motionVariants(["fade", "rise", "reveal"])),

    radius: onSlot("control", cornerVariants(["l1", "l2", "full"])),

    size: onSlots({
      control: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), ["sm", "md", "lg"]),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
    }),

    /**
     * Whether the box sits at the far end of the row rather than beside its words.
     *
     * @remarks
     *   A row that pushes the box to the far end takes the width it is given, which a row packed
     *   at the start does not, so the value states the width with the distribution.
     */
    spread: { true: { root: { ...SPREAD.between, inlineSize: "full" } } },

    status: onSlot("control", fieldStatusVariants()),

    /**
     * How the box is drawn resting and once it is checked.
     *
     * @remarks
     *   No value writes a border color, so a status always reaches the edge. The three differ
     *   resting in their surface and checked in the layer style the palette fills them with.
     */
    variant: onSlot("control", {
      solid: { _checked: { layerStyle: "fill.solid" } },

      subtle: { _checked: { layerStyle: "fill.subtle" }, background: "bg.muted" },

      outline: { _checked: { layerStyle: "outline.solid" }, background: "transparent" },
    }),
  },
});
