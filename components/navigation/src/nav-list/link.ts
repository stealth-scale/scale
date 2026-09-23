/**
 * Renders a row's link.
 *
 * @remarks
 *   The element is `a` and takes `href`. Set `aria-current="page"` on the link to the current page.
 *   A screen reader announces the attribute and the `highlight` axis styles it, so the two cannot
 *   disagree. In the iconic list the text is hidden visually and stays the link's accessible name.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the link `a` with the list's variants.
 */
export const Link = withContext("a", "link");

/**
 * Describes the props of `Link`.
 */
export type LinkProps = ComponentProps<typeof Link>;
