/**
 * Defines the action a palette lists, and the helpers that read and group actions.
 */

import { type ReactNode } from "react";

/**
 * One command a palette can list and run.
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
   * Extra terms the action should match on, so typing `add` finds `New document`.
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
   * The value handed back when the action is chosen.
   */
  value: string;
}

/**
 * Returns the label of an action.
 *
 * @remarks
 *   Declared here rather than written as an arrow at the call site, so the collection keeps a
 *   stable identity across renders instead of rebuilding every row on a keystroke that matched
 *   nothing.
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
 * Buckets actions by their group, preserving the order they arrived in.
 *
 * @remarks
 *   An action with no group falls under the empty string, which the list renders without a heading.
 *   Headings come out in the order their first action appeared, so the caller controls what a
 *   reader sees first simply by ordering the input.
 * @returns One entry per heading, each holding the actions under it.
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
