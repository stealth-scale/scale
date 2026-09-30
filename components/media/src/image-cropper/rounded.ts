/**
 * Rounds the crop the machine reports to whole pixels, as the words a screen reader hears use it.
 */

/**
 * Describes a crop in the viewport's pixels.
 */
export interface Crop {
  /**
   * Height of the crop.
   */
  readonly height: number;

  /**
   * Width of the crop.
   */
  readonly width: number;

  /**
   * Distance of the crop from the viewport's left edge.
   */
  readonly x: number;

  /**
   * Distance of the crop from the viewport's top edge.
   */
  readonly y: number;
}

/**
 * Returns the crop with each value rounded to a whole pixel.
 *
 * @param crop - The crop the machine reports.
 * @returns The rounded crop.
 */
export function rounded(crop: Crop): Crop {
  return {
    height: Math.round(crop.height),
    width: Math.round(crop.width),
    x: Math.round(crop.x),
    y: Math.round(crop.y),
  };
}
