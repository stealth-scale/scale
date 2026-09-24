/**
 * Renders the row of controls at the end of the title's row.
 *
 * @remarks
 *   The element is `div`. The row keeps the end of the title's row at every width and does not
 *   wrap, so a long title wraps beside it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `div` with the recipe's actions class.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes the props of the actions row: the props of a `div`.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
