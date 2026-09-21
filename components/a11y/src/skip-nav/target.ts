/**
 * Renders the landing point the skip link jumps to.
 *
 * @remarks
 *   The element is a `div` carrying `tabIndex` -1, because a browser only moves focus to a
 *   fragment target that is focusable, and -1 makes it focusable without adding a stop to the tab
 *   order. A page whose content is its main region passes `as="main"`.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";
import { SKIP_NAV_TARGET } from "#skip-nav/link.ts";

/**
 * Receives the focus the skip link sends and renders no appearance of its own.
 */
export const Target = withProvider("div", "target", {
  defaultProps: { id: SKIP_NAV_TARGET, tabIndex: -1 },
});

/**
 * Props accepted by `Target`, which are the props of a styled `div`.
 */
export type TargetProps = ComponentProps<typeof Target>;
