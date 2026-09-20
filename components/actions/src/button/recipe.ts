/**
 * States what a button is: the element a person presses, drawn in a look and a size, in the
 * palette of its status, square where it holds one glyph, and glowing where a page asks.
 *
 * @remarks
 *   Every value is a layer style, a semantic control height, a semantic inset, a label role or a
 *   palette, so a theme moves all of them. The interactive fragment gives the cursor, the focus
 *   ring, the disabled layer and the transitions every control shares, and the touch target widens
 *   the hit area on a coarse pointer without moving the box. The border is drawn transparent at the
 *   control's width in every look, so the outline look changes its colour and not its size. A press
 *   is read from the look's own pressed fill, from the ripple every button carries, which spreads
 *   from the middle of the box over the press and fades on the release, and from the elevation
 *   dropping under the pointer. The box holds still, because a control that shrinks or shifts under
 *   a press is one a reader can miss. The square is listed under `staticCss`, because the icon
 *   button fixes it through a default prop and no JSX literal writes it for the compiler to
 *   extract. The `status` axis offers `neutral` beside the four statuses, for a control in a bar
 *   that reads in the ink of the words beside it, and it is listed under `staticCss` for the same
 *   reason as the square: a bar sets it through a provider. A button that stays on states
 *   `aria-pressed`, and a link drawn as a button in a bar of an application's sections states
 *   `aria-current="page"` on the section being read. The fill each keeps while on is written
 *   against those attributes, so the fill and what a screen reader announces cannot disagree. It is
 *   written in a compound over the looks rather than in the base, because the compiler emits a
 *   look's own fill in a later cascade layer than the base and the later layer wins whatever the
 *   selector's specificity. The quiet looks take the palette's subtle fill, and the two looks
 *   already drawn in it take the muted fill, so a control that is on stands one step off its rest
 *   in every look that has room to.
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
 * Writes the fill a button keeps while it is on, for a look drawn without one at rest.
 */
function on(background: "colorPalette.muted" | "colorPalette.subtle"): SystemStyleObject {
  return {
    _currentPage: { background, color: "colorPalette.fg", fontWeight: "semibold" },
    _pressed: { background, borderColor: "colorPalette.border", color: "colorPalette.fg" },
  };
}

/**
 * Writes the mark a button keeps while it is on, for a look already drawn on a fill at rest.
 *
 * @remarks
 *   A solid or a fill look has nowhere left to go in background: the pressed fill would be the
 *   hover fill, which a pointer takes away again. The mark is a line drawn inside the button's own
 *   edge in the color its label is written in, so it survives a hover, a focus ring outside the
 *   button, and a forced-color mode that replaces every fill. `:active` stays the momentary press
 *   and this is the state that lasts.
 */
function marked(): SystemStyleObject {
  return {
    _currentPage: { boxShadow: "inset", fontWeight: "semibold" },
    _pressed: { boxShadow: "inset", fontWeight: "semibold" },
  };
}

/**
 * Draws a button on the primary palette in the solid look and the middle size until a caller says
 * otherwise, set inline so it sits in a line of controls, with a ripple under every press.
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
     * The candy a page can ask a button for.
     *
     * @remarks
     *   Both read the palette's solid at half strength, so a status or a theme moves them. `glow`
     *   holds still and `pulse` breathes between nothing and the same spread, which is why the
     *   pulse states the shadow's colour rather than reading the glow layer style: the keyframe
     *   writes the whole shadow and would overwrite a static one anyway.
     *   The moving border is not here. `border.moving` paints the panel colour across the padding
     *   box to mask the conic gradient inside the edge, so it replaces whatever fill the look
     *   painted and leaves a solid button drawing its contrast ink on a panel. Drawing the ring
     *   without touching the fill needs a pseudo-element, and a button has neither left: the ripple
     *   holds `::after` and the touch target holds `::before`.
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
