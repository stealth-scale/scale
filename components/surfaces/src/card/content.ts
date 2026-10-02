/**
 * Renders the band that contains a card's body.
 *
 * @remarks
 *   The element is a `div` with no role. It stacks its children in a column with the small gap and
 *   takes the height the other bands leave.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the content slot.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of `Content`: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Content>;
