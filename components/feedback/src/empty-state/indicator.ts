/**
 * Renders the mark above the empty state's title.
 *
 * @remarks
 *   The recipe sets the box from the root's size and stretches an `svg` child to fill it, so the
 *   caller passes an icon without a size. The element sets `aria-hidden` by default, because the
 *   title states the same thing in words.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a div in the muted ink, hidden from the accessibility tree by default.
 */
export const Indicator = withContext("div", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of EmptyState.Indicator: the props of a div element.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
