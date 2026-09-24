/**
 * Renders the mark before the title, such as an avatar, a logo or an icon for the kind of item.
 *
 * @remarks
 *   The mark keeps its place at every width, because it and the title read as one line. Give it an
 *   accessible name when it adds information, and hide it when it repeats the title.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's leading class.
 */
export const Leading = withContext("div", "leading");

/**
 * Describes the props of the leading mark: the props of a `div`.
 */
export type LeadingProps = ComponentProps<typeof Leading>;
