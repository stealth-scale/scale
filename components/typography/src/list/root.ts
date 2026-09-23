/**
 * Renders the root of a list.
 *
 * @remarks
 *   The element is `ul`, and `as="ol"` renders a numbered list. The root sets `role="list"`,
 *   because Safari removes the list semantics from an element whose markers are removed, which the
 *   `plain` look does. The root takes the variants and passes them to the items.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#list/context.ts";

/**
 * Renders a `ul` element in the `list` role with the root slot's classes, and provides the
 * variants to the items.
 */
export const Root = withProvider("ul", "root", { defaultProps: { role: "list" } });

/**
 * Describes the props of List.Root: the recipe's variants and the props of a `ul` element.
 */
export type RootProps = ComponentProps<typeof Root>;
