/**
 * Renders one column declaration.
 *
 * @remarks
 *   The element is a `col`. A browser reads its width, background, border and visibility, and
 *   ignores every other property, so a column's width and tint are set here and its other styles
 *   on its cells.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `col` with the table's column class.
 */
export const Column = withContext("col", "column");

/**
 * Describes the props of a column: the props of a `col`.
 */
export type ColumnProps = ComponentProps<typeof Column>;
