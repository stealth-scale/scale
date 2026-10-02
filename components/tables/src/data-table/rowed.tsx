/**
 * Renders a data table's body rows for the plain body and the windowed body alike: a record's row
 * with its cells, and the full-width row under an expanded record.
 *
 * @remarks
 *   A column's `meta.rowHeader` renders its cells as row headers, the `th` a screen reader names
 *   each row by, and `meta.numeric` aligns its cells to the end in tabular figures. A group row's
 *   row header is its grouped cell, which names the group, and its other cells are data cells, so
 *   no row header is empty. While a column that selects rows is visible, each row states
 *   `aria-selected`. A pinned column's cells stick with its header. A cell that spans rows or
 *   columns states its spans, a cell whose span ends on the body's last row states it, and a cell
 *   another cell covers is not rendered. In a grid each cell takes the grid's attributes and its
 *   content through the grid's rendering. The caller's marks place a row: its region, its index
 *   among the rows a window renders, its `aria-rowindex` and the ref a window measures it by. In a
 *   table with levels a record's row states its level, its place among its siblings, whether it is
 *   open and whether it has the tab stop, and the row under it states the level below.
 */

import { type ReactElement, type ReactNode, type Ref } from "react";

import { type RowData, type Cell as TableCell, type Row as TableRow } from "@tanstack/react-table";

import { Cell, Row, RowHeader } from "#data-table/bound.ts";
import { contentOf, underOf } from "#data-table/cells.tsx";
import { fitOf, pinnedOf, spanEndOf, spansOf } from "#data-table/columns.ts";
import { type Features } from "#data-table/features.ts";
import { type CellMarks } from "#data-table/grid.ts";
import {
  type Leveling,
  levelMarksOf,
  type Levels,
  levelsOf,
  UNLEVELED,
} from "#data-table/levels.ts";
import { detailIdOf, detailOf, lineKeyOf, selectedOf, selectsOf } from "#data-table/rows.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes what a grid adds to its body's cells: their attributes, their content and the row with
 * the tab stop.
 */
export interface GridRendering {
  /**
   * Returns a cell's content in the grid, from the content it renders outside a grid: the content
   * under the cell's open editor, or with the words of an unsaved change.
   */
  readonly content: (cell: TableCell<Features, RowData>, content: ReactNode) => ReactNode;

  /**
   * Returns a cell's attributes in the grid.
   */
  readonly marks: (cell: TableCell<Features, RowData>) => CellMarks;

  /**
   * Id of the row with the grid's tab stop, which a window keeps rendered.
   */
  readonly tabbedRow: string;
}

/**
 * Describes what every row of the body reads alike: the detail, the levels, the id prefix,
 * whether rows state their selection, a grid's rendering and the number of visible columns.
 */
export interface Shape {
  /**
   * Returns a record's detail, while a column states one.
   */
  readonly detail: ((record: RowData) => ReactNode) | undefined;

  /**
   * Attributes and content a grid gives its cells, or undefined for a table that is not a grid and
   * a grid without a selectable cell.
   */
  readonly grid: GridRendering | undefined;

  /**
   * The levels every row reads in a table with levels, or undefined for a table without levels.
   */
  readonly levels: Levels | undefined;

  /**
   * The root's unique prefix of ids.
   */
  readonly prefix: string;

  /**
   * Whether each row states `aria-selected`.
   */
  readonly selects: boolean;

  /**
   * Number of visible columns, which a full-width cell spans.
   */
  readonly width: number;
}

/**
 * Describes the attributes that place a row in the body.
 */
export interface Marks {
  /**
   * Index of the row among every row of the table, header rows included, from 1.
   */
  readonly "aria-rowindex"?: number;

  /**
   * Index of the row among the lines a window renders, which the window measures it by.
   */
  readonly "data-index"?: number;

  /**
   * Key of the row's line, which a window keeps rendered while the line contains focus.
   */
  readonly "data-key"?: string;

  /**
   * Region a pinned row renders in.
   */
  readonly "data-pinned"?: "bottom" | "top";

