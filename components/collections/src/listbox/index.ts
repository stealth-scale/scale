/**
 * Exports the listbox's parts, `Listbox.Row` and `Listbox.Simple`.
 *
 * @remarks
 *   `Listbox.Simple` renders a whole list from props. `Listbox.Row` renders one row with its
 *   checkbox or mark, its text and its description. A list with another structure composes the
 *   parts.
 */

export * from "#listbox/parts.ts";
export { Row, type RowProps } from "#listbox/row.tsx";
export { type Narrowing, Simple, type SimpleProps } from "#listbox/simple.tsx";
