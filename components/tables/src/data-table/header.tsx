/**
 * Renders a data table's header rows.
 *
 * @remarks
 *   A header over several columns spans them and takes `scope="colgroup"`. A sortable column's name
 *   is the collections table's sort button with the caller's indicator after it, and its header
 *   states `aria-sort` while the column is sorted, the pattern of the WAI-ARIA sortable table. A
 *   column's `meta.numeric` aligns its header to the end and puts the indicator before the name. A
 *   pinned column's header sticks with its cells, and a resizable column's header ends in its
 *   resize separator. A column's header renders the caller's column actions beside its name, after
 *   it, or before it in a numeric column. A header with a separator or column actions is named
 *   through `aria-labelledby` by the element that contains its name. Named from its content, the
 *   header would include the separator's value and the actions' names: Chromium names it "Amount
 *   150 pixels". In a windowed table each header row states its `aria-rowindex`, from 1.
 */

import { type ReactElement, type ReactNode } from "react";

import { Table } from "@stealthscale/component-collections";

import { ColumnHeader } from "#data-table/bound.ts";
import {
  type ColumnActions,
  fitOf,
  labelOf,
  nameIdOf,
  pinnedOf,
  sortOf,
} from "#data-table/columns.ts";
import { withContext } from "#data-table/context.ts";
import { type HeaderSlot, rowsOf } from "#data-table/headers.ts";
import { Resizer } from "#data-table/resizer.tsx";
import { useIdPrefix, useTableState } from "#data-table/state.ts";
import { headerContentOf } from "#data-table/templates.tsx";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Renders the `span` around the caller's sort glyph, with the recipe's sort indicator class.
 */
const Indicator = withContext("span", "sortIndicator");

/**
 * Renders the `div` that lays a header's name and its column actions out in a row.
 */
const Heading = withContext("div", "heading");

/**
 * Renders the `div` around a header's column actions.
 */
const Actions = withContext("div", "actions");

/**
 * Describes the props of the header rows: the column actions, whether the rows state their index,
 * the sort glyph and the words of the resize separators.
 */
export interface HeaderProps {
  /**
   * Returns the controls a column's header renders beside its name from the column.
   */
  readonly columnActions?: ColumnActions | undefined;

  /**
   * Whether each header row states its `aria-rowindex`, as the rows of a windowed table do.
   */
  readonly indexed?: boolean | undefined;

  /**
   * Returns the accessible name of a column's resize separator from the column's name. "Resize
   * Amount" unless stated.
   */
  readonly resizeLabel?: ((column: string) => string) | undefined;

  /**
   * Returns a column's size in words from its size in pixels. "150 pixels" unless stated.
   */
  readonly resizeValue?: ((size: number) => string) | undefined;

  /**
   * Glyph beside a sortable column's name, pointing up. The recipe turns it for a descending sort.
   */
  readonly sortIndicator?: ReactNode | undefined;
}

/**
 * Returns the English name of a resize separator.
 */
function resizeInEnglish(column: string): string {
  return `Resize ${column}`;
}

/**
 * Returns a size in English words.
 */
function pixelsInEnglish(size: number): string {
  return `${String(size)} pixels`;
}

/**
 * Returns a header's content: its name, inside the sort button when the column sorts, and inside a
 * `span` with the label's id when the column does not sort and the header is named by it.
 *
 * @remarks
 *   The indicator follows the name, and precedes it in a numeric column, so the name ends where
 *   the column's figures end.
 */
function named(
  table: DataTableApi,
  slot: HeaderSlot,
  indicator: ReactNode,
  labelId: string | undefined,
): ReactNode {
  const { column } = slot.header;
  const name = headerContentOf(table, slot.header);

  if (!column.getCanSort()) return labelId === undefined ? name : <span id={labelId}>{name}</span>;

  const numeric = column.columnDef.meta?.numeric === true;
  const mark =
    indicator === undefined ? null : (
      <Indicator aria-hidden data-direction={sortOf(table, column.id) ?? "none"}>
        {indicator}
      </Indicator>
    );

  return (
    <Table.Sorter
      {...(labelId === undefined ? {} : { id: labelId })}
      onClick={column.getToggleSortingHandler()}
    >
      {numeric ? mark : null}
      {name}
      {numeric ? null : mark}
    </Table.Sorter>
  );
}

