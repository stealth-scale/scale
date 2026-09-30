/**
 * Returns the lengths and the shared styles the color picker's recipe places its parts by.
 *
 * @remarks
 *   The trigger, the eye dropper and the format trigger are buttons in the look of a field, so a
 *   row of a text input and one of them reads as one row. The area's thumb and a slider's thumb
 *   are one circle of the color under them, inside an edge in `bg.panel` and a hairline in
 *   `border.emphasized`. One of the two tones contrasts with any color the area and the tracks
 *   paint, in either color mode.
 */

import { dense, field, type SystemStyleObject, touchTarget } from "@stealthscale/theme/authoring";

import { type Size } from "#dropdown.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "color-picker";

/**
 * Custom property a slider's track receives its gradient in, which the track paints over the
 * checkerboard on the alpha channel.
 */
export const GRADIENT = "--color-picker-gradient";

/**
 * Custom property a thumb receives the color under it in, which the thumb fills its padding box
 * with.
 */
export const FILL = "--color-picker-thumb";

/**
 * Checkerboard under a translucent color, in the page's two quietest surfaces, the one the color
 * swatch paints.
 */
export const CHECKER =
  "repeating-conic-gradient({colors.bg.emphasized} 0% 25%, {colors.bg} 0% 50%)";

/**
 * Maps each size to the step of the grid a swatch trigger's side reads: 24, 28 and 32px.
 */
const SWATCHES: Readonly<Record<Size, string>> = { lg: "8", md: "7", sm: "6" };

/**
 * Returns the side of a control at a size, the height an input of the same size has.
 */
export function controlSide(size: Size): string {
  return dense(`{sizes.control.${size}}`);
}

/**
 * Returns the side of a swatch trigger at a size, and at least 24px, the WCAG 2.5.8 target size.
 */
export function swatchSide(size: Size): string {
  return `max({sizes.6}, ${dense(`{sizes.${SWATCHES[size]}}`)})`;
}

/**
 * Returns the styles of a thumb, a 16px circle filled with the color under it.
 *
 * @remarks
 *   A 2px edge in `bg.panel` and a hairline in `border.emphasized` ring the circle, and the focus
 *   ring is drawn outside both. The fill stops at the padding box, so no pixel of the color shows
 *   outside the edge where a browser smooths the curve. The machine places the thumb absolutely,
 *   so the area a coarse pointer hits keeps the thumb's own position.
 */
export function thumb(): SystemStyleObject {
  const { _touch: TOUCH } = touchTarget();

  return {
    _disabled: { cursor: "disabled" },
    _touch: { ...TOUCH, position: "absolute" },
    backgroundClip: "padding-box",
    backgroundColor: `var(${FILL})`,
    borderColor: "bg.panel",
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "md",
    boxShadow: "0 0 0 {borderWidths.hairline} {colors.border.emphasized}",
    boxSize: dense("{sizes.4}"),
    cursor: "slider",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    outline: "none",
  };
}

/**
 * Returns the styles of a button in the look of a field: the field's surface, edge, states and
 * focus ring, a control's cursor, and its content centred.
 */
export function fieldButton(): SystemStyleObject {
  return {
    ...field(),
    alignItems: "center",
    borderRadius: "l2",
    cursor: "button",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    userSelect: "none",
  };
}
