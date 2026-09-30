/**
 * Recipe for the checkbox card: a card a person checks and unchecks, with room for a title, a
 * description, a box and an addon row.
 *
 * @remarks
 *   Seven slots: the root is the card, the content lays out the words and the box, the label and
 *   the description are the words, the control is the box, the indicator is the mark inside the
 *   box and the addon is the row under the card's divider. The card's styles come from `card.ts`,
 *   which the radio card shares, so the two cards differ only in the mark. The card is the target,
 *   so it renders the focus ring and the box renders none. The box reads the theme's field
 *   fragment as the checkbox's box does, without the fragment's coarse-pointer height, and an `svg`
 *   in the indicator fills it. A partly-on card fills its box and not the card. The recipe has no
 *   `effect` axis, because the card's checked look is its only emphasis.
 */

import {
  defineSlotRecipe,
  dense,
  field,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import {
  addon,
  addonSizes,
  aligned,
  card,
  content,
  contentSizes,
  description,
  descriptionSizes,
  forcedEdge,
  laidOut,
  onSolid,
  outlineCard,
  SIZES,
  solidCard,
  subtleCard,
  surfaceCard,
  title,
  titleSizes,
} from "#card.ts";

/**
 * Returns the base of the box: the field's edge and states without its coarse-pointer height,
 * centring the mark.
 */
function boxed(): SystemStyleObject {
  const { _touch: _raised, ...edged } = field();

  return {
    ...edged,
    alignItems: "center",
    borderRadius: "l1",
    display: "inline-flex",
    flexShrink: 0,
    focusVisibleRing: "none",
    justifyContent: "center",
  };
}

/**
 * Returns a look that fills the box with a layer style while it is checked or partly on.
 */
function filled(layerStyle: string): SystemStyleObject {
  return { _checked: { layerStyle }, _indeterminate: { layerStyle } };
}

/**
 * Defines the checkbox card recipe: an outline card at size `md` in the primary palette, the box at
 * the end of the words.
 */
export const recipe = defineSlotRecipe({
  base: {
    addon: addon(),
    content: content(),
    control: boxed(),
    description: description(),
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
    label: title(),
    root: card(),
  },
  className: "checkbox-card",
  compoundVariants: [
    /**
     * Sets a checked card's edge to `Highlight` under forced colors, over every look.
     */
    {
      css: { root: forcedEdge() },
      name: "forced-edge",
      variant: ["solid", "subtle", "surface", "outline"],
    },
  ],
  defaultVariants: {
    align: "start",
    layout: "inline",
    palette: "primary",
    size: "md",
    variant: "outline",
  },
  jsx: [/^CheckboxCard(\.\w+)?$/u],
  slots: ["root", "content", "label", "description", "control", "indicator", "addon"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Alignment of the words in the card.
     */
    align: {
      start: { content: aligned("start") },

      center: { addon: { textAlign: "center" }, content: aligned("center") },
    },

    /**
     * Place of the box: at the end of the words, or above them.
     */
    layout: {
      inline: { content: laidOut("inline").content, control: laidOut("inline").mark },

      stacked: { content: laidOut("stacked").content, control: laidOut("stacked").mark },
    },

    /**
     * Palette of the checked card and its box.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Box size, padding, gaps and text sizes. The box reads the icon scale, the padding the inset
     * scale, the gaps the gap scale, the title the label role and the description and the addon the
     * body role one size smaller.
     */
    size: onSlots({
      addon: addonSizes(),
      content: contentSizes(),
      control: sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }), SIZES),
      description: descriptionSizes(),
      label: titleSizes(),
    }),

    /**
     * Surface of the card at rest and while checked, and the box that goes with it.
     *
     * @remarks
     *   `solid` fills a checked card with the palette's solid, `subtle` rests on the muted surface
     *   and deepens to the palette's muted fill, `surface` tints a checked card with the palette's
     *   subtle fill, and `outline` sets a checked card's edge to the palette's solid. A checked box
     *   on a solid card is the panel color with the mark in the palette's solid.
     */
    variant: {
      solid: {
        addon: onSolid(),
        control: {
          _checked: {
            background: "bg.panel",
            borderColor: "colorPalette.contrast",
            color: "colorPalette.solid",
          },
          _indeterminate: { layerStyle: "fill.solid" },
        },
        description: onSolid(),
        root: solidCard(),
      },

      subtle: {
        control: { ...filled("outline.solid"), background: "transparent" },
        root: subtleCard(),
      },

      surface: { control: filled("fill.solid"), root: surfaceCard() },

      outline: { control: filled("fill.solid"), root: outlineCard() },
    },
  },
});
