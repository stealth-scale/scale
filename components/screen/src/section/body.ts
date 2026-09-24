/**
 * Renders the section's content.
 *
 * @remarks
 *   The element is `div`. With `data-bleed`, a body in a card drops its padding and runs to the
 *   card's edges, with a hairline above it. The card clips its content, so the body keeps the
 *   card's corners.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `div` with the recipe's body class.
 */
export const Body = withContext("div", "body");

/**
 * Describes the props of the body: the props of a `div`.
 */
export type BodyProps = ComponentProps<typeof Body>;
