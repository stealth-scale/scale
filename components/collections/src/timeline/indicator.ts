/**
 * Renders the mark of an entry on the rail: a number, an icon, or an empty circle.
 *
 * @remarks
 *   The indicator is hidden from screen readers, because the list's order already numbers the
 *   entries and an icon repeats what the title states in words.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the indicator `span`, hidden from screen readers.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
