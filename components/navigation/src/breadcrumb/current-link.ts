/**
 * Renders the crumb for the current page.
 *
 * @remarks
 *   The element is a `span`, because a link to the open page does not navigate anywhere. It sets
 *   `aria-current="page"`, which screen readers announce as the current crumb. It is the last crumb
 *   of a trail.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders a span with `aria-current="page"` in the default ink.
 */
export const CurrentLink = withContext("span", "currentLink", {
  defaultProps: { "aria-current": "page" },
});

/**
 * Describes the props of Breadcrumb.CurrentLink: the props of a span element.
 */
export type CurrentLinkProps = ComponentProps<typeof CurrentLink>;
