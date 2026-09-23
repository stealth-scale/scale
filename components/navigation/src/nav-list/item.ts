/**
 * Renders one row of the list.
 *
 * @remarks
 *   The element is `li`, positioned so an action or a count can be placed against its end. The item
 *   contains the link and the parts next to it, so the positioning belongs to the item.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the row `li` with the list's variants.
 */
export const Item = withContext("li", "item");

/**
 * Describes the props of `Item`.
 */
export type ItemProps = ComponentProps<typeof Item>;
