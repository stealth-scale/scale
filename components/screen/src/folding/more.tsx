/**
 * Renders the menu of the actions a narrow row folds away.
 *
 * @remarks
 *   The row renders the menu while at least one action is folded, at the end of its actions. The
 *   rows are in the order the actions folded. The panel is portalled to the document, so an
 *   ancestor that clips its content does not cut the panel. A folded link keeps its target in its
 *   row, so a reader can open it in a new tab.
 */

import { type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import { type Entry, type FoldedAction } from "#folding/fold.ts";

/**
 * Placement of the panel: under the trigger, aligned to the trigger's end.
 */
const PLACED = { placement: "bottom-end" } as const;

/**
 * Returns the props that render a folded link's menu row as a link: an `a` with the target and
 * `aria-current` on the current page, or no props for an action that is not a link.
 *
 * @remarks
 *   A disabled link's row has no target, so a press on it goes nowhere.
 */
function linked(action: FoldedAction): Readonly<Record<string, string | undefined>> {
  if (action.href === undefined) return {};

  return {
    "aria-current": action.current === true ? "page" : undefined,
    as: "a",
    href: action.disabled === true ? undefined : action.href,
  };
}

/**
 * Describes the props of the menu.
 */
export interface MoreProps {
  /**
   * Folded actions, one menu row each.
   */
  readonly entries: readonly Entry[];

  /**
   * Trigger the row renders, which opens the menu.
   */
  readonly trigger: ReactElement;
}

/**
 * Renders the trigger and one menu row per folded action.
 *
 * @param props - The folded actions and the trigger.
 * @returns The menu's root.
 */
export function More({ entries, trigger }: MoreProps): ReactElement {
  return (
    <Menu.Root positioning={PLACED}>
      {trigger}
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {entries.map(({ action, id }) => (
              <Menu.Item
                disabled={action.disabled}
                key={id}
                onClick={action.onClick}
                value={id}
                {...linked(action)}
              >
                {action.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
