/**
 * Prepares the props of a page or a trigger rendered as a link.
 *
 * @remarks
 *   The machine changes its page in a link's click handler, which runs before the browser reads the
 *   link's address, and each trigger's address follows the page. A part rendered as a link keeps
 *   none of the machine's click handlers, so the browser opens the page the reader pressed, and a
 *   press that opens a new tab leaves the current page alone. The caller passes `page` from the
 *   address.
 */

import { type ButtonProps } from "@stealthscale/component-actions";

/**
 * Describes the props of a part rendered as a link: a button's props with the machine's address.
 */
export type LinkProps = {
  /**
   * Address of the page the link opens, the one `getPageUrl` returns.
   */
  readonly href?: string | undefined;
} & ButtonProps;

/**
 * Returns a part's props as a link, without the machine's click handler.
 *
 * @remarks
 *   A trigger at an end opens no page, so it keeps no address. It takes the link role and a tab
 *   stop, because an `a` without `href` has neither, and the browser moves focus from an element it
 *   cannot focus to the page's body.
 * @param props - The props the machine gives the part.
 * @param end - Whether the part is a trigger with no page to open.
 * @returns The part's props.
 */
export function linked({ href, onClick: _onClick, ...props }: LinkProps, end = false): LinkProps {
  return end ? { ...props, role: "link", tabIndex: 0 } : { ...props, href };
}
