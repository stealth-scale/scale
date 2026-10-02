/**
 * Renders a paragraph through the text recipe.
 *
 * @remarks
 *   The component sets no style of its own. `as` changes the element, for example to a `span` for
 *   text inside a line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#text/context.ts";

/**
 * Renders a `p` element with the classes of the text recipe.
 */
export const Text = withContext("p");

/**
 * Describes the props of Text: the recipe's variants and the props of a `p` element.
 */
export type TextProps = ComponentProps<typeof Text>;
