/**
 * Renders a graph's empty state: a message in the canvas's place, at the canvas's ratio.
 *
 * @remarks
 *   A preset renders it in place of `Graph.Canvas` while it has no node to show, so the figure
 *   keeps its height and the caption keeps its place. The box has a dashed edge and centres its
 *   children in the muted ink.
 */

import { type ComponentProps } from "react";

import { withContext } from "#graph/context.ts";

/**
 * Renders the `div` with the recipe's empty class.
 */
export const Empty = withContext("div", "empty");

/**
 * Describes the props of the empty state: the props of a `div`.
 */
export type EmptyProps = ComponentProps<typeof Empty>;
