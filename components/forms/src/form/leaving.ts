/**
 * Tells a move of focus out of a control made of several elements from a move inside it.
 */

import { type FocusEvent } from "react";

/**
 * Reports whether focus moves outside the element that handles the event.
 *
 * @remarks
 *   A radio group, a date's segments and a group of checkboxes each take focus on several elements.
 *   A field counts as left once focus leaves the whole control, so its blur validators do not run
 *   while a person moves between its parts.
 * @param event - The blur event the element handles.
 * @returns Whether the element focus moves to is outside the handling element, or there is none.
 */
export function isLeaving(event: FocusEvent): boolean {
  const next = event.relatedTarget;

  return !(next instanceof Node && event.currentTarget.contains(next));
}
