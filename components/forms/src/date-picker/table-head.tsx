/**
 * Renders the head of a table: the row of weekday names.
 *
 * @remarks
 *   The machine hides the head from assistive technology, because each day's name includes its
 *   weekday.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useView } from "#date-picker/scopes.ts";

/**
 * Renders the `thead` with the date picker's table head class.
 */
const Headed = withContext("thead", "tableHead");

/**
 * Describes the props of the table head: the props of a `thead`.
 */
export type TableHeadProps = ComponentProps<typeof Headed>;

/**
 * Renders the table head with the machine's props for its view.
 *
 * @param props - The row and the props of a `thead`.
 * @returns The `thead` element.
 */
export function TableHead(props: TableHeadProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return <Headed {...mergeProps(api.getTableHeadProps({ view }), props)} />;
}
