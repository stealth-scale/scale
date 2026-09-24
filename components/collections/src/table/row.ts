/**
 * Renders one row.
 *
 * @remarks
 *   The element is a `tr`. A row with `aria-selected="true"` fills with the palette's subtle fill.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `tr` with the table's row class.
 */
export const Row = withContext("tr", "row");

/**
 * Describes the props of a row: the props of a `tr`.
 */
export type RowProps = ComponentProps<typeof Row>;
