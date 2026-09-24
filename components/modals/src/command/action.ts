/**
 * Defines the action a palette lists, and the helpers that read and group actions.
 */

import { type ReactNode } from "react";

/**
 * Describes one command a palette lists and runs.
 */
export interface CommandAction {
  /**
   * Whether the action appears in the list but cannot be chosen.
   */
  disabled?: boolean | undefined;

  /**
   * The heading the action is listed under. Without one, it is listed ungrouped in the position it
   * was given.
   */
  group?: string | undefined;

  /**
   * A glyph rendered before the label, for readers scanning the list.
   */
  icon?: ReactNode;

  /**
   * Extra terms the action matches on, so typing `add` finds `New document`.
   */
  keywords?: string | undefined;

  /**
   * The text shown in the row and announced by assistive technology.
   */
  label: string;

  /**
   * The keystroke that runs the action without the palette, rendered at the end of the row.
   */
  shortcut?: string | undefined;

  /**
   * The value `onRun` receives when the action runs.
   */
  value: string;
}

/**
 * Returns the label of an action.
 *
 * @remarks
 *   A module-level function keeps one identity across renders, so the collection does not rebuild
 *   on a keystroke that changes no match.
 */
export function labelOf(action: CommandAction): string {
  return action.label;
}

/**
 * Returns the value of an action, which is what a selection reports.
 */
export function valueOf(action: CommandAction): string {
  return action.value;
}

/**
 * Groups actions by heading, in the order each heading first appears.
 *
 * @remarks
 *   An action with no group falls under the empty string, which the list renders without a heading.
 *   A heading's position is the position of its first action, so the caller orders the groups by
 *   ordering the actions.
 * @param actions - The actions, in the order the caller gave them.
 * @returns One entry per heading, each with the actions under it.
 */
export function gathered(
  actions: readonly CommandAction[],
): ReadonlyArray<[heading: string, actions: readonly CommandAction[]]> {
  const under = new Map<string, CommandAction[]>();

  for (const action of actions) {
    const heading = action.group ?? "";
    const already = under.get(heading);

    if (already === undefined) {
      under.set(heading, [action]);
    } else {
      already.push(action);
    }
  }

  return [...under];
}
