/**
 * Types the priority that decides how an action folds as its row narrows.
 *
 * @remarks
 *   The row measures itself and sets `data-narrow`, and the action's recipe reads that attribute
 *   with the action's priority.
 */

/**
 * Priority of an action, which decides what a narrow row does with it.
 */
export type Priority = "primary" | "secondary" | "tertiary";

/**
 * Lists the priorities from the one a narrow row keeps to the one it folds away first.
 */
export const PRIORITIES: readonly Priority[] = ["primary", "secondary", "tertiary"];
