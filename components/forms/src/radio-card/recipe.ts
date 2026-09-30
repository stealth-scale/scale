/**
 * Recipe for the radio card: a set of cards a person chooses one of, each with room for a title,
 * a description, a circle and an addon row.
 *
 * @remarks
 *   Eight slots: the root lays the cards out, the label names the set, the item is the card, the
 *   content lays out the words and the circle, the text and the description are the words, the
 *   indicator is the circle and the addon is the row under the card's divider. The card is the
 *   target, so it renders the focus ring and the circle renders none. The card's styles come from
 *   `card.ts`, which the checkbox card shares, and the circle from the radio group's `circle.ts`,
 *   so the radio group and the radio card render one circle. A horizontal set lays the cards in
 *   columns of at least 12rem that share the width and wrap when it runs out, and every card in a
 *   row is as tall as the tallest. The recipe has no `effect` axis, because the card's checked look
 *   is its only emphasis.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
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
import { circle, circleSizes, filled } from "#radio-group/circle.ts";

/**
 * Class name of the recipe, which the root's selector for the label reads.
 */
const CLASS = "radio-card";

/**
 * Defines the radio card recipe: outline cards at size `md` in the primary palette, the circle at
 * the end of the words.
 */
export const recipe = defineSlotRecipe({
  base: {
    item: card(),
    itemAddon: addon(),
    itemContent: content(),
    itemDescription: description(),
    itemIndicator: {
      ...circle(),
      focusVisibleRing: "none",
    },
    itemText: title(),
    label: {
      _disabled: { layerStyle: "disabled" },
      color: "fg",
      fontWeight: "medium",
      gridColumn: "1 / -1",
    },
    root: {
      _horizontal: {
        gridTemplateColumns: "repeat(auto-fit, minmax(min({sizes.48}, 100%), 1fr))",
      },
      [`& > .${CLASS}__label`]: { gridColumn: "1 / -1" },
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
  className: CLASS,
  compoundVariants: [
    /**
     * Sets a checked card's edge to `Highlight` under forced colors, over every look.
     */
    {
      css: { item: forcedEdge() },
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
  jsx: [/^RadioCard(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "item",
    "itemContent",
    "itemText",
    "itemDescription",
    "itemIndicator",
    "itemAddon",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Alignment of the words in a card.
     */
    align: {
      start: { itemContent: aligned("start") },

      center: { itemAddon: { textAlign: "center" }, itemContent: aligned("center") },
    },

    /**
     * Place of the circle: at the end of the words, or above them.
     */
    layout: {
      inline: { itemContent: laidOut("inline").content, itemIndicator: laidOut("inline").mark },

      stacked: {
        itemContent: laidOut("stacked").content,
        itemIndicator: laidOut("stacked").mark,
      },
    },

    /**
     * Palette of the checked card and its circle.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Circle size, padding, gaps and text sizes. The padding reads the inset scale, the gaps the
     * gap scale, the title the label role and the description and the addon the body role one size
     * smaller.
     */
    size: onSlots({
      itemAddon: addonSizes(),
      itemContent: contentSizes(),
      itemDescription: descriptionSizes(),
      itemIndicator: circleSizes(),
      itemText: titleSizes(),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
    }),

    /**
     * Surface of a card at rest and while checked, and the circle that goes with it.
     *
     * @remarks
     *   `solid` fills a checked card with the palette's solid, `subtle` rests on the muted surface
     *   and deepens to the palette's muted fill, `surface` tints a checked card with the palette's
     *   subtle fill, and `outline` sets a checked card's edge to the palette's solid. A circle on a
     *   solid card is the panel color with a dot in the palette's solid.
     */
    variant: {
      solid: {
        item: solidCard(),
        itemAddon: onSolid(),
        itemDescription: onSolid(),
        itemIndicator: {
          _checked: {
            _after: { scale: "0.4" },
            background: "bg.panel",
            borderColor: "colorPalette.contrast",
            color: "colorPalette.solid",
          },
        },
      },

      subtle: {
        item: subtleCard(),
        itemIndicator: { ...filled("outline.solid", "0.6"), background: "transparent" },
      },

      surface: { item: surfaceCard(), itemIndicator: filled("fill.solid") },

      outline: { item: outlineCard(), itemIndicator: filled("fill.solid") },
    },
  },
});
