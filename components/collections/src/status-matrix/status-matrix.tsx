/**
 * Draws one set against another, a mark at every crossing.
 *
 * @remarks
 *   For the question a table of values cannot answer at a glance: which of these is not well, and
 *   where. Services against regions, controls against environments, models against evaluations. A
 *   reader scans for the marks that are not the calm one, then reads the row and the column that
 *   meet there.
 *   It is a table, drawn from the table's own parts, so every band, rule and scope a table has is
 *   the table's. What a matrix adds is the sparse reading of its cells, the mark a state is drawn
 *   as, the rollup, the legend, and the crosshair that says which pair the pointer is on.
 *   Nothing in the grid is a tab stop until a caller wants to hear cells picked. A matrix of four
 *   hundred crossings is four hundred stops, and a reader tabbing past a grid they only wanted to
 *   read is a reader who leaves the page. Given a handler, every crossing becomes a button, gaps
 *   included: a pair nobody measured is exactly the pair somebody wants to go and measure.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { useMatrixCrosshair } from "@stealthscale/hooks";

import { withContext, withProvider } from "#status-matrix/context.ts";
import { Legend } from "#status-matrix/legend.tsx";
import { Mark } from "#status-matrix/mark.tsx";
import {
  indexed,
  type MatrixCell,
  type MatrixHeading,
  type MatrixIndex,
  type MatrixState,
  stateOf,
  worst,
} from "#status-matrix/states.ts";
import {
  Body,
  Caption,
  Cell,
  ColumnHeader,
  Header,
  Root,
  Row,
  RowHeader,
  Scroller,
  type ScrollerProps,
} from "#table/parts.ts";

/**
 * Stacks the grid over the legend, and states the variants every part reads.
 */
const Framed = withProvider("div", "root");

/**
 * Draws one column's name, and lights up as the pointer crosses it.
 */
const Heading = withContext(ColumnHeader, "columnHeading");

/**
 * Centres a column's name over the marks under it.
 */
const Centred = withContext("span", "columnLabel");

/**
 * Draws one row's own name, and lights up as the pointer crosses it.
 */
const Naming = withContext(RowHeader, "rowHeading");

/**
 * Draws one crossing, and lights up as the pointer reaches its row or its column.
 */
const Crossing = withContext(Cell, "cell");

/**
 * Presses one crossing, for a matrix a reader picks from.
 */
const Picker = withContext("button", "picker");

/**
 * Describes what a matrix takes beyond everything its scroller takes.
 *
 * @remarks
 *   The scroller's `columns` is taken off, which is the CSS property that sets text in columns.
 *   The matrix's own columns are the more useful thing to call `columns` on a matrix.
 */
export interface StatusMatrixProps extends Omit<ScrollerProps, "children" | "columns"> {
  /**
   * Written under the grid, saying what it holds. It names the grid to a screen reader as well.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Reads out as the name of one crossing, where the state's own words are not enough. A matrix a
   * reader picks from wants one, because a column of buttons all called `Healthy` says nothing
   * about which is which. A matrix nobody picks from does not, because the row and the column are
   * already the table's own headers.
   */
  readonly cellLabel?:
    | ((state: MatrixState, row: MatrixHeading, column: MatrixHeading) => string)
    | undefined;

  /**
   * Every crossing that was measured. A pair left out reads as unmeasured rather than as passing,
   * and two entries for one pair is not an error: the later one wins.
   */
  readonly cells: readonly MatrixCell[];

  /**
   * The second axis, drawn across the top.
   */
  readonly columns: readonly MatrixHeading[];

  /**
   * Drawn in the corner, over the row names. It is the one cell that names neither axis on its
   * own, so it is where the axes are named.
   */
  readonly corner?: ReactNode | undefined;

  /**
   * Drawn across the grid's width where there are no rows at all.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Reads out as the name of the legend, which is drawn where this is given. A grid of marks a
   * reader has not seen before needs one.
   */
  readonly legend?: string | undefined;

  /**
   * Hears a crossing picked, and turns every crossing into a button. The cell is missing where
   * the pair was never measured.
   */
  readonly onSelectCell?:
    | ((row: string, column: string, cell: MatrixCell | undefined) => void)
    | undefined;

  /**
   * The last column, which says what each row comes to. Left off, the column is not drawn.
   */
  readonly rollup?: ReactNode | undefined;

  /**
   * The subject axis, one per row.
   */
  readonly rows: readonly MatrixHeading[];

  /**
   * The caller's own vocabulary, keyed by the names the cells use. Two states sharing a tone need
   * a mark each, or they draw the same.
   */
  readonly states: Readonly<Record<string, MatrixState>>;

  /**
   * Drawn at a crossing nobody measured, and written last in the legend. A gap that drew nothing
   * would read as a crossing with nothing wrong.
   */
  readonly unmeasured: MatrixState;
}

/**
 * Splits what the box a matrix scrolls inside takes from what the matrix itself takes, so nothing
 * the matrix reads reaches the document as an attribute.
 */
function scrolled(props: StatusMatrixProps): ScrollerProps {
  const {
    caption: _caption,
    cellLabel: _cellLabel,
    cells: _cells,
    columns: _columns,
    corner: _corner,
    empty: _empty,
    legend: _legend,
    onSelectCell: _onSelectCell,
    rollup: _rollup,
    rows: _rows,
    states: _states,
    unmeasured: _unmeasured,
    ...rest
  } = props;

  return rest;
}

/**
 * Draws one crossing, as a button where a caller hears them picked.
 */
