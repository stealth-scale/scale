/**
 * Renders one entry of the timeline: a row of the words before the rail, the connector and the
 * words after it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the item `li`, a subgrid row across the root's three columns.
 */
export const Item = withContext("li", "item");

/**
 * Describes the props of `Item`.
 */
export type ItemProps = ComponentProps<typeof Item>;
