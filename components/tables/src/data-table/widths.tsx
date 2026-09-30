/**
 * Renders the column declarations of a sized table: a `col` per visible column, as wide as the
 * column's size.
 *
 * @remarks
 *   The declarations follow the columns' visual order, pinned start columns first and pinned end
 *   columns last, as the header and the cells do. A table laid out by its content renders none.
 */

import { type ReactElement } from "react";

import { Table } from "@stealthscale/component-collections";

import { Column } from "#data-table/bound.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Describes the props of the column declarations: whether the table lays out its columns at their
 * sizes.
 */
export interface WidthsProps {
  /**
   * Whether the table lays out its columns at their sizes, which the declarations state.
   */
  readonly sized: boolean;
}

/**
 * Renders the `colgroup` of a sized table, or nothing.
 *
 * @param props - Whether the table is sized.
 * @returns The `colgroup` element, or `null` for a table laid out by its content.
 */
export function Widths({ sized }: WidthsProps): null | ReactElement {
  const table = useTableState();

  if (!sized) return null;

  return (
    <Table.ColumnGroup>
      {table.getLeafHeaders().map((header) => {
        const size: Record<string, string> = { "--column-size": `${String(header.getSize())}px` };

        return <Column key={header.id} style={size} />;
      })}
    </Table.ColumnGroup>
  );
}
