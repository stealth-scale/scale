/**
 * Renders the leading icon of the alert.
 *
 * @remarks
 *   The recipe sets the box from the root's size and stretches an `svg` child to fill it, so the
 *   caller passes an icon without a size. The element inherits the root's ink and sets
 *   `aria-hidden` by default, because the title states the severity in words.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders a div on the icon scale, hidden from the accessibility tree by default.
 */
export const Indicator = withContext("div", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of Alert.Indicator: the props of a div element.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
