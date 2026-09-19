/**
 * States what a button is: the element a person presses, drawn in a look and a size, in the
 * palette of its status, square where it holds one glyph, and glowing where a page asks.
 *
 * @remarks
 *   Every value is a layer style, a semantic control height, a semantic inset, a label role or a
 *   palette, so a theme moves all of them. The interactive fragment gives the cursor, the focus
 *   ring, the disabled layer and the transitions every control shares, and the touch target widens
 *   the hit area on a coarse pointer without moving the box. The border is drawn transparent at the
 *   small width in every look, so the outline look changes its colour and not its size. A press is
 *   read from the look's own pressed fill and from the elevation dropping under the pointer. The
 *   box scales rather than shifting, because a control that shifts under a press is one a reader
 *   can miss. The square is listed under `staticCss`, because the icon button fixes it through a
 *   default prop and no JSX literal writes it for the compiler to extract. A button that stays
 *   pressed states `aria-pressed`, and the fill it keeps while on is written against that
 *   attribute, so the fill and what a screen reader announces cannot disagree.
 */

import {
  controlSizes,
  defineRecipe,
  interactive,
  liftVariants,
  lookVariants,
  statusEmitted,
  statusVariants,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Draws a button on the primary palette in the solid look and the middle size until a caller says
 * otherwise, set inline so it sits in a line of controls.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    ...touchTarget(),
    _pressed: {
      background: "colorPalette.subtle",
      borderColor: "colorPalette.border",
      color: "colorPalette.fg",
    },
    alignItems: "center",
    appearance: "none",
    borderColor: "transparent",
    borderRadius: "l2",
    borderWidth: "sm",
    colorPalette: "primary",
    display: "inline-flex",
    flexShrink: "0",
    fontWeight: "medium",
    justifyContent: "center",
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
  ],
  defaultVariants: { size: "md", variant: "solid" },
  jsx: [/Button$/u],
  staticCss: [{ shape: ["square"] }, statusEmitted()],
  variants: {
    effect: {
      glow: { layerStyle: "glow.md" },
      ripple: { layerStyle: "ripple" },
    },
    elevation: liftVariants(),
    shape: {
      square: { aspectRatio: "square", paddingInline: "0" },
    },

    size: controlSizes(),
    status: statusVariants(),
    variant: { ...lookVariants(), glass: { layerStyle: "glass" } },
  },
});
