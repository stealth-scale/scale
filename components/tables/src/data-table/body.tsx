/**
 * Renders a data table's body: the rows pinned to the top, the rows of the row model between, and
 * the rows pinned to the bottom.
 *
 * @remarks
 *   While a column states `meta.detail`, an expanded row has a full-width detail row under it, and
 *   in a table with levels an expanded row whose sub-rows have not arrived has a row that waits for
 *   them. A pinned row states its region in `data-pinned`, and the last row of a region another
 *   region follows states `data-region-end`, the row under it where the region's last record is
 *   expanded. While the table has no rows, the body renders one full-width row with the empty
 *   content. Every row is rendered from the table, so a row renders again after each change of the
 *   table's state. A windowed table renders its body through `WindowedBody`, which renders only the
 *   rows in or near the viewport.
 */

import { type ReactElement, type ReactNode } from "react";

import { type RowData } from "@tanstack/react-table";

import { Table } from "@stealthscale/component-collections";

import { Row } from "#data-table/bound.ts";
import { type Leveling } from "#data-table/levels.ts";
import { detailRowOf, recordRowOf, type Shape, shapeOf } from "#data-table/rowed.tsx";
import { detailedOf, type Placed, regionsOf } from "#data-table/rows.ts";
import { useIdPrefix, useTableState } from "#data-table/state.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";
import { WindowedBody, type Windowing } from "#data-table/windowed-body.tsx";

/**
 * Describes the props of the body: the content of the row shown while there are no rows, what the
 * rows of a table with levels read, and how a windowed table renders it.
 */
export interface BodyProps {
  /**
   * Content of the full-width row rendered while the table has no rows.
   */
  readonly empty: ReactNode;

  /**
   * Attributes and content a grid gives its cells, or undefined for a table that is not a grid.
   */
  readonly grid: Shape["grid"];

  /**
   * The row with the tab stop, and the words and the glyph of the toggles, which a table with
   * levels reads.
   */
  readonly leveling: Leveling;

  /**
   * How a windowed table renders its body. The body renders every row unless stated.
   */
  readonly windowing?: undefined | Windowing;
}

/**
 * Returns one record's row, followed by the row under it while it is expanded.
 */
function rowed(table: DataTableApi, placed: Placed<RowData>, shape: Shape): ReactElement[] {
  const { ends, region, row } = placed;
  const detailed = detailedOf(table, row, shape.detail !== undefined, shape.levels !== undefined);
  const end = ends ? { "data-region-end": "" as const } : {};
  const record = recordRowOf(table, row, shape, {
    ...(region === "center" ? {} : { "data-pinned": region }),
    ...(detailed ? {} : end),
  });

  return detailed ? [record, detailRowOf(row, shape, end)] : [record];
}

/**
 * Renders the `tbody` with the table's rows, or the empty row, or the windowed body.
 *
 * @param props - The empty row's content, a grid's rendering, the leveling and the windowing.
 * @returns The `tbody` element, or the windowed body's row groups.
 */
export function Body({ empty, grid, leveling, windowing }: BodyProps): ReactElement {
  const table = useTableState();
  const prefix = useIdPrefix();

  if (windowing !== undefined) {
    return <WindowedBody empty={empty} grid={grid} leveling={leveling} {...windowing} />;
  }

  const rows = regionsOf(table);
  const shape = shapeOf(table, prefix, leveling, grid);

  if (rows.length === 0) {
    return (
      <Table.Body>
        <Row>
          <Table.Cell colSpan={shape.width}>{empty}</Table.Cell>
        </Row>
      </Table.Body>
    );
  }

  return <Table.Body>{rows.flatMap((placed) => rowed(table, placed, shape))}</Table.Body>;
}
