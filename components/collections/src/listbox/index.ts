/**
 * Publishes the listbox's parts, which a caller composes as `Listbox.Root` holding a list of rows a
 * person picks from.
 *
 * @remarks
 *   `Listbox.Simple` draws a whole list from props and is what most callers want. `Listbox.Row`
 *   draws the row almost every list wants. Both are built from the parts published beside them,
 *   which a list that wants something else composes itself.
 */

export * from "#listbox/parts.ts";
export { Row, type RowProps } from "#listbox/row.tsx";
export { type Narrowing, Simple, type SimpleProps } from "#listbox/simple.tsx";
