/**
 * Renders one pair of the data list: a `div` that contains a label and its value.
 *
 * @remarks
 *   HTML allows a `div` around each term and its details inside `dl`, so the pair is one element a
 *   divided list rules and a list across the page lays on one grid row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#data-list/context.ts";

/**
 * Renders the item `div`.
 */
export const Item = withContext("div", "item");

/**
 * Describes the props of `Item`.
 */
export type ItemProps = ComponentProps<typeof Item>;
