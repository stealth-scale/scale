/**
 * Declares the avatar badge's recipe: a mark pinned to one corner of an avatar, half over the
 * picture, which is a status dot when empty and grows around a count, an emoji or an icon.
 *
 * @remarks
 *   The badge centres on the point where the avatar's diagonal crosses its rim, 14.64% of the side
 *   in from the corner, and a rounded or square avatar takes the same point. An empty badge is 28%
 *   of the avatar's side and never under 8px. A badge with content is 40% of the side and never
 *   under 16px, its text is 60% of its own height, and a longer count widens it into a pill. The
 *   ring is an outline in `bg.panel`, which cuts the badge away from the picture behind it. Under
 *   forced colors the badge keeps its palette, and its label states the same thing in words.
 */

import {
  defineRecipe,
  flatVariants,
  PALETTES,
  paletteVariants,
} from "@stealthscale/theme/authoring";

import { SIZE } from "#avatar/recipe.ts";

/**
 * Custom property the badge sets to its own side.
 */
export const BADGE = "--avatar-badge-size";

/**
 * Distance from the avatar's edges to the point where its diagonal crosses its rim.
 */
const RIM = `calc(var(${SIZE}) * 0.1464)`;

/**
 * Styles a neutral dot in the solid look on the avatar's bottom end corner.
 */
export const recipe = defineRecipe({
  base: {
    _highContrast: { forcedColorAdjust: "none" },
    "&:not(:empty)": {
      [BADGE]: `max({sizes.4}, calc(var(${SIZE}) * 0.4))`,
      fontSize: `calc(var(${BADGE}) * 0.6)`,
      paddingInline: `calc(var(${BADGE}) * 0.2)`,
    },
    "& > svg": { blockSize: "75%", inlineSize: "75%" },
    alignItems: "center",
    [BADGE]: `max({sizes.2}, calc(var(${SIZE}) * 0.28))`,
    blockSize: `var(${BADGE})`,
    borderRadius: "full",
    display: "inline-flex",
    fontVariantNumeric: "tabular-nums",
    fontWeight: "semibold",
    justifyContent: "center",
    lineHeight: "1",
    minInlineSize: `var(${BADGE})`,
    outlineColor: "bg.panel",
    outlineStyle: "solid",
    outlineWidth: "control",
    position: "absolute",
    whiteSpace: "nowrap",
  },
  className: "avatar-badge",
  defaultVariants: { palette: "neutral", placement: "bottom-end", variant: "solid" },
  jsx: [/^Avatar\.Badge$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    palette: paletteVariants(),

    /**
     * The corner the badge is pinned to, in the direction of the text.
     */
    placement: {
      "bottom-end": {
        _rtl: { translate: "-50% 50%" },
        insetBlockEnd: RIM,
        insetInlineEnd: RIM,
        translate: "50% 50%",
      },
      "bottom-start": {
        _rtl: { translate: "50% 50%" },
        insetBlockEnd: RIM,
        insetInlineStart: RIM,
        translate: "-50% 50%",
      },
      "top-end": {
        _rtl: { translate: "-50% -50%" },
        insetBlockStart: RIM,
        insetInlineEnd: RIM,
        translate: "50% -50%",
      },
      "top-start": {
        _rtl: { translate: "50% -50%" },
        insetBlockStart: RIM,
        insetInlineStart: RIM,
        translate: "-50% -50%",
      },
    },
    variant: flatVariants(["solid", "subtle"]),
  },
});
