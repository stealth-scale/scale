/**
 * Moves a paint the machine writes inline into a custom property the recipe reads.
 *
 * @remarks
 *   The machine paints a slider's track and each thumb through an inline `background` or
 *   `background-image`, which applies over any layer or clip the recipe sets. Through the custom
 *   property the recipe paints the alpha track over a checkerboard and clips a thumb's fill to its
 *   padding box. The machine's other inline properties stay inline.
 */

import { type CSSProperties } from "react";

/**
 * Returns the machine's inline style with one paint moved into a custom property.
 *
 * @param style - The inline style the machine writes, or nothing.
 * @param property - The paint to move: `background` or `backgroundImage`.
 * @param variable - The custom property the recipe reads the paint from.
 * @returns The style without the paint, with the custom property set to it, or to `none` where
 *   the machine does not write the paint.
 */
export function painted(
  style: CSSProperties | undefined,
  property: "background" | "backgroundImage",
  variable: string,
): CSSProperties {
  const { [property]: paint, ...placed } = style ?? {};
  const moved: Record<string, string> = { [variable]: String(paint ?? "none") };

  return { ...placed, ...moved };
}
