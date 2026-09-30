/**
 * Renders a list's message while the list has no item, outside the list's `ul`.
 *
 * @remarks
 *   A `ul` contains only its rows, and a message inside it would read as a row, so the message
 *   renders beside the rows. The list around it is the drop target, so the message takes a drop
 *   too.
 */

import { type ComponentProps, type ReactElement, use } from "react";

import { withContext } from "#sortable/context.ts";
import { listOf } from "#sortable/moves.ts";
import { ListContext, useRootState } from "#sortable/state.ts";

/**
 * Renders the message's `div` with the recipe's empty class.
 */
const Box = withContext("div", "empty");

/**
 * Describes the props of the message: the props of a `div`.
 */
export type EmptyProps = ComponentProps<typeof Box>;

/**
 * Renders the message while the list it is in has no item, and nothing otherwise.
 *
 * @param props - The props of a `div`, whose children are the message.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const list = use(ListContext);
  const { items } = useRootState();

  return listOf(items, list?.id).length > 0 ? null : <Box {...props} />;
}
