/**
 * Declares the button recipe: the base styles and the axes a caller sets.
 *
 * @remarks
 *   Every value is a token, so a theme moves all of them. The border is transparent at the control
 *   width in every look, so the outline look is the same size as the others. A press changes the
 *   fill, spreads the ripple and lowers the elevation, and never moves the box, because a target
 *   that shifts under the pointer is easy to miss. `staticCss` lists `shape="square"` and every
 *   palette. The icon button sets the shape through a default prop, and callers set the palette
 *   through a provider or from data, so the compiler extracts neither from source.
 */

import {
  controlSizes,
  defineRecipe,
  interactive,
  liftVariants,
  lookVariants,
  PALETTES,
  paletteVariants,
  type SystemStyleObject,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Returns the `_currentPage` and `_pressed` styles of a look with no fill of its own.
 *
 * @remarks
 *   A button is on when it has `aria-pressed="true"` or `aria-current="page"`, so the fill matches
 *   what a screen reader announces. The styles go in a compound variant, not the base, because the
 *   compiler emits a look's background in a later cascade layer than the base, and the later layer
 *   wins whatever the selector's specificity. Pass `colorPalette.subtle` for a look with no resting
 *   fill and `colorPalette.muted` for a look that rests on the subtle fill, so the on state is one
 *   step deeper in both.
 */
function on(background: "colorPalette.muted" | "colorPalette.subtle"): SystemStyleObject {
  return {
    _currentPage: { background, color: "colorPalette.fg", fontWeight: "semibold" },
    _pressed: { background, borderColor: "colorPalette.border", color: "colorPalette.fg" },
  };
}

/**
 * Returns the `_currentPage` and `_pressed` styles of the solid look.
 *
 * @remarks
 *   The solid look has no deeper fill left, and any other fill would match its hover fill. An inset
 *   shadow in the label ink stays visible under hover, beside a focus ring drawn outside the
 *   element, and in forced colors mode, where the browser replaces every background. `:active`
 *   stays the momentary press.
 */
function marked(): SystemStyleObject {
  return {
    _currentPage: { boxShadow: "inset", fontWeight: "semibold" },
    _pressed: { boxShadow: "inset", fontWeight: "semibold" },
  };
}

/**
 * Styles a button, defaulting to the solid look at the md size in the primary palette.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    ...touchTarget(),
    alignItems: "center",
    appearance: "none",
    borderColor: "transparent",
    borderRadius: "l2",
    borderWidth: "control",
    colorPalette: "primary",
    display: "inline-flex",
    flexShrink: "0",
    fontWeight: "medium",
    justifyContent: "center",
    layerStyle: "ripple",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  className: "button",
  compoundVariants: [
    {
      css: { "&:has(> svg:first-child)": { paddingInline: "0" } },
      name: "squared",
      shape: "square",
    },
    {
      css: on("colorPalette.subtle"),
      name: "on",
      variant: ["ghost", "glass", "outline", "plain"],
    },
    {
      css: on("colorPalette.muted"),
      name: "on-deeper",
      variant: ["subtle", "surface"],
    },
    {
      css: marked(),
      name: "on-marked",
      variant: ["solid"],
    },
  ],
  defaultVariants: { size: "md", variant: "solid" },
  jsx: [/Button$/u],
  staticCss: [{ shape: ["square"] }, { palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the button, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` sets `boxShadowColor` because its keyframe writes the whole `box-shadow`, which
     *   would replace a static glow. No moving border is offered. `border.moving` paints over the
     *   padding box and hides the look's fill, and a ring drawn without it needs a pseudo-element,
     *   but `::after` holds the ripple and `::before` the touch target.
     */
    effect: {
      glow: { layerStyle: "glow.md" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    },
    elevation: liftVariants(),

    /**
     * The palette every look draws in. The base draws in `primary`.
     *
     * @remarks
     *   `neutral` draws a control in the ink of the text around it, for a button in a toolbar.
     */
    palette: paletteVariants(),
    shape: {
      square: { aspectRatio: "square", paddingInline: "0" },
    },
    size: controlSizes(),
    variant: { ...lookVariants(), glass: { layerStyle: "glass" } },
  },
});
