/**
 * Renders the header of the week numbers column.
 *
 * @remarks
 *   The element is named by `label`, "Week" by default. It contains the caller's text, such as
 *   `#`.
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
 * Describes the props of the week numbers header: its name and the props of a `th`.
 */
export interface WeekNumberHeaderCellProps extends ComponentProps<typeof Titled> {
  /**
   * Accessible name of the column. Defaults to `Week`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the header with the machine's props for its view, named by `label`.
 *
 * @param props - The name, the text and the props of a `th`.
 * @returns The `th` element.
 */
export function WeekNumberHeaderCell({
  label = "Week",
  ...props
}: WeekNumberHeaderCellProps): ReactElement {
  const api = useDatePicker();
  const { view } = useView();

  return (
    <Titled
      {...mergeProps(api.getWeekNumberHeaderCellProps({ view }), { "aria-label": label }, props)}
    />
  );
}
