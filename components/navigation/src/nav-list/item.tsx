/**
 * Renders one row of the list.
 *
 * @remarks
 *   The element is `li`, positioned so an action or a count can be placed against its end. The item
 *   contains the link and the parts next to it, so the positioning belongs to the item. Inside a
 *   search's scope, the item registers the words it renders and is hidden while the scope's query
 *   is not in them. A hidden row is out of the tab order and out of a screen reader's list.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useFilteredRow } from "@stealthscale/hooks";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the row `li` with the list's variants.
 */
const Row = withContext("li", "item");

/**
 * Describes the props of `Item`.
 */
export type ItemProps = ComponentProps<typeof Row>;

/**
 * Renders the row, hidden while a search's query leaves it out.
 *
 * @param props - The `li` element's props.
 * @returns The `li` element.
 */
export function Item(props: ItemProps): ReactElement {
  const { hidden, ref } = useFilteredRow<HTMLLIElement>();

  return <Row {...props} hidden={hidden || props.hidden === true} ref={ref} />;
}
