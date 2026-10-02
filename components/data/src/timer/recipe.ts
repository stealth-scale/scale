/**
 * Defines the timer's recipe: the count in tabular figures on the heading scale, and the buttons
 * that run it.
 *
 * @remarks
 *   Every figure is as wide as every other, so the count keeps its width while it ticks. A look
 *   other than `plain` sets each part in a tile of that flat look, padded by the insets the root
 *   sets per size, and under forced colors a tile keeps a `CanvasText` edge. The buttons are the
 *   library's `Button`, and a button the machine hides takes no room. The palette colors the tiles
 *   and, through the root, the buttons.
 */

import {
  axis,
  below,
  defineSlotRecipe,
  dense,
  type Flat,
  FLATS,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the timer offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Text style of the count at each size.
 */
const DIGITS = { lg: "heading.2xl", md: "heading.lg", sm: "heading.sm" };

/**
 * Custom property the root sets to a tile's block padding.
 */
const BLOCK = "--timer-tile-block";

/**
 * Custom property the root sets to a tile's inline padding.
 */
const INLINE = "--timer-tile-inline";

/**
 * Styles a part of the count in one flat look: bare for `plain`, and a padded, rounded tile for
 * every other look.
 *
 * @param look - The flat look.
 * @returns The part's styles.
 */
function tiled(look: Flat): SystemStyleObject {
  if (look === "plain") return { layerStyle: "flat.plain" };

  return {
    _highContrast: {
      outlineColor: "CanvasText",
      outlineOffset: "calc({borderWidths.hairline} * -1)",
      outlineStyle: "solid",
      outlineWidth: "hairline",
    },
    borderRadius: "l2",
    layerStyle: `flat.${look}`,
    paddingBlock: `var(${BLOCK})`,
    paddingInline: `var(${INLINE})`,
  };
}

/**
 * Defines the timer recipe at size `md` in the `plain` look by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    actionTrigger: { "&[hidden]": { display: "none" } },
    area: { alignItems: "center", display: "inline-flex", fontVariantNumeric: "tabular-nums" },
    control: { alignItems: "center", display: "inline-flex", flexWrap: "wrap" },
    item: { color: "fg", fontWeight: "semibold", textAlign: "center" },
    root: { alignItems: "flex-start", display: "inline-flex", flexDirection: "column" },
    separator: { color: "fg.muted" },
  },
  className: "timer",
  defaultVariants: { size: "md", variant: "plain" },
  jsx: [/^Timer\.\w+$/u],
  slots: ["root", "area", "item", "separator", "control", "actionTrigger"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Glow around each tile, in the palette's solid at half opacity. `pulse` animates it and stops
     * under reduced motion.
     */
    effect: onSlot("item", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),

    /**
     * Palette of the tiles and the buttons.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Text style of the count and the separators, tile insets, and the gaps between the parts.
     *
     * @remarks
     *   The count reads the heading role at `sm`, `lg` and `2xl`: 18, 22.8 and 32.4px at the
     *   foundation's scale.
     */
    size: onSlots({
      area: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      control: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      item: sizeVariants((size) => ({ textStyle: DIGITS[size] }), SIZES),
      root: sizeVariants(
        (size) => ({
          [BLOCK]: dense(`{spacing.gap.${below(size)}}`),
          gap: dense(`{spacing.gap.${size}}`),
          [INLINE]: dense(`{spacing.gap.${size}}`),
        }),
        SIZES,
      ),
      separator: sizeVariants((size) => ({ textStyle: DIGITS[size] }), SIZES),
    }),

    /**
     * Look of each part of the count: bare, or a tile in a flat look.
     */
    variant: onSlot("item", axis(FLATS, tiled)()),
  },
});
