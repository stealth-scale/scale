/**
 * Renders the padded block inside an item's content.
 *
 * @remarks
 *   The element is a `div`. The body has the padding and the text style, so the content around it
 *   animates down to zero height with no padding left over.
 */

import { type ComponentProps } from "react";

import { withContext } from "#accordion/context.ts";

/**
 * Renders the `div` with the accordion's item body class.
 */
export const ItemBody = withContext("div", "itemBody");

/**
 * Describes the props of the item body: the props of a `div`.
 */
export type ItemBodyProps = ComponentProps<typeof ItemBody>;