function marked(
  props: StatusMatrixProps,
  index: MatrixIndex,
  row: MatrixHeading,
  column: MatrixHeading,
): ReactElement {
  const { cellLabel, onSelectCell, states, unmeasured } = props;
  const cell = index.get(row.id)?.get(column.id);
  const state = stateOf(states, cell) ?? unmeasured;
  const label = cellLabel?.(state, row, column) ?? state.label;

  return (
    <Crossing data-column={column.id} data-row={row.id} key={column.id}>
      {onSelectCell === undefined ? (
        <Mark label={label} state={state} />
      ) : (
        <Picker
          aria-label={label}
          onClick={() => {
            onSelectCell(row.id, column.id, cell);
          }}
          type="button"
        >
          <Mark state={state} />
        </Picker>
      )}
    </Crossing>
  );
}

/**
 * Works out the name the rollup column is lit by, which is one no column of the caller's holds.
 *
 * @remarks
 *   The crosshair lights a column by its name, so the rollup needs one or it is the one column a
 *   pointer crosses without lighting. The name is stretched until it is nobody else's rather than
 *   fixed, because `rollup` is a name a caller is free to give a column of their own.
 */
function rolling(columns: readonly MatrixHeading[]): string {
  let name = "rollup";

  while (columns.some((column) => column.id === name)) name += "-";

  return name;
}

/**
 * Draws what one row comes to, which is the worst thing along it.
 *
 * @remarks
 *   Never a button. A rollup is read off the row rather than measured, so there is nothing at it to
 *   go and look at.
 */
function summed(props: StatusMatrixProps, index: MatrixIndex, row: MatrixHeading): ReactElement {
  const { columns, states, unmeasured } = props;
  const along = columns.map((column) => stateOf(states, index.get(row.id)?.get(column.id)));
  const state = worst(along) ?? unmeasured;

  return (
    <Crossing data-column={rolling(columns)} data-row={row.id}>
      <Mark label={state.label} state={state} />
    </Crossing>
  );
}

/**
 * Draws one row: its own name, a crossing per column, and what it comes to.
 */
function draws(props: StatusMatrixProps, index: MatrixIndex, row: MatrixHeading): ReactElement {
  const { columns, rollup } = props;

  return (
    <Row key={row.id}>
      <Naming data-row={row.id}>{row.label}</Naming>
      {columns.map((column) => marked(props, index, row, column))}
      {rollup === undefined ? null : summed(props, index, row)}
    </Row>
  );
}

/**
 * Gathers the rows under their sections, in the order the sections first appear, or reports that
 * one of them states no section at all.
 */
function gathered(rows: readonly MatrixHeading[]): Map<string, MatrixHeading[]> | undefined {
  const groups = new Map<string, MatrixHeading[]>();

  for (const row of rows) {
    if (row.group === undefined) return undefined;

    groups.set(row.group, [...(groups.get(row.group) ?? []), row]);
  }

  return groups;
}

/**
 * Draws the rows, gathered into a section per heading where every row states one.
 *
 * @remarks
 *   Every row or none. A section drawn over some of the rows and not the rest leaves the ungrouped
 *   ones under a heading they do not belong to, which is worse than no sections at all.
 */
function bodied(props: StatusMatrixProps, index: MatrixIndex, wide: number): ReactNode {
  const { empty, rows } = props;

  if (rows.length === 0 && empty !== undefined) {
    return (
      <Body>
        <Row>
          <Cell colSpan={wide}>{empty}</Cell>
        </Row>
      </Body>
    );
  }

  const groups = gathered(rows);

  if (groups === undefined) {
    return <Body>{rows.map((row) => draws(props, index, row))}</Body>;
  }

  return [...groups].map(([under, held]) => (
    <Body key={under}>
      <Row>
        <RowHeader colSpan={wide} scope="rowgroup">
          {under}
        </RowHeader>
      </Row>
      {held.map((row) => draws(props, index, row))}
    </Body>
  ));
}

/**
 * Draws the band of column names, the corner first and the rollup last.
 */
function headed(props: StatusMatrixProps): ReactElement {
  const { columns, corner, rollup } = props;

  return (
    <Header>
      <Row>
        <Heading>{corner}</Heading>
        {columns.map((column) => (
          <Heading data-column={column.id} key={column.id}>
            <Centred>{column.label}</Centred>
          </Heading>
        ))}
        {rollup === undefined ? null : (
          <Heading data-column={rolling(columns)}>
            <Centred>{rollup}</Centred>
          </Heading>
        )}
      </Row>
    </Header>
  );
}

/**
 * Draws one set against another, a mark at every crossing.
 *
 * @param props - The two axes, the crossings that were measured, the vocabulary they name, and
 *   everything the scroller takes.
 * @returns The grid, in the box it scrolls inside, over its legend.
 */
export function StatusMatrix(props: StatusMatrixProps): ReactElement {
  const { caption, cells, columns, legend, rollup, size, states, unmeasured } = props;
  const id = useId();
  const { clear, ref, track } = useMatrixCrosshair<HTMLTableElement>();
  const index = indexed(cells);
  const wide = columns.length + (rollup === undefined ? 1 : 2);

  return (
    <Framed {...(size === undefined ? {} : { size })}>
      <Scroller aria-labelledby={caption === undefined ? undefined : id} {...scrolled(props)}>
        <Root onPointerLeave={clear} onPointerMove={track} ref={ref}>
          {caption === undefined ? null : <Caption id={id}>{caption}</Caption>}
          {headed(props)}
          {bodied(props, index, wide)}
        </Root>
      </Scroller>
      {legend === undefined ? null : (
        <Legend label={legend} states={[...Object.values(states), unmeasured]} />
      )}
    </Framed>
  );
}
