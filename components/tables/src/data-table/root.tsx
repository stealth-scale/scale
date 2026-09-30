/**
 * Renders the column that stacks a data table's parts, and provides the table to them.
 *
 * @remarks
 *   The element is a `div`, a flex column that stacks the table and its controls at the medium gap.
 *   The root also provides a unique prefix for the ids its parts write. A part rendered outside a
 *   root throws and names the kit.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { type RowData } from "@tanstack/react-table";

import { withProvider } from "#data-table/context.ts";
import { PrefixProvider, TableProvider } from "#data-table/state.ts";
import { type DataTableApi } from "#data-table/use-data-table.ts";

/**
 * Renders the `div` with the recipe's root class.
 */
const Column = withProvider("div", "root");

/**
 * Describes the props of the root: the table and the props of a `div`.
 *
 * @typeParam Row - Type of one record.
 */
export interface RootProps<Row extends RowData> extends ComponentProps<typeof Column> {
  /**
   * Table `useDataTable` returns, which every part reads.
   */
  readonly table: DataTableApi<Row>;
}

/**
 * Renders the column inside the table's provider.
 *
 * @typeParam Row - Type of one record.
 * @param props - The table and the props of a `div`.
 * @returns The `div` element inside the provider.
 */
export function Root<Row extends RowData>({ table, ...props }: RootProps<Row>): ReactElement {
  const prefix = useId();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the parts read records as RowData and write none back
  const provided = table as unknown as DataTableApi;

  return (
    <TableProvider value={provided}>
      <PrefixProvider value={prefix}>
        <Column {...props} />
      </PrefixProvider>
    </TableProvider>
  );
}
