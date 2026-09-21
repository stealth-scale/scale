/**
 * Styles every element bound to the button recipe.
 *
 * @remarks
 *   Each declared value resolves to a token, so a theme can shift all of them at once. The border
 *   is transparent at the control width in every look, which leaves the outline look the same size
 *   as the others rather than one border wider. Nothing in the geometry responds to a press; the
 *   feedback is the pressed fill, the ripple and the elevation dropping, because a control that
 *   shifts under the pointer is easy to overlook. `shape="square"` and `status="neutral"` are
 *   repeated under `staticCss`: the icon button sets the first through a default prop and a toolbar
 *   sets the second through a provider, so neither appears in a JSX literal for the extractor to
 *   find.
 */

import {
  controlSizes,
  defineRecipe,
  interactive,
  liftVariants,
  lookVariants,
  statusEmitted,
  statusVariants,
  type SystemStyleObject,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Builds the background a look carries while the button is on.
 *
 * @remarks
 *   On means `aria-pressed` or `aria-current="page"`, so the background cannot contradict what a
 *   screen reader announces. Pass `colorPalette.subtle` for a look with no resting background and
 *   `colorPalette.muted` for one that already sits on the subtle token, which moves either of them
 *   exactly one step. These land in a compound variant rather than the base because the compiler
 *   emits a look's own background into a later cascade layer than the base, and the later layer
 *   wins regardless of selector specificity.
 * @returns The `_currentPage` and `_pressed` styles for one look.
 */
function on(background: "colorPalette.muted" | "colorPalette.subtle"): SystemStyleObject {
  return {
    _currentPage: { background, color: "colorPalette.fg", fontWeight: "semibold" },
    _pressed: { background, borderColor: "colorPalette.border", color: "colorPalette.fg" },
  };
}

/**
 * Builds the inset outline a filled look carries while the button is on.
 *
 * @remarks
 *   A look that already sits on a solid background has no background left to spend: the on colour
 *   would collide with the hover colour, which the pointer removes again on the way out. An inset
 *   shadow in the label colour survives a hover, a focus ring drawn outside the element, and
 *   forced-colours mode, where the user agent replaces every background. `:active` remains the
 *   momentary press; this state persists.
 * @returns The `_currentPage` and `_pressed` styles for a look that already carries a background.
 */
function marked(): SystemStyleObject {
  return {
    _currentPage: { boxShadow: "inset", fontWeight: "semibold" },
    _pressed: { boxShadow: "inset", fontWeight: "semibold" },
  };
}

/**
 * Declares the button's base styles and its six variant axes, defaulting to the solid look at the
 * md size on the primary palette.
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
  staticCss: [{ shape: ["square"] }, statusEmitted(), { status: ["neutral"] }],
  variants: {
    /**
     * The optional halo a page can put behind a button.
     *
     * @remarks
     *   Both values take the palette's solid token at half opacity, so a status or a theme carries
     *   them along. `pulse` sets `boxShadowColor` instead of reusing the glow layer style because
     *   its keyframe writes the entire shadow and would overwrite a static one. A moving border is
     *   deliberately absent: `border.moving` paints the panel colour over the padding box to mask
     *   its conic gradient, which destroys whatever background the look applied, and drawing the
     *   ring without the background needs a pseudo-element that is already taken — `::after` by the
     *   ripple and `::before` by the touch target.
     */
    effect: {
      glow: { layerStyle: "glow.md" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    },
    elevation: liftVariants(),
    shape: {
      square: { aspectRatio: "square", paddingInline: "0" },
    },
    size: controlSizes(),
    status: { ...statusVariants(), neutral: { colorPalette: "neutral" } },
    variant: { ...lookVariants(), glass: { layerStyle: "glass" } },
  },
});
