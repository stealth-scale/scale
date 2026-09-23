/**
 * Renders the panel of the empty state.
 *
 * @remarks
 *   The element is a `div` with no role. A dashboard of empty panels with a landmark each would
 *   list every panel in a screen reader's landmark menu. A surface that needs the panel announced
 *   sets its own role.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#empty-state/context.ts";

/**
 * Renders a div and provides the size to the parts inside it.
 */
export const Root = withProvider("div", "root");

/**
 * Describes the props of EmptyState.Root: the recipe's size and the props of a div element.
 */
export type RootProps = ComponentProps<typeof Root>;
