/**
 * Renders a placeholder paragraph, one bar per line of text still in flight.
 *
 * @remarks
 *   The bars are `Skeleton` elements, so whatever animation the theme gives a placeholder these
 *   inherit, and a caller sets it once on the paragraph rather than once per bar. The column is
 *   bound to a separate recipe that owns the layout and derives every length from the line box of
 *   the text it replaces. There is deliberately no `loading` prop: a caller renders this while the
 *   text is loading and the text itself once it is not, and a placeholder that also decides
 *   whether to be a placeholder is two components in one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#skeleton-text/context.ts";
import { Skeleton, type SkeletonProps } from "#skeleton/skeleton.ts";

/**
 * Renders the column the bars are stacked in.
 */
const Column = withContext("div");

/**
 * The line count, the bar styling passed through to each `Skeleton`, and the props of the column.
 */
export interface SkeletonTextProps extends ComponentProps<typeof Column> {
  /**
   * The number of lines to stand in for. Defaults to three, and is clamped to a minimum of one.
   */
  readonly lines?: number | undefined;

  /**
   * The animation applied to every bar. Left to the skeleton recipe's default when absent.
   */
  readonly motion?: SkeletonProps["motion"] | undefined;

  /**
   * The corner radius applied to every bar. Left to the skeleton recipe's default when absent.
   */
  readonly radius?: SkeletonProps["radius"] | undefined;
}

/**
 * Renders a column holding one skeleton bar per line.
 *
 * @remarks
 *   `motion` and `radius` are omitted from the spread when the caller leaves them undefined,
 *   rather than passed through as `undefined`. An explicit `undefined` would override the value an
 *   enclosing `SkeletonPropsProvider` supplies.
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
        // The bars are positional and identical, so there is nothing else to name them by.
        // eslint-disable-next-line react/no-array-index-key -- as above
        <Skeleton key={at} {...drawn} />
      ))}
    </Column>
  );
}
