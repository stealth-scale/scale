/**
 * Renders the count at the end of a row.
 *
 * @remarks
 *   The element is `span` with `pointer-events: none`, so a press on the count reaches the row
 *   below it. In the iconic list the count is hidden visually and stays in the accessibility tree.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the count `span` with the list's variants.
 */
export const Badge = withContext("span", "badge");

/**
 * Describes the props of `Badge`.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
