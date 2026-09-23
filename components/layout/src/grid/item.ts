/**
 * Renders one item of a grid.
 *
 * @remarks
 *   The item takes its own `span`, because two items of one grid, such as an article and an aside,
 *   span different numbers of columns. The item is bound with `withProvider`, which is how a part
 *   of a slot recipe takes an axis of its own.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#grid/context.ts";

/**
 * Renders a `div` element with the item slot's classes and the span's class.
 */
export const Item = withProvider("div", "item");

/**
 * Describes the props of Grid.Item: `span` and the props of a `div` element.
 */
export type ItemProps = ComponentProps<typeof Item>;
