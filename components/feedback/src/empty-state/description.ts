/**
 * Renders the sentence that says why the surface is empty or what to do next.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a paragraph in the muted ink at `body.sm`, at every size of the root.
 */
export const Description = withContext("p", "description");

/**
 * Describes the props of EmptyState.Description: the props of a paragraph element.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
