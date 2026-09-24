/**
 * Renders the row above the title that shows where the page is, such as a breadcrumb trail.
 *
 * @remarks
 *   The row reads the body role one size smaller than the page, so a reader takes the title first.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's context class.
 */
export const Context = withContext("div", "context");

/**
 * Describes the props of the context row: the props of a `div`.
 */
export type ContextProps = ComponentProps<typeof Context>;
