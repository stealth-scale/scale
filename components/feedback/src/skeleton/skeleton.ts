/**
 * Renders a skeleton through its recipe.
 *
 * @remarks
 *   The element is a `div` with no role, so screen readers skip the placeholder. Set `aria-busy`
 *   on the region that is loading, so a screen reader announces the state once for the region.
 */

import { type ComponentProps } from "react";

import { withContext } from "#skeleton/context.ts";

/**
 * Renders a div that takes the box of the content it wraps.
 */
export const Skeleton = withContext("div");

/**
 * Describes the props of Skeleton: the recipe's variants and the props of a div element.
 */
export type SkeletonProps = ComponentProps<typeof Skeleton>;
