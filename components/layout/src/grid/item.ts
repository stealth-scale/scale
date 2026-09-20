/**
 * Draws one entry of a grid, which may reach across more than one column.
 *
 * @remarks
 *   An entry states nothing about the grid it is in beyond how far it reaches, so a grid of one
 *   column and a grid of twelve hold the same entry. The span is stated on the entry, because an
 *   article beside an aside are two entries of one grid reaching different distances, which a
 *   span read from the root could not say. The entry provides the recipe's variants rather than
 *   reading them, which is how a part of a slot recipe takes an axis of its own.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#grid/context.ts";

/**
 * Draws one cell, reaching across the columns its own span names.
 */
export const Item = withProvider("div", "item");

/**
 * Describes what an entry takes: everything a styled div element takes, and the span.
 */
export type ItemProps = ComponentProps<typeof Item>;
