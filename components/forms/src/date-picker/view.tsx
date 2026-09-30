/**
 * Renders one view of the panel: the days of a month, the months of a year or the years of a
 * decade.
 *
 * @remarks
 *   The element is hidden while another view is in force. Its header and its tables read the view
 *   from it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { type DateView, useDatePicker } from "#date-picker/machine.ts";
import { ViewProvider } from "#date-picker/scopes.ts";

/**
 * Renders the `div` with the date picker's view class.
 */
const Shown = withContext("div", "view");

/**
 * Describes the props of a view: which view it is and the props of a `div`.
 */
export interface ViewProps extends ComponentProps<typeof Shown> {
  /**
   * The view: `day`, `month` or `year`. Defaults to `day`.
   */
  readonly view?: DateView | undefined;
}

/**
 * Renders the view with the machine's view props, and provides the view to its parts.
 *
 * @param props - The view, its header and tables, and the props of a `div`.
 * @returns The `div` element, hidden while another view is in force.
 */
export function View({ view = "day", ...props }: ViewProps): ReactElement {
  const api = useDatePicker();

  return (
    <ViewProvider value={{ view }}>
      <Shown {...mergeProps(api.getViewProps({ view }), props)} />
    </ViewProvider>
  );
}
