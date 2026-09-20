/**
 * Writes the axes that give a box its shape, so a theme that restates the ratios or the corners
 * moves every box drawn in them.
 *
 * @remarks
 *   Each helper offers every shape the theme states where a recipe names none, so a component
 *   adds nothing of its own to the vocabulary and a theme that states a ratio reaches every
 *   component through it.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import { ASPECT_RATIOS, type Corner, CORNERS, type Ratio } from "#draw/shape.ts";

/**
 * Writes the `ratio` axis of a box, each value one of the theme's aspect ratios.
 */
export const ratioVariants: Axis<Ratio> = axis(ASPECT_RATIOS, (ratio) => ({ aspectRatio: ratio }));

/**
 * Writes the `radius` axis of a box, each value one of the theme's corners.
 */
export const cornerVariants: Axis<Corner> = axis(CORNERS, (corner) => ({ borderRadius: corner }));
