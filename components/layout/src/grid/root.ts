/**
 * Renders the root of a grid.
 *
 * @remarks
 *   The element is `div`, which has no semantics. A grid of list items sets `as="ul"`, so a screen
 *   reader counts them. The root takes the variants and provides them to the items.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#grid/context.ts";

/**
 * Renders a `div` element with the root slot's classes and provides the variants to the items.
 */
export const Root = withProvider("div", "root");

/**
 * Describes the props of Grid.Root: the recipe's variants and the props of a `div` element.
 */
export type RootProps = ComponentProps<typeof Root>;
