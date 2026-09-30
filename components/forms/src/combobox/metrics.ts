/**
 * Returns the geometry of the combobox's input: the places of the trigger and the clear trigger at
 * its end, the room the input keeps for them, and the selector that widens that room.
 *
 * @remarks
 *   Both triggers are the input group's squares. The trigger's square is centred on the glyph a
 *   select's indicator renders, so the trigger's glyph ends on the line the rows' checks end on.
 *   The clear trigger's square ends the smallest gap before the trigger's, and the input's text
 *   ends the smallest gap before the first square.
 */

import { dense } from "@stealthscale/theme/authoring";

import { glyph, indicatorEnd, type Size } from "#dropdown.ts";
import { triggerSide } from "#input-group/trigger.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "combobox";

/**
 * Selects the input of a control whose clear trigger shows.
 *
 * @remarks
 *   The clear trigger is the input's sibling, so the selector reads the control around both.
 */
export const CLEARED = `.${CLASS}__control:has(> .${CLASS}__clearTrigger:not([hidden])) > &`;

/**
 * Returns the trigger's distance from the control's end: the indicator's place less the room the
 * square leaves around the glyph on one side.
 */
export function triggerEnd(size: Size): string {
  return `calc(${indicatorEnd(size)} - (${triggerSide(size)} - ${glyph(size)}) / 2)`;
}

/**
 * Returns the clear trigger's distance from the control's end: past the trigger's square and the
 * smallest gap.
 */
export function clearEnd(size: Size): string {
  return `calc(${triggerEnd(size)} + ${triggerSide(size)} + ${dense("{spacing.gap.xs}")})`;
}

/**
 * Returns the room the input keeps at its end for the trigger: up to the place the clear trigger
 * takes, inside the input's edge.
 */
export function indicated(size: Size): string {
  return `calc(${clearEnd(size)} - {borderWidths.control})`;
}

/**
 * Returns the input's end padding while the clear trigger shows: the trigger's room, the clear
 * trigger's square and the smallest gap.
 */
export function cleared(size: Size): string {
  return `calc(${indicated(size)} + ${triggerSide(size)} + ${dense("{spacing.gap.xs}")})`;
}
