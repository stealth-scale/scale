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
 *   compiler emits a look's background in a later cascade layer than the base, and a later layer
 *   applies over an earlier one at any specificity. Pass `colorPalette.subtle` for a look with no
 *   resting fill and `colorPalette.muted` for a look that rests on the subtle fill, so the on state
 *   is one step deeper in both.
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
 *   The solid look has no deeper fill, and any other fill matches its hover fill. The on state is
 *   an inset shadow in the label ink, which is visible under hover, beside a focus ring outside the
 *   element, and in forced colors mode, where the browser replaces every background. `:active` is
 *   the momentary press.
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
    /**
     * Zeroes the inline padding of a square button.
     *
     * @remarks
     *   The compiler emits the size axis after the shape axis, and the size axis sets the padding,
     *   so the reset is a compound. `aspect-ratio` fixes the width, so padding only narrows the
     *   content box: at md, 16px each side leaves 6px for a 16px icon.
     */
    {
      css: { paddingInline: "0" },
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
     *   replaces a static glow. The axis offers no moving border. `border.moving` paints over the
     *   padding box and hides the look's fill, and a ring without it needs a pseudo-element, but
     *   `::after` renders the ripple and `::before` the touch target.
     */
    effect: {
      glow: { layerStyle: "glow.md" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    },
    elevation: liftVariants(),

    /**
     * Palette of every look. The base sets `primary`.
     *
     * @remarks
     *   `neutral` renders the control in the surrounding text ink, for a button in a toolbar.
     */
    palette: paletteVariants(),
    shape: {
      square: { aspectRatio: "square" },
    },
    size: controlSizes(),
    variant: { ...lookVariants(), glass: { layerStyle: "glass" } },
  },
});
