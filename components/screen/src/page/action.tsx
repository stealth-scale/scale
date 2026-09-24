/**
 * Renders one control in the header, with the priority that decides how it folds.
 *
 * @remarks
 *   A folded page folds its actions by priority: a primary action keeps its text, a secondary
 *   action shows its icon alone, and a tertiary action leaves the row. The priority is a prop of
 *   the action, because a slot recipe resolves its variants once, at the root. A narrow page
 *   offers a tertiary action through `Page.Folded`, which renders only there.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#page/context.ts";

/**
 * Renders the `button` with the recipe's action class.
 */
const Acted = withContext("button", "action", { defaultProps: { type: "button" } });

/**
 * Describes the props of an action: its priority and the props of a `button`.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * Priority of the control, which decides how a folded page folds it.
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
