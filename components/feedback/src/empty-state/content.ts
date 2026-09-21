/**
 * Renders the centred column holding an empty state's icon and copy.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Stacks and centres its children, spaced by the gap the root's size resolves to.
 */
export const Content = withContext("div", "content");

/**
 * The props of a styled `div`.
 */
export type ContentProps = ComponentProps<typeof Content>;
