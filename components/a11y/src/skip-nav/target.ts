/**
 * Renders the element that receives focus when the skip link is followed.
 *
 * @remarks
 *   The element is a `div` with `tabIndex` -1. A browser moves focus to a fragment target only when
 *   the target is focusable, and -1 makes it focusable without adding a Tab stop. Set `as="main"`
 *   when the target is the page's main region.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";
import { SKIP_NAV_TARGET } from "#skip-nav/link.ts";

/**
 * Renders a `div` element with the target slot's classes, `id="content"` and `tabIndex` -1 by
 * default.
 */
export const Target = withProvider("div", "target", {
  defaultProps: { id: SKIP_NAV_TARGET, tabIndex: -1 },
});

/**
 * Describes the props of SkipNav.Target: the props of a `div` element.
 */
export type TargetProps = ComponentProps<typeof Target>;
