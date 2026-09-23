/**
 * Renders a container through the container recipe.
 *
 * @remarks
 *   The element is `div`, which has no semantics. A container that wraps a page's main content
 *   sets `as="main"`, so a screen reader can jump to it. The component renders no surface, ink or
 *   border.
 */

import { type ComponentProps } from "react";

import { withContext } from "#container/context.ts";

/**
 * Renders a `div` element with the classes of the container recipe.
 */
export const Container = withContext("div");

/**
 * Describes the props of Container: the recipe's variants and the props of a `div` element.
 */
export type ContainerProps = ComponentProps<typeof Container>;
