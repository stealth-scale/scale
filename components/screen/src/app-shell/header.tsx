/**
 * Renders a bar across the top of the shell.
 *
 * @remarks
 *   The element is `header`, which is the `banner` landmark at the top level of a document. Several
 *   bars stack in source order. A `sticky` bar pins to the top of the window under the pinned bars
 *   before it, and the root measures the offset. The bar is inert while a panel is over the page,
 *   so it takes no focus behind the backdrop.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the bar `header`.
 */
const Barred = withContext("header", "header");

/**
 * Describes the props of `Header`.
 */
export interface HeaderProps extends ComponentProps<typeof Barred> {
  /**
   * Whether the bar pins to the top of the window while the window scrolls.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Renders a bar across the top.
 *
 * @param props - `sticky` and the `header` element's props.
 * @returns The bar, inert while a panel is over the page.
 */
export function Header({ sticky = false, ...rest }: HeaderProps): ReactElement {
  const sheets = useOverlaid();

  return <Barred {...rest} data-sticky={sticky ? "" : undefined} inert={sheets.length > 0} />;
}
