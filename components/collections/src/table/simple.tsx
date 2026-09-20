/**
 * Draws a whole table from the columns it is told about and the records it is handed.
 *
 * @remarks
 *   Every table is the same shape: a caption, a row of names, a row per record, and sometimes a
 *   total. Composing that by hand is forty lines a table and states a column's own facts in four
 *   places. This draws it from one list of columns, and a table that wants something else composes
 *   the parts, which are published beside this and are what this is built from.
 *   Sorting and filtering stay with the page. A column says which way it is sorted and what its
 *   control is called, and the press is reported. What the order comes to is the caller's, because
 *   a component that sorts has an opinion about the data it shows.
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
 * Describes what a whole table takes beyond everything its scroller takes.
 *
 * @remarks
 *   The scroller's `columns` is taken off, which is the CSS property that sets text in columns. The
 *   table's own columns are the more useful thing to call `columns` on a table, and nobody sets
 *   multi-column text on the box a table scrolls inside.
 * @typeParam Row - What one record holds.
 */
export interface SimpleProps<Row> extends Omit<ScrollerProps, "columns"> {
  /**
   * Written under the table, saying what it holds. It names the table to a screen reader as well.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * The columns, in the order they are drawn. A column holding columns spans them.
   */
  readonly columns: ReadonlyArray<Column<Row>>;

  /**
   * Drawn across the table's width where it holds no records at all. A table with none draws an
   * empty body, which reads as a table still loading.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Reads the heading a record is gathered under, for a table drawn in sections.
   */
  readonly groupBy?: ((row: Row) => string) | undefined;

  /**
   * Reads the words a heading is drawn by, where they are not the heading's own key.
   */
  readonly groupLabel?: ((under: string) => ReactNode) | undefined;

  /**
   * Hears which column a reader pressed to sort by.
   */
  readonly onSort?: ((key: string) => void) | undefined;

  /**
   * The records, in the order they are drawn.
   */
  readonly rows: readonly Row[];

  /**
   * Reads the key a record is drawn under, so a row keeps its place as the records change.
   */
  readonly rowToKey: (row: Row) => string;

  /**
   * Drawn as the last row, for a table that sums what it holds. Read per column, so a total lands
   * under the figures it sums. A column that spans others is never handed over, because a total
   * belongs under the figures rather than under the name over them.
   */
  readonly total?: ((column: Leaf<Row>) => ReactNode) | undefined;
}

/**
 * Reads what a column holds for one record, off the column's own reader or off the key.
 */
function valueOf<Row>(column: Leaf<Row>, row: Row): ReactNode {
  if (column.cell !== undefined) return column.cell(row);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a record is read by the key its column is named under, which is the contract a column with no reader states
  return (row as Record<string, ReactNode>)[column.key] ?? null;
}

/**
 * Writes the attributes a name takes: the figures it heads, the room it spans, and the order it is
 * in.
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
 * Draws one name at the head of a column, with its control where the column sorts.
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
 * Draws one record as a row, its naming column as the row's own header.
 *
 * @remarks
 *   Every cell says which row and which column it belongs to. The two attributes are the pair
 *   `useMatrixCrosshair` reads, so a grid wide enough to need one gets it without a caller writing
 *   an attribute per cell, and they are derived from what the table already knows rather than
 *   asked for.
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
 * Gathers the records under their headings, in the order the headings first appear.
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
 * Draws the records, gathered into a section per heading where the table is told how to gather
 * them.
 *
 * @remarks
 *   A section per group rather than a heading row inside one. A group of rows is a group of rows
 *   to a screen reader as well as on the screen, and `tbody` is what a table has to say so.
 *   The heading states `rowgroup` as its scope, which says the rows under it answer to it. A
 *   `colgroup` scope says the columns do, and reads the heading out as a column name.
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
 * Splits what the box a table scrolls inside takes from what the table itself takes, so nothing
 * the table reads reaches the document as an attribute.
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
 * Declares the table's columns, for the widths a fixed layout and a held column both need.
 *
 * @remarks
 *   Drawn only where a column states a width. A declaration per column that says nothing is a
 *   declaration a reader of the markup has to check before learning it says nothing.
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
 * Draws the last row, read per column so a total lands under the figures it sums.
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
 * Draws a whole table from the columns it is told about.
 *
 * @typeParam Row - What one record holds.
 * @param props - The columns, the records, and everything the scroller takes.
 * @returns The table, in the box it scrolls inside.
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
