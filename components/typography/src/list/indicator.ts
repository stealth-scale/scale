/**
 * Renders the mark of a list item in the `plain` look.
 *
 * @remarks
 *   The element is `span`, and the caller passes the mark as children, such as a lucide icon. The
 *   indicator is hidden from assistive technology, as the browser's marker is. A mark that carries
 *   meaning, such as a done or failed state, needs that meaning in the item's text.
 */

import { type ComponentProps } from "react";

import { withContext } from "#list/context.ts";

/**
 * Renders a `span` element with the indicator slot's classes, hidden from assistive technology.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of List.Indicator: the props of a `span` element.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
