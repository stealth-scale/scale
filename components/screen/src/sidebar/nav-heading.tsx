/**
 * Renders a heading over one list inside a nav block.
 *
 * @remarks
 *   `NavLabel` names the block and its landmark. A block contains one label and a heading per
 *   list, so a heading takes its `id` from the caller, and the caller passes the same identifier to
 *   the list's `aria-labelledby`. A collapsed sidebar hides the heading visually and keeps it for
 *   screen readers.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the heading `h2` at the sidebar's size.
 */
const Headed = withContext("h2", "navHeading");

/**
 * Describes the props of `NavHeading`, `id` among them.
 */
export type NavHeadingProps = ComponentProps<typeof Headed>;

/**
 * Renders a heading over one list of destinations.
 *
 * @param props - The `h2` element's props, `id` among them.
 * @returns The `h2` element with the caller's `id`, at the sidebar's size.
 */
export function NavHeading(props: NavHeadingProps): ReactElement {
  return <Headed {...props} />;
}
