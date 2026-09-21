/**
 * Renders the anchor a keyboard user follows to bypass the navigation.
 *
 * @remarks
 *   The element is an `a` with a fragment href, because following a link is how a browser moves
 *   focus and how assistive technology announces the control. Place it first in the document so it
 *   is the first thing Tab reaches, and give it label text naming the destination rather than the
 *   bare word skip.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";

/**
 * The fragment identifier the link and the target default to, so the pair works with no props.
 */
export const SKIP_NAV_TARGET = "content";

/**
 * Sends focus past the navigation to the target when followed.
 */
export const Link = withProvider("a", "link", {
  defaultProps: { href: `#${SKIP_NAV_TARGET}` },
});

/**
 * Props accepted by `Link`, which are the props of a styled anchor.
 */
export type LinkProps = ComponentProps<typeof Link>;
