/**
 * Renders the rows of a list: a `ul` named by its list's name.
 *
 * @remarks
 *   Inside a board's list the rows take the list's name, so a screen reader names the list it
 *   enters. The one list of an array takes the caller's `aria-label`. The recipe keeps the list at
 *   least one control tall, so a list without rows is still a place to drop on.
 */

import { type ComponentProps, type ReactElement, use } from "react";

import { withContext } from "#sortable/context.ts";
import { ListContext } from "#sortable/state.ts";

/**
 * Renders the `ul` with the recipe's items class.
 */
const Box = withContext("ul", "items");

/**
 * Describes the props of the rows: the props of a `ul`.
 */
export type ItemsProps = ComponentProps<typeof Box>;

/**
 * Renders the `ul` of a list's rows, named by the list's name inside a list.
 *
 * @param props - The props of a `ul`, whose `aria-label` names the one list of an array.
 */
export function Items(props: ItemsProps): ReactElement {
  const list = use(ListContext);

  return <Box aria-label={list?.label} {...props} />;
}
