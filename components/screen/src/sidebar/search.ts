/**
 * Renders the container of the field that filters the destinations.
 *
 * @remarks
 *   Put the forms package's `SearchInput` inside it. The caller filters the destinations. The
 *   container has zero inline padding, so the field is as wide as the rows. A collapsed sidebar
 *   removes the search, because a rail has no room for a field.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the search `div` at the sidebar's size.
 */
export const Search = withContext("div", "search");

/**
 * Describes the props of `Search`.
 */
export type SearchProps = ComponentProps<typeof Search>;
