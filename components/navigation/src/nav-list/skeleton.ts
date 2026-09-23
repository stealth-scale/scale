/**
 * Renders a placeholder row while the list loads.
 *
 * @remarks
 *   The element is `li`, so the placeholders occupy the rows they stand in for. It renders no
 *   placeholder shape itself: put the feedback package's `Skeleton` inside it, and this part sets
 *   the row's size. Set `aria-busy` on the list, so a screen reader announces a loading list
 *   instead of reading a set of empty items.
 */

import { type ComponentProps } from "react";

import { withContext } from "#nav-list/context.ts";

/**
 * Renders the placeholder row `li` with the list's variants.
 */
export const Skeleton = withContext("li", "skeleton");

/**
 * Describes the props of `Skeleton`.
 */
export type SkeletonProps = ComponentProps<typeof Skeleton>;
