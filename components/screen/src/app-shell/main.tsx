/**
 * Renders the main region of the shell.
 *
 * @remarks
 *   The element is `main`, the `main` landmark. Render one. A page inside it has no landmark of its
 *   own. The region is inert while a panel is over the page, so the page behind the backdrop takes
 *   no press and no focus, and the panel behaves as a sheet without a dialog role.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the `main` element.
 */
const Framed = withContext("main", "main");

/**
 * Describes the props of `Main`.
 */
export type MainProps = ComponentProps<typeof Framed>;

/**
 * Renders the main region in the space the panels leave, scrolling when the page scrolls.
 *
 * @param props - The `main` element's props.
 * @returns The main region, inert while a panel is over the page.
 */
export function Main(props: MainProps): ReactElement {
  const sheets = useOverlaid();

  return <Framed {...props} inert={sheets.length > 0} />;
}
