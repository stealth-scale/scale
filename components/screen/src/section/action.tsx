/**
 * Renders one control in the header, with the priority that decides how it folds.
 *
 * @remarks
 *   A narrow section folds its actions by priority: a secondary action shows its icon alone, and a
 *   tertiary one leaves the document. The priority is a prop of the action, because a slot recipe
 *   resolves its variants once, at the root, and each action folds on its own priority.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#section/context.ts";

/**
 * Renders the `button` with the recipe's action class.
 */
const Acted = withContext("button", "action", { defaultProps: { type: "button" } });

/**
 * Describes the props of an action: its priority and the props of a `button`.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * Priority of the control, which decides how a narrow section folds it.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the control with its priority as `data-priority`.
 *
 * @param props - The priority and the props of a `button`.
 * @returns The `button` element.
 */
export function Action({ priority = "primary", ...rest }: ActionProps): ReactElement {
  return <Acted {...rest} {...{ [PRIORITY]: priority }} />;
}
