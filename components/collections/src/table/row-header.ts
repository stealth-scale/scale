/**
 * Renders the header of a row.
 *
 * @remarks
 *   The element is a `th` with `scope="row"`, so a screen reader reads it with each cell across
 *   the row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `th` with the table's row header class and `scope="row"`.
 */
export const RowHeader = withContext("th", "rowHeader", { defaultProps: { scope: "row" } });

/**
 * Describes the props of a row header: the props of a `th`.
 */
export type RowHeaderProps = ComponentProps<typeof RowHeader>;
