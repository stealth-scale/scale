/**
 * Renders the list row that replaces the crumbs left out of a long trail.
 *
 * @remarks
 *   A trail with six crumbs wraps onto a second line in a page header. A caller keeps the first
 *   crumb and the current page, and renders this row in place of the crumbs between them. The row
 *   is in the accessibility tree and takes an `aria-label` from the caller, such as
 *   `4 more steps`, so a screen reader announces the full depth of the trail. The caller passes
 *   the glyph as a child, because the package does not include icons.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders a list item in the muted ink.
 */
export const Ellipsis = withContext("li", "ellipsis");

/**
 * Describes the props of Breadcrumb.Ellipsis: the props of a list item element.
 */
export type EllipsisProps = ComponentProps<typeof Ellipsis>;
