/**
 * Renders the ordered list of crumbs.
 *
 * @remarks
 *   The element is `ol`, because the order of the crumbs is the hierarchy. It sets `role="list"`,
 *   because Safari drops the list role from a list with `list-style: none`, and VoiceOver then
 *   announces neither the crumb count nor the position.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders an ordered list with `role="list"` and the gap of the size axis.
 */
export const List = withContext("ol", "list", { defaultProps: { role: "list" } });

/**
 * Describes the props of Breadcrumb.List: the props of an ordered list element.
 */
export type ListProps = ComponentProps<typeof List>;
