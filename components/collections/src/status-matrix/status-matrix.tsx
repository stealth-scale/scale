/**
 * Renders the state of one set of items against another, with a mark at every crossing.
 *
 * @remarks
 *   The matrix is a table built from the table's parts, so it takes the table's variants, rules,
 *   scopes and scroll container. It adds sparse cells, a mark per state, the rollup column, the
 *   legend and the crosshair. Without `onSelectCell` the grid has no tab stop. With it every
 *   crossing is a button, a crossing with no cell included.
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
 * Renders the `div` that stacks the grid over the legend and provides the matrix's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Renders a column header that fills with the crosshair.
 */
const Heading = withContext(ColumnHeader, "columnHeading");

/**
 * Renders the `span` that centres a column's name over its marks.
 */
const Centred = withContext("span", "columnLabel");

/**
 * Renders a row header that fills with the crosshair.
 */
const Naming = withContext(RowHeader, "rowHeading");

/**
 * Renders a crossing's cell, which fills when the crosshair reaches its row or its column.
 */
const Crossing = withContext(Cell, "cell");

/**
 * Renders the `button` of a crossing in a matrix with `onSelectCell`.
 */
const Picker = withContext("button", "picker");

/**
 * Describes the props of the matrix: the axes, the cells, the vocabulary and the scroller's props.
 *
 * @remarks
 *   The scroller's `columns`, the CSS multi-column property, is left out, so `columns` names the
 *   matrix's columns.
 */
export interface StatusMatrixProps extends Omit<ScrollerProps, "children" | "columns"> {
  /**
   * Caption rendered under the grid, and the accessible name of the table and the scroller.
   */
  readonly caption?: ReactNode | undefined;

  /**
   * Returns a crossing's accessible name. Defaults to the state's label. A matrix with
   * `onSelectCell` needs it, because every button in a column would otherwise share one name.
   */
  readonly cellLabel?:
    | ((state: MatrixState, row: MatrixHeading, column: MatrixHeading) => string)
    | undefined;

  /**
   * Measured crossings. A pair without a cell renders `unmeasured`, and the later of two cells for
   * one pair applies.
   */
  readonly cells: readonly MatrixCell[];

  /**
   * Headings across the top.
   */
  readonly columns: readonly MatrixHeading[];

  /**
   * Content of the header cell over the row names.
   */
  readonly corner?: ReactNode | undefined;

  /**
   * Content of a full-width row rendered while `rows` is empty.
   */
  readonly empty?: ReactNode | undefined;

  /**
   * Accessible name of the legend. The legend renders only with it.
   */
  readonly legend?: string | undefined;

  /**
   * Called with the row, the column and the cell of a pressed crossing. The cell is undefined for
   * a pair without one. Setting it renders every crossing as a button.
   */
  readonly onSelectCell?:
    | ((row: string, column: string, cell: MatrixCell | undefined) => void)
    | undefined;

  /**
   * Header of the last column, which renders each row's worst state. The column renders only with
   * it.
   */
  readonly rollup?: ReactNode | undefined;

  /**
   * Headings down the side, one per row.
   */
  readonly rows: readonly MatrixHeading[];

  /**
   * Vocabulary of states, keyed by the names the cells use. Two states with one tone need a mark
   * each, or they render alike.
   */
  readonly states: Readonly<Record<string, MatrixState>>;

  /**
   * State of a pair without a cell, listed last in the legend.
   */
  readonly unmeasured: MatrixState;
}

/**
 * Returns the scroller's props without the matrix's own props.
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
 * Returns one crossing's cell, with a button inside it when `onSelectCell` is set.
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
 * Returns the `data-column` value of the rollup column: `rollup`, extended with hyphens until no
 * column of the caller's has the same identifier.
 *
 * @remarks
 *   The crosshair fills a column by its `data-column`, so the rollup needs a value of its own.
 */
function rolling(columns: readonly MatrixHeading[]): string {
  let name = "rollup";

  while (columns.some((column) => column.id === name)) name += "-";

  return name;
}

/**
 * Returns a row's rollup cell, with the worst state along the row. The cell is never a button.
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
 * Returns one row: its header, a cell per column and the rollup cell.
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
 * Returns the rows grouped by `group` in first-seen order, or undefined when a row has no group.
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
 * Returns the body: the empty row, one `tbody` per group when every row has a group, or one
 * `tbody` of every row.
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
 * Returns the header row: the corner, a header per column and the rollup header.
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
 * Renders the state of one set of items against another, with a mark at every crossing.
 *
 * @param props - The axes, the cells, the vocabulary and the scroller's props.
 * @returns The scroller with the table inside it, over the legend.
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
