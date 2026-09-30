/**
 * Returns the content of a body cell and of the full-width row under an expanded row.
 *
 * @remarks
 *   A cell renders its column's `cell` template. In a table with levels a group row renders its
 *   grouped cell with the row's toggle, the column's `cell` template and the number of records in
 *   the group, "(12)". It renders an aggregated cell with the column's `aggregatedCell` template,
 *   TanStack's aggregated value as a string unless the column states one, and leaves every other
 *   cell of a column with an accessor empty. A
 *   placeholder, the cell of a grouped column in a row another column groups, is empty. In a table
 *   of sub-rows each cell of the tree column indents by its row's depth below the grouping and
 *   leads with the row's toggle, or with an empty box as wide as a toggle on a row that opens
 *   nothing. The row under an expanded row renders the column's detail, or the loader with the
 *   words of a row whose sub-rows have not arrived.
 */

import { type ReactNode } from "react";

import { type RowData, type Cell as TableCell, type Row as TableRow } from "@tanstack/react-table";

import { Loader } from "@stealthscale/component-feedback";

import { Count, Toggle } from "#data-table/bound.ts";
import { withContext } from "#data-table/context.ts";
import { type Features } from "#data-table/features.ts";
import { branchOf, type Levels } from "#data-table/levels.ts";
import { aggregatedContentOf, cellContentOf, renderedOf } from "#data-table/templates.tsx";
import { TreeToggle } from "#data-table/tree-toggle.tsx";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Describes a cell of a data table.
 */
type AnyCell = TableCell<Features, RowData>;

/**
 * Renders the `span` that lays out a row's toggle and a cell's content in a row, indented by
 * `--row-depth` levels.
 */
const Branch = withContext("span", "branch");

/**
 * Returns the number of records under a group row, without the group rows between.
 */
function recordsOf(cell: AnyCell): number {
  return cell.row.getLeafRows().filter((leaf) => !leaf.getIsGrouped()).length;
}

/**
 * Returns a group row's grouped cell: the row's toggle, the value and the number of records.
 */
function grouped(table: DataTableApi, cell: AnyCell, levels: Levels): ReactNode {
  return (
    <Branch>
      <Toggle>
        <TreeToggle branches={levels.branches} id={cell.row.id} />
      </Toggle>
      {cellContentOf(table, cell)}
      <Count>({String(recordsOf(cell))})</Count>
    </Branch>
  );
}

/**
 * Returns a cell of the tree column: the indent, the row's toggle or an empty box, and the content.
 */
function treed(table: DataTableApi, cell: AnyCell, levels: Levels): ReactNode {
  const { row } = cell;
  const depth: Record<string, string> = { "--row-depth": String(row.depth - levels.grouped) };

  return (
    <Branch style={depth}>
      <Toggle>
        {branchOf(row, levels.detailed) ? (
          <TreeToggle branches={levels.branches} id={row.id} />
        ) : null}
      </Toggle>
      {cellContentOf(table, cell)}
    </Branch>
  );
}

/**
 * Returns a cell's content in a table with levels.
 */
function leveled(table: DataTableApi, cell: AnyCell, levels: Levels): ReactNode {
  if (cell.getIsGrouped()) return grouped(table, cell, levels);
  if (cell.getIsAggregated()) return aggregatedContentOf(table, cell);
  if (cell.getIsPlaceholder()) return null;
  if (cell.row.getIsGrouped() && cell.column.accessorFn !== undefined) return null;

  return cell.column.id === levels.tree ? treed(table, cell, levels) : cellContentOf(table, cell);
}

/**
 * Returns a body cell's content.
 *
 * @param table - The table the part renders with.
 * @param cell - The cell to render.
 * @param levels - The levels every row reads in a table with levels, or undefined for a table
 *   without levels.
 * @returns The content, or `null` for a cell that renders empty.
 */
export function contentOf(
  table: DataTableApi,
  cell: AnyCell,
  levels: Levels | undefined,
): ReactNode {
  return levels === undefined ? cellContentOf(table, cell) : leveled(table, cell, levels);
}

/**
 * Returns the content of the full-width row under an expanded row: the column's detail, or the
 * loader of a row whose sub-rows have not arrived.
 *
 * @param row - The expanded row.
 * @param detail - Returns a record's detail, while a column renders one.
 * @param levels - The levels every row reads. A row waits only in a table with levels.
 * @returns The content.
 */
export function underOf(
  row: TableRow<Features, RowData>,
  detail: ((record: RowData) => ReactNode) | undefined,
  levels: Levels | undefined,
): ReactNode {
  if (detail !== undefined) return renderedOf(detail, row.original);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a row without a detail renders a row under it only in a table with levels
  return <Loader text={(levels as Levels).branches.loadingLabel} />;
}
