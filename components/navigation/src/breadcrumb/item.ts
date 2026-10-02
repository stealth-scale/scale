/**
 * Renders one crumb of the trail.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Renders a list item that holds a `Breadcrumb.Link` or the `Breadcrumb.CurrentLink`.
 */
export const Item = withContext("li", "item");

/**
 * Describes the props of Breadcrumb.Item: the props of a list item element.
 */
export type ItemProps = ComponentProps<typeof Item>;
