/**
 * Renders a skeleton bound to its recipe.
 *
 * @remarks
 *   The element is a `div` with no ARIA role. A placeholder is not something a screen reader
 *   should announce, and a user told once that a region is busy learns more than one told the same
 *   thing by every bar inside it. Set `aria-busy` on the region that is waiting instead.
 */

import { type ComponentProps } from "react";

import { withContext } from "#skeleton/context.ts";

/**
 * Renders a placeholder that takes the box of the content it wraps.
 */
export const Skeleton = withContext("div");

/**
 * The recipe variants and the props of a styled `div`.
 */
export type SkeletonProps = ComponentProps<typeof Skeleton>;
