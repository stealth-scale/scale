/**
 * Renders a placeholder paragraph with one bar per line of text that is still loading.
 *
 * @remarks
 *   The bars are `Skeleton` elements, so they take the theme's placeholder fill and motion, and a
 *   caller sets `motion` and `radius` once on the paragraph. The column has its own recipe for the
 *   layout. The component has no `loading` prop: a caller renders it while the text loads and the
 *   text once it has arrived.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#skeleton-text/context.ts";
import { Skeleton, type SkeletonProps } from "#skeleton/skeleton.ts";

/**
 * Div with the skeleton text classes.
 */
const Column = withContext("div");

/**
 * Describes the props of SkeletonText: the line count, the bar variants and the props of a div.
 */
export interface SkeletonTextProps extends ComponentProps<typeof Column> {
  /**
   * Number of bars. Defaults to 3, and a value below 1 renders one bar.
   */
  readonly lines?: number | undefined;

  /**
   * Animation of every bar. The skeleton recipe's default applies when absent.
   */
  readonly motion?: SkeletonProps["motion"] | undefined;

  /**
   * Corner radius of every bar. The skeleton recipe's default applies when absent.
   */
  readonly radius?: SkeletonProps["radius"] | undefined;
}

/**
 * Renders a column of `Skeleton` bars, one per line.
 *
 * @remarks
 *   `motion` and `radius` are left out of the bar props when undefined, because an explicit
 *   `undefined` overrides the value an enclosing `SkeletonPropsProvider` sets.
 */
export function SkeletonText({
  lines = 3,
  motion,
  radius,
  ...rest
}: SkeletonTextProps): ReactElement {
  const drawn = {
    ...(motion === undefined ? {} : { motion }),
    ...(radius === undefined ? {} : { radius }),
  };

  return (
    <Column {...rest}>
      {Array.from({ length: Math.max(lines, 1) }, (_, at) => (
        // eslint-disable-next-line react/no-array-index-key -- the bars are identical and positional
        <Skeleton key={at} {...drawn} />
      ))}
    </Column>
  );
}
