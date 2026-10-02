/**
 * Renders a status bar at the foot of the shell, after the footer.
 *
 * @remarks
 *   The element is a `div` with no role, because the bar is not a landmark. The bar is not a live
 *   region either, because a live region would announce every change of every entry in it: an entry
 *   that reports a change renders its own `output`. The recipe lays the entries out in a row that
 *   wraps. The bar is inert while a panel is over the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the bar `div`.
 */
const Barred = withContext("div", "status");

/**
 * Describes the props of `Status`.
 */
export type StatusProps = ComponentProps<typeof Barred>;

/**
 * Renders the status bar.
 *
 * @param props - The `div` element's props.
 * @returns The bar, inert while a panel is over the page.
 */
export function Status(props: StatusProps): ReactElement {
  const sheets = useOverlaid();

  return <Barred {...props} inert={sheets.length > 0} />;
}
