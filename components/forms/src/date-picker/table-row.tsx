/**
 * Renders a row of a table: a week, or a row of months or years.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";

/**
 * Renders the `tr` with the date picker's table row class.
 */
const Rowed = withContext("tr", "tableRow");

/**
 * Describes the props of a table row: the props of a `tr`.
 */
export type TableRowProps = ComponentProps<typeof Rowed>;

/**
 * Renders the table row with the machine's props for its view.
 *
 * @param props - The cells and the props of a `tr`.
 * @returns The `tr` element.
 */
export function TableRow(props: TableRowProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return <Rowed {...mergeProps(api.getTableRowProps({ view }), props)} />;
}
