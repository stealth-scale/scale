/**
 * Renders the leading icon of an alert.
 *
 * @remarks
 *   The element is a `div` that sizes an `Icon` child from the root's `size` variant and declares
 *   no colour of its own, so it inherits the foreground the contrast gate measured against the
 *   root's fill. It is hidden from assistive technology by default: the icon duplicates what the
 *   title already carries in words, and naming a glyph ahead of the alert text is noise. Hiding it
 *   is only safe because the title states the severity, since an alert that conveyed severity
 *   through the icon and the palette alone would fail WCAG 1.4.1.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the icon container of an alert, hidden from assistive technology by default.
 */
export const Indicator = withContext("div", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * The props of a styled `div`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
