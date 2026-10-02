/**
 * Defines the QR code's recipe: the code on a light ground in both color modes, with a mark over
 * its middle.
 *
 * @remarks
 *   The frame's grounds and pattern and the mark render in the light scheme, so the pattern is dark
 *   on light on a dark page as well, the contrast a camera reads. The frame itself keeps the page's
 *   scheme, so its glow reads on the page. The frame and the mark take the first cell of the
 *   root's grid, and the machine places the mark absolutely, so the mark centres on the code's cell
 *   whatever else the root contains. Under forced colors the frame and the mark keep their colors,
 *   because the colors are the data.
 */

import {
  axis,
  defineSlotRecipe,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the code offers.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Step of the size grid the code's side reads at each size: 64, 80, 128, 160, 192 and 256px.
 */
const SIDE = { "2xl": "64", lg: "40", md: "32", sm: "20", xl: "48", xs: "16" };

/**
 * Custom property the root sets to the code's side.
 */
const SIDE_PROPERTY = "--qr-code-side";

/**
 * Places a part in the grid cell of the code.
 *
 * @remarks
 *   The area sets all four grid lines. An absolutely placed part with an `auto` end line spans to
 *   the root's padding edge, which places the mark 22px below the code's centre above a row of
 *   buttons.
 */
const CELL: SystemStyleObject = { gridArea: "1 / 1 / 2 / 2" };

/**
 * Keeps a part's colors and scheme: dark on light in both color modes and under forced colors.
 */
const LIGHT: SystemStyleObject = { colorScheme: "light", forcedColorAdjust: "none" };

/**
 * Defines the QR code recipe at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    frame: {
      ...CELL,
      "& > *": { colorScheme: "light" },
      "& > rect": { fill: "bg" },
      aspectRatio: "square",
      borderRadius: "l2",
      display: "block",
      forcedColorAdjust: "none",
      inlineSize: `var(${SIDE_PROPERTY})`,
      overflow: "hidden",
    },
    overlay: {
      ...CELL,
      ...LIGHT,
      "& > img, & > svg": { blockSize: "full", inlineSize: "full" },
      alignItems: "center",
      aspectRatio: "square",
      color: "fg",
      display: "flex",
      inlineSize: `calc(var(${SIDE_PROPERTY}) / 4)`,
      justifyContent: "center",
      padding: "1",
    },
    pattern: { fill: "fg" },
    root: { display: "inline-grid", gap: "gap.md", justifyItems: "center" },
  },
  className: "qr-code",
  defaultVariants: { size: "md" },
  jsx: [/^QrCode\.\w+$/u],
  slots: ["root", "frame", "pattern", "overlay", "downloadTrigger"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Glow around the code, in the palette's solid at half opacity. `pulse` animates it and stops
     * under reduced motion.
     */
    effect: onSlot("frame", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),

    /**
     * Palette of the pattern and the mark, in the palette's solid. Without one they are `fg`.
     */
    palette: onSlots({
      overlay: axis(PALETTES, () => ({ color: "colorPalette.solid" }))(),
      pattern: axis(PALETTES, () => ({ fill: "colorPalette.solid" }))(),
      root: paletteVariants(),
    }),

    /**
     * Side of the code on the size grid, or the width of its container at `full`.
     */
    size: onSlot("root", {
      ...sizeVariants((size) => ({ [SIDE_PROPERTY]: `{sizes.${SIDE[size]}}` }), SIZES),
      full: { inlineSize: "full", [SIDE_PROPERTY]: "{sizes.full}" },
    }),
  },
});