  /**
   * Present on the last row of a region another region follows.
   */
  readonly "data-region-end"?: "";

  /**
   * Ref a window measures the row's height by.
   */
  readonly ref?: Ref<HTMLTableRowElement>;
}

/**
 * Returns what every row of the table's body reads alike.
 *
 * @param table - The table whose columns are read.
 * @param prefix - The root's unique prefix of ids.
 * @param leveling - The row with the tab stop, and the words and the glyph of the toggles, which a
 *   table with levels reads. None and the English words unless stated.
 * @param grid - The attributes and content a grid gives its cells. None unless stated.
 * @returns The detail, the levels, the prefix, whether rows state their selection, a grid's
 *   rendering and the column count.
 */
export function shapeOf(
  table: DataTableApi,
  prefix: string,
  leveling: Leveling = UNLEVELED,
  grid?: GridRendering,
): Shape {
  return {
    detail: detailOf(table),
    grid,
    levels: levelsOf(table, leveling),
    prefix,
    selects: selectsOf(table),
    width: table.getVisibleLeafColumns().length,
  };
}

/**
 * Returns one cell: a row header for a row-header column, and in a group row for the grouped cell,
 * a data cell otherwise, and nothing for a cell another cell's span covers.
 */
function celled(
  table: DataTableApi,
  cell: TableCell<Features, RowData>,
  shape: Shape,
): null | ReactElement {
  if (cell.getIsCovered()) return null;

  const { meta } = cell.column.columnDef;
  const plain = contentOf(table, cell, shape.levels);
  const content = shape.grid === undefined ? plain : shape.grid.content(cell, plain);
  const placed = {
    ...pinnedOf(table, cell.column),
    ...fitOf(cell.column),
    ...spansOf(cell),
    ...spanEndOf(table, cell),
    ...shape.grid?.marks(cell),
  };
  const header = cell.row.getIsGrouped() ? cell.getIsGrouped() : meta?.rowHeader === true;

  if (header) {
    return (
      <RowHeader key={cell.id} {...placed}>
        {content}
      </RowHeader>
    );
  }

  return (
    <Cell key={cell.id} {...placed} {...(meta?.numeric === true ? { "data-numeric": true } : {})}>
      {content}
    </Cell>
  );
}

/**
 * Returns a record's row with its visible cells.
 *
 * @param table - The table the row renders with.
 * @param row - The row to render.
 * @param shape - The body's shape: its detail, levels, id prefix, selection and column count.
 * @param marks - The attributes that place the row.
 * @returns The `tr` element.
 */
export function recordRowOf(
  table: DataTableApi,
  row: TableRow<Features, RowData>,
  shape: Shape,
  marks: Marks,
): ReactElement {
  const { levels } = shape;

  return (
    <Row
      key={lineKeyOf(row.id, false)}
      {...marks}
      {...(levels === undefined ? {} : levelMarksOf(table, row, levels, shape.prefix))}
      {...(shape.selects ? { "aria-selected": selectedOf(table, row.id) } : {})}
    >
      {row.getVisibleCells().map((cell) => celled(table, cell, shape))}
    </Row>
  );
}

/**
 * Returns the full-width row under a record's row: the detail a column renders, or the loader of a
 * row whose sub-rows have not arrived.
 *
 * @param row - The expanded row.
 * @param shape - The body's shape, whose detail, levels and column count are read.
 * @param marks - The attributes that place the row.
 * @returns The `tr` element.
 */
export function detailRowOf(
  row: TableRow<Features, RowData>,
  shape: Shape,
  marks: Marks,
): ReactElement {
  const level = shape.levels === undefined ? {} : { "aria-level": row.depth + 2 };

  return (
    <Row id={detailIdOf(shape.prefix, row.id)} key={lineKeyOf(row.id, true)} {...marks} {...level}>
      <Cell colSpan={shape.width}>{underOf(row, shape.detail, shape.levels)}</Cell>
    </Row>
  );
}
