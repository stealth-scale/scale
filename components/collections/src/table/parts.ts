/**
 * Exports the parts a table is composed from.
 *
 * @remarks
 *   `Table.Simple` is composed from these parts and imports this module, so it is exported from
 *   `index.ts` instead.
 */

export { Body, type BodyProps } from "#table/body.ts";
export { Caption, type CaptionProps } from "#table/caption.ts";
export { Cell, type CellProps } from "#table/cell.ts";
export { ColumnGroup, type ColumnGroupProps } from "#table/column-group.ts";
export { ColumnHeader, type ColumnHeaderProps } from "#table/column-header.ts";
export { Column, type ColumnProps } from "#table/column.ts";
export { Footer, type FooterProps } from "#table/footer.ts";
export { Header, type HeaderProps } from "#table/header.ts";
export { Root, type RootProps } from "#table/root.ts";
export { RowHeader, type RowHeaderProps } from "#table/row-header.ts";
export { Row, type RowProps } from "#table/row.ts";
export { Scroller, type ScrollerProps } from "#table/scroller.tsx";
export { Sorter, type SorterProps } from "#table/sorter.ts";
