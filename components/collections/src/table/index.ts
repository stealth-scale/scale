/**
 * Exports the table's parts, `Table.Simple` and the column types.
 *
 * @remarks
 *   `Table.Simple` renders a whole table from a list of columns and a list of rows. A table with
 *   another structure composes the parts inside `Table.Scroller`.
 */

export { type Branch, type Column as ColumnOf, type Leaf, type Named } from "#table/columns.ts";
export * from "#table/parts.ts";
export { Simple, type SimpleProps } from "#table/simple.tsx";
