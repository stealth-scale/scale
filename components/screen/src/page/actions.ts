/**
 * Renders the row of controls at the end of the title's row.
 *
 * @remarks
 *   The row keeps the end of the title's row at every width and does not wrap. Each control sets
 *   its own priority, and the page's folding rules decide which controls a folded page keeps.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's actions class.
 */
export const Actions = withContext("div", "actions");

/**
 * Describes the props of the actions row: the props of a `div`.
 */
export type ActionsProps = ComponentProps<typeof Actions>;
