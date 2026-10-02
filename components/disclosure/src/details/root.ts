/**
 * Renders the `details` element that the browser opens and closes.
 *
 * @remarks
 *   The element takes the native props: `open` sets the state on the first render and whenever it
 *   changes, `onToggle` reports every change, and `name` makes the details with the same name an
 *   exclusive group, in which opening one closes the others. The browser also opens a closed
 *   details to show a fragment the address points into.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#details/context.ts";

/**
 * Renders the `details` with the recipe's variants.
 */
export const Root = withProvider("details", "root");

/**
 * Describes the props of the root: the props of a `details` and the recipe's variants.
 */
export type RootProps = ComponentProps<typeof Root>;
