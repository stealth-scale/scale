/**
 * Renders a whole table from a list of columns and a list of rows.
 *
 * @remarks
 *   The table has a caption, one or more header rows, a row per record and an optional total row.
 *   A table with another structure composes the parts. Sorting and filtering stay the caller's: a
 *   column states its sort direction and its sort button's name, and the table reports the press.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { type Column, depth, type Leaf, leaves, named, type Named } from "#table/columns.ts";
import {
  Body,
  Caption,
  Cell,
  ColumnGroup,
  ColumnHeader,
  Column as Declared,
  Footer,
  Header,
  Root,
  Row,
  RowHeader,
  Scroller,
  type ScrollerProps,
  Sorter,
} from "#table/parts.ts";

/**
 * Describes the props of a whole table: the scroller's props, the columns and the rows.
 *
 * @remarks
 *   The scroller's `columns`, the CSS multi-column property, is left out, so `columns` names the
 *   table's columns.
 * @typeParam Row - Type of one record.
 */
export interface SimpleProps<Row> extends Omit<ScrollerProps, "columns"> {
  /**
   * Caption rendered under the table, and the accessible name of the table and the scroller.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Columns in render order. A branch spans the columns under it.
   */
  readonly columns: ReadonlyArray<Column<Row>>;

  /**
   * Content of a full-width row rendered while `rows` is empty.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Returns the key of the section a record belongs to.
   */
  readonly groupBy?: ((row: Row) => string) | undefined;

  /**
   * Returns a section's heading from its key. Defaults to the key.
   */
  readonly groupLabel?: ((under: string) => ReactNode) | undefined;

  /**
   * Called with the column key on a press of a sort button.
   */
  readonly onSort?: ((key: string) => void) | undefined;

  /**
   * Records in render order.
   */
  readonly rows: readonly Row[];

  /**
   * Returns the React key of a record.
   */
  readonly rowToKey: (row: Row) => string;

  /**
   * Returns the total row's content for a leaf column. Branches are never passed.
   */
  readonly total?: ((column: Leaf<Row>) => ReactNode) | undefined;
}

/**
 * Returns a column's value for a record, from `cell` or from the property named `key`.
 */
function valueOf<Row>(column: Leaf<Row>, row: Row): ReactNode {
  if (column.cell !== undefined) return column.cell(row);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a column without `cell` reads the record's property named by its key
  return (row as Record<string, ReactNode>)[column.key] ?? null;
}

/**
 * Returns a header's attributes: `data-numeric`, `aria-sort`, the spans and the `colgroup` scope.
 */
function heading<Row>(name: Named<Row>): Record<string, unknown> {
  const { colSpan, column, rowSpan } = name;

  return {
    ...(column?.numeric === true ? { "data-numeric": true } : {}),
    ...(column?.sorted === undefined ? {} : { "aria-sort": column.sorted }),
    ...(colSpan > 1 ? { colSpan, scope: "colgroup" } : {}),
    ...(rowSpan > 1 ? { rowSpan } : {}),
  };
}

/**
 * Returns one column header, with a sort button when the column sorts and `onSort` is set.
 */
function heads<Row>(name: Named<Row>, onSort: SimpleProps<Row>["onSort"]): ReactElement {
  const { column, key, label } = name;
  const sorts = column?.sortLabel !== undefined && onSort !== undefined;

  return (
    <ColumnHeader key={key} {...heading(name)} data-column={key}>
      {sorts ? (
        <Sorter
          aria-label={column.sortLabel}
          onClick={() => {
            onSort(column.key);
          }}
        >
          {label}
        </Sorter>
      ) : (
        label
      )}
    </ColumnHeader>
  );
}

/**
 * Returns one record's row, with its row-header column as a `th`.
 *
 * @remarks
 *   Every cell carries `data-row` and `data-column`, the attributes `useMatrixCrosshair` reads.
 */
function draws<Row>(columns: ReadonlyArray<Column<Row>>, row: Row, key: string): ReactElement {
  return (
    <Row data-row={key} key={key}>
      {leaves(columns).map((column) =>
        column.rowHeader === true ? (
          <RowHeader data-column={column.key} data-row={key} key={column.key}>
            {valueOf(column, row)}
          </RowHeader>
        ) : (
          <Cell
            data-column={column.key}
            data-row={key}
            key={column.key}
            {...(column.numeric === true ? { "data-numeric": true } : {})}
          >
            {valueOf(column, row)}
          </Cell>
        ),
      )}
    </Row>
  );
}

