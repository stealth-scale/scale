/**
 * Renders the row beside the title, such as a status, a count or the date the item was created.
 *
 * @remarks
 *   The row shares the title's line on a wide page and moves onto its own row under the title on
 *   a folded page, so the title's text wraps before the meta stacks.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's meta class.
 */
export const Meta = withContext("div", "meta");

/**
 * Describes the props of the meta row: the props of a `div`.
 */
export type MetaProps = ComponentProps<typeof Meta>;
