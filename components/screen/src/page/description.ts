/**
 * Renders the text that explains the page.
 *
 * @remarks
 *   The element is `p`. The line stops at the reading measure, which the theme sets in characters.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `p` with the recipe's description class.
 */
export const Description = withContext("p", "description");

/**
 * Describes the props of the description: the props of a `p`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
