/**
 * Renders the page's content.
 *
 * @remarks
 *   The body takes the height the other bands leave and lays its children out in a column, so a
 *   table or a list can fill the page.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's body class.
 */
export const Body = withContext("div", "body");

/**
 * Describes the props of the body: the props of a `div`.
 */
export type BodyProps = ComponentProps<typeof Body>;
