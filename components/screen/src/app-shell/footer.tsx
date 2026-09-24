/**
 * Renders a bar across the bottom of the shell.
 *
 * @remarks
 *   The element is `footer`, which is the `contentinfo` landmark at the top level of a document.
 *   Several bars stack in source order. A `sticky` bar pins to the bottom of the window and pads
 *   itself by the safe area. The bar is inert while a panel is over the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Renders the bar `footer`.
 */
const Barred = withContext("footer", "footer");

/**
 * Describes the props of `Footer`.
 */
export interface FooterProps extends ComponentProps<typeof Barred> {
  /**
   * Whether the bar pins to the bottom of the window while the window scrolls.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Renders a bar across the bottom.
 *
 * @param props - `sticky` and the `footer` element's props.
 * @returns The bar, inert while a panel is over the page.
 */
export function Footer({ sticky = false, ...rest }: FooterProps): ReactElement {
  const sheets = useOverlaid();

  return <Barred {...rest} data-sticky={sticky ? "" : undefined} inert={sheets.length > 0} />;
}
