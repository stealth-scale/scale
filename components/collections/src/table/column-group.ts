/**
 * Renders the group of column declarations.
 *
 * @remarks
 *   The element is a `colgroup`, the table's first child. A table with `layout="fixed"` takes its
 *   column widths from the declarations inside it, and shares the width evenly without them.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `colgroup` with the table's column group class.
 */
export const ColumnGroup = withContext("colgroup", "columnGroup");

/**
 * Describes the props of the column group: the props of a `colgroup`.
 */
export type ColumnGroupProps = ComponentProps<typeof ColumnGroup>;
