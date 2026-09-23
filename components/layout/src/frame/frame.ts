/**
 * Renders a frame through the frame recipe.
 *
 * @remarks
 *   The element is `div`, which has no semantics. A frame that is a figure sets `as="figure"`. The
 *   frame has no accessible name of its own, so the child picture carries the alternative text.
 */

import { type ComponentProps } from "react";

import { withContext } from "#frame/context.ts";

/**
 * Renders a `div` element with the classes of the frame recipe.
 */
export const Frame = withContext("div");

/**
 * Describes the props of Frame: the recipe's variants and the props of a `div` element.
 */
export type FrameProps = ComponentProps<typeof Frame>;
