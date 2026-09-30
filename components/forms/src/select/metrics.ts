/**
 * Returns the geometry of the select's trigger: the room its end keeps for the indicator and the
 * clear trigger, and the selectors that widen it.
 */

import { dense } from "@stealthscale/theme/authoring";

import { glyph, indicatorEnd, inset, type Size } from "#dropdown.ts";
import { triggerSide } from "#input-group/trigger.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "select";

/**
 * Selects the trigger of a control whose clear trigger shows.
 *
 * @remarks
 *   The clear trigger is the trigger's sibling, so the selector reads the control around both.
 */
export const CLEARED = `.${CLASS}__control:has(> .${CLASS}__clearTrigger:not([hidden])) > &`;

/**
 * Selects the value text of a trigger with nothing selected.
 */
export const PLACEHOLDER = "[data-placeholder-shown] > &";

/**
 * Returns the clear trigger's distance from the control's end: the indicator's place, its glyph
 * and the smallest gap.
 */
export function clearEnd(size: Size): string {
  return `calc(${indicatorEnd(size)} + ${glyph(size)} + ${dense("{spacing.gap.xs}")})`;
}

/**
 * Returns the room the trigger keeps at its end for the indicator: the inset, the glyph and the
 * smallest gap.
 */
export function indicated(size: Size): string {
  return `calc(${inset(size)} + ${glyph(size)} + ${dense("{spacing.gap.xs}")})`;
}

/**
 * Returns the trigger's end padding while the clear trigger shows: the indicator's room, the clear
 * trigger's square and the smallest gap.
 */
export function cleared(size: Size): string {
  return `calc(${indicated(size)} + ${triggerSide(size)} + ${dense("{spacing.gap.xs}")})`;
}
