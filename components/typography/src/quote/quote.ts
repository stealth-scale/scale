/**
 * Renders an inline quotation through the quote recipe.
 *
 * @remarks
 *   The element is `q`, a quotation inside a line. A quotation set as its own block is
 *   `Blockquote.Root`. `cite` takes the address of the source.
 */

import { type ComponentProps } from "react";

import { withContext } from "#quote/context.ts";

/**
 * Renders a `q` element with the classes of the quote recipe.
 */
export const Quote = withContext("q");

/**
 * Describes the props of Quote: the recipe's variants and the props of a `q` element.
 */
export type QuoteProps = ComponentProps<typeof Quote>;
