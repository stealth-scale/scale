/**
 * Renders the centred column of the empty state's mark, title and description.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a centred flex column with the gap of the root's size.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of EmptyState.Content: the props of a div element.
 */
export type ContentProps = ComponentProps<typeof Content>;
