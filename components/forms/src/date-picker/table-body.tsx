/**
 * Renders the body of a table: its rows of cells.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";

/**
 * Renders the `tbody` with the date picker's table body class.
 */
const Bodied = withContext("tbody", "tableBody");

/**
 * Describes the props of the table body: the props of a `tbody`.
 */
export type TableBodyProps = ComponentProps<typeof Bodied>;

/**
 * Renders the table body with the machine's props for its view.
 *
 * @param props - The rows and the props of a `tbody`.
 * @returns The `tbody` element.
 */
export function TableBody(props: TableBodyProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return <Bodied {...mergeProps(api.getTableBodyProps({ view }), props)} />;
}
