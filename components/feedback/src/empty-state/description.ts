/**
 * Renders the sentence explaining why an empty state is empty, or what to do next.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a paragraph in the muted foreground, at a fixed type step the root's size does not move.
 */
export const Description = withContext("p", "description");

/**
 * The props of a styled `p`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
