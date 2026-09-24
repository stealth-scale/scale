/**
 * Renders one control in the row, with the priority that decides how it folds.
 *
 * @remarks
 *   The action is a roving focus item, so it has the row's tab stop. The priority is a prop of the
 *   action, because a slot recipe resolves its variants once, at the root, and each action folds
 *   on its own priority.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";

/**
 * Renders the item with the recipe's action class.
 */
const Acted = withContext(Item, "action");

/**
 * Describes the props of an action: its priority and the props of an item.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * Priority of the control, which decides how a narrow row folds it.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the control with its priority as `data-priority`.
 *
 * @param props - The priority and the props of an item.
 * @returns The control element.
 */
export function Action({ priority = "primary", ...rest }: ActionProps): ReactElement {
  return <Acted {...rest} {...{ [PRIORITY]: priority }} />;
}
