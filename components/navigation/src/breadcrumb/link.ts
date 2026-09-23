/**
 * Renders the link of a crumb above the current page.
 *
 * @remarks
 *   The element is `a` and takes an `href`. The crumb for the current page has no destination, so
 *   `Breadcrumb.CurrentLink` renders it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders an anchor in the muted ink that darkens on hover.
 */
export const Link = withContext("a", "link");

/**
 * Describes the props of Breadcrumb.Link: the props of an anchor element.
 */
export type LinkProps = ComponentProps<typeof Link>;
