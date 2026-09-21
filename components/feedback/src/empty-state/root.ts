/**
 * Renders the panel the remaining slots sit inside.
 *
 * @remarks
 *   The element is a `div` with no ARIA role. The meaning of an empty state is in its title and
 *   description, and giving each one a landmark role would turn a dashboard of empty panels into a
 *   list of landmarks a screen reader user has to step past. A surface that does want the panel
 *   announced sets its own role.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#empty-state/context.ts";

/**
 * Renders the panel and publishes the size the slots below it resolve against.
 */
export const Root = withProvider("div", "root");

/**
 * The size variant and the props of a styled `div`.
 */
export type RootProps = ComponentProps<typeof Root>;