/**
 * Returns the records grouped by key, in the order each key first appears.
 */
function gathered<Row>(rows: readonly Row[], under: (row: Row) => string): Map<string, Row[]> {
  const groups = new Map<string, Row[]>();

  for (const row of rows) {
    const key = under(row);

    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return groups;
}

/**
 * Returns the body: one `tbody`, or one `tbody` per section when the table states `groupBy`.
 *
 * @remarks
 *   A section's heading is a full-width row header with `scope="rowgroup"`, so a screen reader
 *   names the section's rows by it.
 */
function bodied<Row>(props: SimpleProps<Row>, wide: number): ReactNode {
  const { columns, groupBy, groupLabel, rows, rowToKey } = props;

  if (groupBy === undefined) {
    return <Body>{rows.map((row) => draws(columns, row, rowToKey(row)))}</Body>;
  }

  return [...gathered(rows, groupBy)].map(([under, held]) => (
    <Body key={under}>
      <Row>
        <RowHeader colSpan={wide} scope="rowgroup">
          {groupLabel?.(under) ?? under}
        </RowHeader>
      </Row>
      {held.map((row) => draws(columns, row, rowToKey(row)))}
    </Body>
  ));
}

/**
 * Returns the scroller's props without the table's own props.
 */
function scrolled<Row>(props: SimpleProps<Row>): ScrollerProps {
  const {
    caption: _caption,
    columns: _columns,
    empty: _empty,
    groupBy: _groupBy,
    groupLabel: _groupLabel,
    onSort: _onSort,
    rows: _rows,
    rowToKey: _rowToKey,
    total: _total,
    ...rest
  } = props;

  return rest;
}

/**
 * Returns the column declarations when a column states a width, and `null` otherwise.
 */
function declared<Row>(held: ReadonlyArray<Leaf<Row>>): null | ReactElement {
  if (!held.some((column) => column.width !== undefined)) return null;

  return (
    <ColumnGroup>
      {held.map((column) => (
        <Declared
          key={column.key}
          {...(column.width === undefined ? {} : { style: { inlineSize: column.width } })}
        />
      ))}
    </ColumnGroup>
  );
}

/**
 * Returns the footer with the total row, one cell per leaf column.
 */
function footed<Row>(
  held: ReadonlyArray<Leaf<Row>>,
  total: NonNullable<SimpleProps<Row>["total"]>,
): ReactElement {
  return (
    <Footer>
      <Row>
        {held.map((column) =>
          column.rowHeader === true ? (
            <RowHeader key={column.key}>{total(column)}</RowHeader>
          ) : (
            <Cell key={column.key} {...(column.numeric === true ? { "data-numeric": true } : {})}>
              {total(column)}
            </Cell>
          ),
        )}
      </Row>
    </Footer>
  );
}

/**
 * Renders a whole table from a list of columns and a list of rows.
 *
 * @typeParam Row - Type of one record.
 * @param props - The columns, the rows, the table's options and the scroller's props.
 * @returns The scroller with the table inside it.
 */
export function Simple<Row>(props: SimpleProps<Row>): ReactElement {
  const { caption, columns, empty, onSort, rows, total } = props;
  const id = useId();
  const held = leaves(columns);
  const bare = rows.length === 0 && empty !== undefined;

  return (
    <Scroller aria-labelledby={caption === undefined ? undefined : id} {...scrolled(props)}>
      <Root>
        {caption === undefined ? null : <Caption id={id}>{caption}</Caption>}
        {declared(held)}
        <Header>
          {named(columns, depth(columns)).map((names, at) => (
            <Row key={names[0]?.key ?? String(at)}>{names.map((name) => heads(name, onSort))}</Row>
          ))}
        </Header>
        {bare ? (
          <Body>
            <Row>
              <Cell colSpan={held.length}>{empty}</Cell>
            </Row>
          </Body>
        ) : (
          bodied(props, held.length)
        )}
        {total === undefined ? null : footed(held, total)}
      </Root>
    </Scroller>
  );
}
