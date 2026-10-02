/**
 * Renders a heading through the heading recipe.
 *
 * @remarks
 *   The element is `h2`, and `as` sets another level. The component sets no style of its own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#heading/context.ts";

/**
 * Renders an `h2` element with the classes of the heading recipe.
 */
export const Heading = withContext("h2");

/**
 * Describes the props of Heading: the recipe's variants and the props of an `h2` element.
 */
export type HeadingProps = ComponentProps<typeof Heading>;
