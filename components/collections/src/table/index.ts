/**
 * Publishes the table's parts, which a caller composes as `Table.Scroller` holding `Table.Root`
 * and the bands a table is built from.
 *
 * @remarks
 *   `Table.Simple` draws a whole table from one list of columns and is what most callers want. It
 *   is built from the parts published beside it, which a table that wants something else composes
 *   itself.
 */

export { type Branch, type Column as ColumnOf, type Leaf, type Named } from "#table/columns.ts";
export * from "#table/parts.ts";
export { Simple, type SimpleProps } from "#table/simple.tsx";
