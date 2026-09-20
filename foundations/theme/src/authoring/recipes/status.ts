/**
 * Writes the `status` axis of a recipe, which sets the palette, and of a form field, which draws
 * its edge beside it.
 *
 * @remarks
 *   An alert with four statuses and six looks is one recipe: the status sets the palette, the
 *   look reads the palette's roles, and no value in the recipe is a color. A theme decides what
 *   hue an error is. Each helper offers every status where a recipe names none, so a component
 *   that reports two of them states two and the compiler emits no rule for the others.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import { type Status, STATUSES } from "#contract.ts";
import { type RecipeRule } from "#pandacss.ts";

/**
 * Writes the `status` axis, each status pointing the palette at the semantic palette of its
 * name.
 */
export const statusVariants: Axis<Status> = axis(STATUSES, (status) => ({ colorPalette: status }));

/**
 * Writes the `status` axis of a form field, each status pointing the palette at the semantic
 * palette of its name and drawing the edge in the line family's member of the same name.
 *
 * @remarks
 *   A field states its edge outright rather than leaving it to the palette. The line family holds
 *   one border per status at the step the contrast gate measured against a panel, and the palette's
 *   own border role sits two steps darker, so a field that read the palette for its edge would be
 *   drawn heavier than the invalid state the same field already has.
 */
export const fieldStatusVariants: Axis<Status> = axis(STATUSES, (status) => ({
  borderColor: `border.${status}`,
  colorPalette: status,
}));

/**
 * Writes the `staticCss` entry a recipe with a `status` axis carries.
 *
 * @remarks
 *   The compiler emits a rule for a value it reads from a literal in an application's source. A
 *   status is the one axis an application usually does not write: it hands over what a record, a
 *   validator or a server said, and the compiler sees a name it cannot follow. Without this the
 *   class lands on the element with no rule behind it, and a component reporting an error draws in
 *   its default palette. The values are listed rather than asked for with `true`, which the
 *   compiler's own types offer for an axis and its compiler ignores.
 * @param statuses - The statuses the recipe offers, which is every one unless it names fewer.
 */
export function statusEmitted(statuses: readonly Status[] = STATUSES): RecipeRule {
  return { status: [...statuses] };
}
