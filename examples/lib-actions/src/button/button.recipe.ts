/**
 * Declares the button recipe: an interactive control with a look, a size and a palette.
 *
 * @remarks
 *   Every value is a semantic token, a layer style or a text style, so a theme can change each of
 *   them. The looks use the palette's roles, and the `palette` axis sets `colorPalette`, so an
 *   error button and a primary button share one recipe. The axis matches the `palette` axis of
 *   `@stealthscale/component-actions`, whose recipe has the same class name. An application that
 *   installs both packages compiles one set of `button--palette_*` classes.
 */

import {
  controlSizes,
  defineRecipe,
  interactive,
  lookVariants,
  PALETTES,
  paletteVariants,
  stack,
} from "@stealthscale/theme/authoring";

/**
 * Styles a button as a centred row with a focus ring, a medium corner and the primary palette. A
 * large solid button is set in bold with wide tracking.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    ...stack({ align: "center", direction: "row", gap: "gap.sm", justify: "center" }),
    borderRadius: "l2",
    colorPalette: "primary",
    display: "inline-flex",
    fontWeight: "medium",
    whiteSpace: "nowrap",
  },
  className: "button",
  compoundVariants: [
    {
      css: { fontWeight: "bold", letterSpacing: "wide" },
      name: "hero",
      size: "lg",
      variant: "solid",
    },
  ],
  defaultVariants: { size: "md", variant: "solid" },
  jsx: [/Button$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    palette: paletteVariants(),
    size: controlSizes(["sm", "md", "lg"]),
    variant: lookVariants(["solid", "subtle", "outline", "ghost"]),
  },
});
