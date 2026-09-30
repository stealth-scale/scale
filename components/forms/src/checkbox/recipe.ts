/**
 * Recipe for the checkbox: a row that contains the box and its label.
 *
 * @remarks
 *   Four slots: the root is the `label` the row renders in, the control is the box, the indicator
 *   is the mark inside the box, and the label is the text. The box reads the theme's field
 *   fragment, so its edge, hover and invalid state match every text field in the form. Two rules
 *   differ from the fragment. The focus ring renders outside, because a ring inside a 16px box
 *   covers the mark. The coarse-pointer height is dropped, and `touchTarget` widens the target to a
 *   `control.md` square, 40px, without changing the box. The box is 16, 20 and 24px at `sm`, `md`
 *   and `lg`. The root is the `label`, so a press anywhere on the row toggles the box, and the row
 *   with its text meets the 24px target of WCAG 2.5.8. The disabled look applies to the box and to
 *   the label and not to the row around them, so a disabled checkbox renders at the theme's
 *   disabled opacity once. The checked and partly-on states take the look's fill. An `svg` in the
 *   indicator fills the box, so the mark scales with it. The indicator restates `display: none`
 *   under `[hidden]`, because its own display would override the attribute the machine sets. The
 *   palette axis offers the four palettes that are not statuses: primary, secondary, accent and
 *   neutral. The status axis offers the four statuses, sets the edge as well as the palette, and is
 *   declared after the palette so it overrides it. The two axes cannot share a value, because the
 *   class name leaves out the axis. The recipe has no `effect` axis, because a glow or a pulse on a
 *   16px box competes with the focus ring.
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
  paletteVariants,
  sizeVariants,
  statusEmitted,
  type SystemStyleObject,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Palettes the palette axis offers: the ones that are not statuses.
 */
const HUES = ["primary", "secondary", "accent", "neutral"] as const;

/**
 * Distribution of a spread row, which puts the box at the far end.
 */
const SPREAD = justifyVariants(["between"]);

/**
 * Returns a look that fills the box with a layer style while it is checked or partly on.
 */
function filled(layerStyle: string): SystemStyleObject {
  return { _checked: { layerStyle }, _indeterminate: { layerStyle } };
}

/**
 * Defines the checkbox recipe: a solid box at size `md` in the primary palette by default.
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
      "& svg": { boxSize: "full" },
      alignItems: "center",
      blockSize: "full",
      color: "inherit",
      display: "inline-flex",
      inlineSize: "full",
      justifyContent: "center",
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", userSelect: "none" },
    root: {
      _disabled: { cursor: "disabled" },
      cursor: "button",
      display: "inline-flex",
      userSelect: "none",
    },
  },
  className: "checkbox",
  defaultVariants: {
    align: "center",
    palette: "primary",
    radius: "l1",
    size: "md",
    variant: "solid",
  },
  jsx: [/^Checkbox(\.\w+)?$/u],
  slots: ["root", "control", "indicator", "label"],
  staticCss: [statusEmitted(), { palette: [...HUES] }],
  variants: {
    /**
     * Position of the box against a label that runs to more than one line.
     *
     * @remarks
     *   `start` puts the box on the first line, `center` halfway down the text.
     */
    align: {
      start: { root: { alignItems: "flex-start" } },

      center: { root: { alignItems: "center" } },
    },

    /**
     * Entrance animation of the mark when the box turns on.
     */
    motion: onSlot("indicator", motionVariants(["fade", "rise", "reveal"])),

    /**
     * Palette the box fills with while checked or partly on: primary, secondary, accent or
     * neutral. A status color comes from the status axis.
     */
    palette: onSlot("control", paletteVariants(HUES)),

    /**
     * Corner radius of the box.
     */
    radius: onSlot("control", cornerVariants(["l1", "l2", "full"])),

    /**
     * Box size, text size and gap. The box reads the icon scale, the text the label role and the
     * gap the gap scale, each at the size.
     */
    size: onSlots({
      control: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), ["sm", "md", "lg"]),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
    }),

    /**
     * Whether the row takes the width it is given and puts the box at the far end.
     */
    spread: { true: { root: { ...SPREAD.between, inlineSize: "full" } } },

    /**
     * Status the box reports. Each value sets the edge and the palette, over the palette axis.
     */
    status: onSlot("control", fieldStatusVariants()),

    /**
     * Surface of the box at rest, and its fill while checked or partly on.
     *
     * @remarks
     *   No value writes a border color, so a status sets the edge in every look.
     */
    variant: onSlot("control", {
      solid: filled("fill.solid"),

      subtle: { ...filled("fill.subtle"), background: "bg.muted" },

      outline: { ...filled("outline.solid"), background: "transparent" },
    }),
  },
});
