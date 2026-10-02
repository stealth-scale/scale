/**
 * Renders one item of a list.
 *
 * @remarks
 *   The element is `li`. The root's variants set its marker, its alignment and its motion.
 */

import { type ComponentProps } from "react";

import { withContext } from "#list/context.ts";

/**
 * Renders an `li` element with the item slot's classes.
 */
export const Item = withContext("li", "item");

/**
 * Describes the props of List.Item: the props of an `li` element.
 */
export type ItemProps = ComponentProps<typeof Item>;
