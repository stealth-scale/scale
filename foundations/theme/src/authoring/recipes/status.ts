/**
 * Writes the axes that point a recipe's palette at a semantic palette: `status` and `palette` for
 * any component, and a `status` axis for a form field that also sets the field's edge.
 *
 * @remarks
 *   Each axis sets `colorPalette` and the recipe reads the palette's roles, so no value in a recipe
 *   is a color and a theme decides every hue. Each helper offers every value when a recipe names
 *   none, and the compiler emits no rule for a value a recipe leaves out.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import { FIELD_EDGE } from "#authoring/recipes/field.ts";
import { type Palette, PALETTES, type Status, STATUSES } from "#contract.ts";
import { type RecipeRule } from "#pandacss.ts";

/**
 * Writes the `status` axis: each status sets `colorPalette` to the semantic palette of its name.
 */
export const statusVariants: Axis<Status> = axis(STATUSES, (status) => ({ colorPalette: status }));

/**
 * Writes the `palette` axis: each value sets `colorPalette` to the semantic palette of its name.
 *
 * @remarks
 *   The axis offers the three brand palettes and `neutral` beside the four statuses, for a
 *   component whose color is a choice rather than a report. A component that reports a state
 *   offers `statusVariants` instead.
 */
export const paletteVariants: Axis<Palette> = axis(PALETTES, (palette) => ({
  colorPalette: palette,
}));

/**
 * Writes the `status` axis of a form field: each status sets `colorPalette` and writes the field's
 * edge property from the border family member of the same name.
 *
 * @remarks
 *   The border family holds one border per status at the step the contrast gate measures against a
 *   panel. The palette's own `border` role is two steps darker, so an edge read from the palette
 *   would be heavier than the field's invalid edge. The value is written to the edge property, so
 *   the field's look paints with it, and again under `_invalid`, because a field that reports a
 *   warning is usually also marked invalid and would otherwise take the error edge.
 */
export const fieldStatusVariants: Axis<Status> = axis(STATUSES, (status) => ({
  _invalid: { [FIELD_EDGE]: `{colors.border.${status}}` },
  colorPalette: status,
  [FIELD_EDGE]: `{colors.border.${status}}`,
}));

/**
 * Returns the `staticCss` entry for a recipe with a `status` axis.
 *
 * @remarks
 *   The compiler emits rules only for values it reads as literals in application source. An
 *   application usually passes a status from data, so without this entry the class has no rule and
 *   the component renders in its default palette. The values are listed because the compiler
 *   ignores `true` for an axis, although its types accept it.
 * @param statuses - The statuses the recipe offers. Defaults to all four.
 */
export function statusEmitted(statuses: readonly Status[] = STATUSES): RecipeRule {
  return { status: [...statuses] };
}
