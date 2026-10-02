/**
 * Renders the skip link that moves keyboard focus past a repeated block of content.
 *
 * @remarks
 *   The element is an `a` with a fragment `href`, because following a link moves focus to the
 *   fragment's target and a screen reader announces a link. Place it first in the document, so the
 *   first Tab reaches it, and label it with the destination, such as "Skip to invoices".
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";

/**
 * Fragment identifier that the link's `href` and the target's `id` default to.
 */
export const SKIP_NAV_TARGET = "content";

/**
 * Renders an `a` element with the link slot's classes, pointing at `#content` by default.
 */
export const Link = withProvider("a", "link", {
  defaultProps: { href: `#${SKIP_NAV_TARGET}` },
});

/**
 * Describes the props of SkipNav.Link: the props of an `a` element.
 */
export type LinkProps = ComponentProps<typeof Link>;
