/**
 * Types the priority that decides how an action folds as its row narrows, and derives it from the
 * props a caller sets.
 *
 * @remarks
 *   A narrow row keeps a primary action whole, renders a secondary action as its icon alone, and
 *   moves a tertiary action into the row's menu.
 */

/**
 * Priority of an action, which decides what a narrow row does with it.
 */
export type Priority = "primary" | "secondary" | "tertiary";

/**
 * Lists the priorities from the one a narrow row keeps to the one it folds away first.
 */
export const PRIORITIES: readonly Priority[] = ["primary", "secondary", "tertiary"];

/**
 * Returns an action's priority: the stated one, or the one its icon and `primary` imply.
 *
 * @remarks
 *   An action with an icon folds to the icon, a primary action without one keeps its words, and any
 *   other action folds into the menu. A control that opens an overlay of its own cannot run from a
 *   menu row, so it states `primary` or has an icon.
 * @param stated - The priority the caller set, if any.
 * @param icon - Whether the action has an icon.
 * @param primary - Whether the action is the row's primary action.
 * @returns The priority the row folds the action by.
 */
export function priorityOf(
  stated: Priority | undefined,
  icon: boolean,
  primary: boolean,
): Priority {
  if (stated !== undefined) return stated;
  if (icon) return "secondary";

  return primary ? "primary" : "tertiary";
}