/**
 * Returns a leaf column's resize separator, or `null` for a column that does not resize.
 */
function resized(slot: HeaderSlot, props: HeaderProps): null | ReactElement {
  const { header } = slot;

  if (header.subHeaders.length > 0 || !header.column.getCanResize()) return null;

  const label = props.resizeLabel ?? resizeInEnglish;
  const value = props.resizeValue ?? pixelsInEnglish;

  return (
    <Resizer
      header={header}
      label={label(labelOf(header.column))}
      resizing={header.column.getIsResizing()}
      size={header.getSize()}
      valueText={value(header.getSize())}
    />
  );
}

/**
 * Returns a leaf column's actions from the caller's function, or undefined for a header over
 * several columns and a table without column actions.
 */
function actionsOf(slot: HeaderSlot, props: HeaderProps): ReactNode {
  const { header } = slot;

  return header.subHeaders.length > 0 ? undefined : props.columnActions?.(header.column);
}

/**
 * Returns a header's content: its name alone, or its name and the column's actions in a row, the
 * actions first in a numeric column.
 */
function arranged(slot: HeaderSlot, name: ReactNode, actions: ReactNode): ReactNode {
  if (actions === undefined || actions === null) return name;

  const numeric = slot.header.column.columnDef.meta?.numeric === true;
  const controls = <Actions>{actions}</Actions>;

  return (
    <Heading>
      {numeric ? controls : null}
      {name}
      {numeric ? null : controls}
    </Heading>
  );
}

/**
 * Returns the id of the element that names a header with a separator or column actions, or
 * undefined for a header named by its content.
 */
function labelIdOf(
  prefix: string,
  slot: HeaderSlot,
  separator: null | ReactElement,
  actions: ReactNode,
): string | undefined {
  const acting = actions !== undefined && actions !== null;

  return separator === null && !acting ? undefined : nameIdOf(prefix, slot.header.id);
}

/**
 * Returns one header cell with its spans, its scope, its sort state, its alignment, its pin and,
 * while it ends in a separator or renders column actions, its label.
 */
function headed(
  table: DataTableApi,
  slot: HeaderSlot,
  props: HeaderProps,
  prefix: string,
): ReactElement {
  const { header, rowSpan } = slot;
  const sorted = sortOf(table, header.column.id);
  const separator = resized(slot, props);
  const actions = actionsOf(slot, props);
  const labelId = labelIdOf(prefix, slot, separator, actions);

  return (
    <ColumnHeader
      key={header.id}
      {...pinnedOf(table, header.column)}
      {...fitOf(header.column)}
      {...(header.colSpan > 1 ? { colSpan: header.colSpan, scope: "colgroup" } : {})}
      {...(rowSpan > 1 ? { rowSpan } : {})}
      {...(sorted === undefined ? {} : { "aria-sort": sorted })}
      {...(header.column.columnDef.meta?.numeric === true ? { "data-numeric": true } : {})}
      {...(labelId === undefined ? {} : { "aria-labelledby": labelId })}
      {...(separator === null ? {} : { "data-resizable": "" })}
    >
      {arranged(slot, named(table, slot, props.sortIndicator, labelId), actions)}
      {separator}
    </ColumnHeader>
  );
}

/**
 * Renders the `thead` with a row per header group.
 *
 * @param props - The column actions, whether the rows state their index, the sort glyph and the
 *   words of the resize separators.
 * @returns The `thead` element.
 */
export function Header(props: HeaderProps): ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();

  return (
    <Table.Header>
      {rowsOf(table.getHeaderGroups()).map((row, at) => (
        <Table.Row key={row.id} {...(props.indexed === true ? { "aria-rowindex": at + 1 } : {})}>
          {row.slots.map((slot) => headed(table, slot, props, prefix))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}
