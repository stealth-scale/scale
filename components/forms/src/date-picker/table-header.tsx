/**
 * Renders the header of a table's column: a weekday's name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";

/**
 * Renders the `th` with the date picker's table header class.
 */
const Titled = withContext("th", "tableHeader");

/**
 * Describes the props of a table header: the props of a `th`.
 */
export type TableHeaderProps = ComponentProps<typeof Titled>;

/**
 * Renders the table header with the machine's props for its view.
 *
 * @param props - The weekday's name and the props of a `th`.
 * @returns The `th` element.
 */
export function TableHeader(props: TableHeaderProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return <Titled {...mergeProps(api.getTableHeaderProps({ view }), { scope: "col" }, props)} />;
}
