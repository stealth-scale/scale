/**
 * Recipe for the radio group: a group of rows, each a circle and its words.
 *
 * @remarks
 *   Five slots: the root is the group, the label names it, each item is the `label` a row renders
 *   in, the item control is the circle and the item text is the row's words. The circle's styles
 *   come from `circle.ts`, which the radio card shares, and read the theme's field fragment, so its
 *   edge, hover and invalid state match the checkbox's box and every text field. The focus ring
 *   renders outside the circle, and `touchTarget` widens the target to a `control.md` square under
 *   a coarse pointer without changing the circle. The circle is 16, 20 and 24px at `sm`, `md` and
 *   `lg`. A checked circle takes the look's fill and shows a dot in the look's ink, rendered as
 *   `::after` at 40% of the circle and at 60% on the outline look. The disabled look applies to the
 *   circle and to the words and not to the row around them, so a disabled row renders at the
 *   theme's disabled opacity once. A row is as wide as its circle and its words, so a press beside
 *   the words checks nothing, as with the browser's own radio. A horizontal group wraps its rows
 *   and gives the label a line of its own. The palette axis offers the four palettes that are not
 *   statuses, and the status axis, declared after it, sets the edge and the palette. The recipe has
 *   no `effect` axis, because a glow or a pulse on a 16px circle competes with the focus ring.
 */

import {
  defineSlotRecipe,
  dense,
  fieldStatusVariants,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
  statusEmitted,
  touchTarget,
} from "@stealthscale/theme/authoring";

import { circle, circleSizes, filled, SIZES } from "#radio-group/circle.ts";

/**
 * Class name of the recipe, which the root's selector for the label reads.
 */
const CLASS = "radio-group";

/**
 * Palettes the palette axis offers: the ones that are not statuses.
 */
const HUES = ["primary", "secondary", "accent", "neutral"] as const;

/**
 * Defines the radio group recipe: solid circles at size `md` in the primary palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    item: {
      _disabled: { cursor: "disabled" },
      cursor: "button",
      display: "inline-flex",
      userSelect: "none",
    },
    itemControl: {
      ...circle(),
      ...touchTarget(),
      focusVisibleRing: "outside",
    },
    itemText: { _disabled: { layerStyle: "disabled" }, color: "fg" },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" },
    root: {
      _horizontal: {
        [`& > .${CLASS}__label`]: { flexBasis: "full" },
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
      },
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
    },
  },
  className: CLASS,
  defaultVariants: {
    align: "center",
    palette: "primary",
    size: "md",
    variant: "solid",
  },
  jsx: [/^RadioGroup(\.\w+)?$/u],
  slots: ["root", "label", "item", "itemControl", "itemText"],
  staticCss: [statusEmitted(), { palette: [...HUES] }],
  variants: {
    /**
     * Position of the circle against words that run to more than one line.
     *
     * @remarks
     *   `start` puts the circle on the first line, `center` halfway down the words.
     */
    align: {
      start: { item: { alignItems: "flex-start" } },

      center: { item: { alignItems: "center" } },
    },

    /**
     * Palette a checked circle fills with: primary, secondary, accent or neutral. A status color
     * comes from the status axis.
     */
    palette: onSlot("itemControl", paletteVariants(HUES)),

    /**
     * Circle size, text size and gaps. The circle reads the icon scale, the words the label role,
     * the gap inside a row the gap scale, and the room between horizontal rows the inset scale.
     */
    size: onSlots({
      item: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
      itemControl: circleSizes(),
      itemText: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.inset.${size}}`),
          rowGap: dense(`{spacing.gap.${size}}`),
        }),
        SIZES,
      ),
    }),

    /**
     * Status the circles report. Each value sets the edge and the palette, over the palette axis.
     */
    status: onSlot("itemControl", fieldStatusVariants()),

    /**
     * Surface of a circle at rest, and its fill while checked.
     *
     * @remarks
     *   No value writes a border color, so a status sets the edge in every look.
     */
    variant: onSlot("itemControl", {
      solid: filled("fill.solid"),

      subtle: { ...filled("fill.subtle"), background: "bg.muted" },

      outline: { ...filled("outline.solid", "0.6"), background: "transparent" },
    }),
  },
});
