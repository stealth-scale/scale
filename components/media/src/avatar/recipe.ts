/**
 * Declares the avatar's slot recipe: a box with a person's picture, or with their initials while
 * the picture is missing, loading or broken, and a group that overlaps several boxes.
 *
 * @remarks
 *   The box is a square on the control scale, so an avatar is as tall as a button of its size: 32,
 *   36, 40, 44, 48 and 56px from `xs` to `2xl`. `2xs` is the middle tag height, 24px, for a byline
 *   or a list row. The root sets its side as `--avatar-size`, and a group overlaps each avatar with
 *   the one before it by a quarter of that side. The image covers the box and takes the root's
 *   corners, and the root clips nothing, so a badge can overhang its edge. The fallback centres the
 *   initials in the label style of the avatar's size. The looks are the flat layer styles, because
 *   an avatar is read and not pressed, and the look and the palette color the fallback alone. A
 *   group rings each avatar in `bg.panel` with an outline, which is drawn outside the box and
 *   leaves the fill's curved edge alone. Under forced colors the box keeps a hairline `CanvasText`
 *   outline, because a look without an edge loses its shape there.
 */

import {
  defineSlotRecipe,
  dense,
  flatVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the root sets to its side, which a group and a badge read.
 */
export const SIZE = "--avatar-size";

/**
 * Sizes the avatar offers on the control scale.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Styles an element the machine hides with the `hidden` attribute, which a `display` value in the
 * recipe would override.
 */
const HIDDEN = { "&[hidden]": { display: "none" } };

/**
 * Styles a subtle circle at the middle size in the neutral palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    fallback: {
      ...HIDDEN,
      "& > svg": { blockSize: "50%", inlineSize: "50%" },
      alignItems: "center",
      blockSize: "full",
      display: "flex",
      inlineSize: "full",
      justifyContent: "center",
      lineHeight: "1",
      textTransform: "uppercase",
    },
    group: {
      "& > .avatar__root": {
        outlineColor: "bg.panel",
        outlineStyle: "solid",
        outlineWidth: "indicator",
      },
      "& > .avatar__root + .avatar__root": { marginInlineStart: `calc(var(${SIZE}) / -4)` },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      verticalAlign: "middle",
    },
    image: {
      ...HIDDEN,
      blockSize: "full",
      borderRadius: "inherit",
      display: "block",
      inlineSize: "full",
      objectFit: "cover",
    },
    root: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      alignItems: "center",
      blockSize: `var(${SIZE})`,
      colorPalette: "neutral",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "medium",
      inlineSize: `var(${SIZE})`,
      justifyContent: "center",
      position: "relative",
      userSelect: "none",
      verticalAlign: "middle",
    },
  },
  className: "avatar",
  defaultVariants: { shape: "circle", size: "md", variant: "subtle" },
  jsx: [/^Avatar\.\w+$/u],
  slots: ["root", "image", "fallback", "group"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the box, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` animates the halo and stops under reduced motion, for a person who is speaking.
     */
    effect: onSlot("root", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),
    palette: onSlot("root", paletteVariants()),

    /**
     * The corners of the box: a circle for a person, and a rounded or square box for a company, a
     * service or a bot.
     */
    shape: onSlot("root", {
      circle: { borderRadius: "full" },
      rounded: { borderRadius: "l2" },
      square: { borderRadius: "none" },
    }),

    /**
     * The side of the box and the initials in the label style of that size.
     *
     * @remarks
     *   `2xs` is the middle tag height with the smallest text style, because the control scale and
     *   the label role start at `xs`.
     */
    size: onSlots({
      fallback: {
        "2xs": { textStyle: "2xs" },
        ...sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      },
      root: {
        "2xs": { [SIZE]: dense("{sizes.tag.md}") },
        ...sizeVariants((size) => ({ [SIZE]: dense(`{sizes.control.${size}}`) }), SIZES),
      },
    }),
    variant: onSlot("root", flatVariants(["solid", "subtle", "surface", "outline"])),
  },
});
