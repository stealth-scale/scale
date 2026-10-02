/**
 * Renders the message the list shows when no action matches the query.
 *
 * @remarks
 *   The list renders it only while no action matches, so a screen reader never reads it above
 *   rows. Name what was searched in the message, such as "No command matches", because "No
 *   results" does not say what the palette searched.
 */

import { type ComponentProps } from "react";

import { withContext } from "#command/context.ts";

/**
 * Renders the `p` with the recipe's empty class, centred in the list.
 */
export const Empty = withContext("p", "empty");

/**
 * Describes the props of the empty message: the props of a `p`.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
