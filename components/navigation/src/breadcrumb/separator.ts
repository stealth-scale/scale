/**
 * Renders the separator between two crumbs.
 *
 * @remarks
 *   The separator is a list row between two items, so a screen reader counts only the crumbs. It
 *   sets `aria-hidden` and `role="presentation"`, because the list already conveys the order. The
 *   recipe rotates it by 180 degrees in a right-to-left document, so a chevron points towards the
 *   current page.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders a list item hidden from the accessibility tree.
 */
export const Separator = withContext("li", "separator", {
  defaultProps: { "aria-hidden": true, role: "presentation" },
});

/**
 * Describes the props of Breadcrumb.Separator: the props of a list item element.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
