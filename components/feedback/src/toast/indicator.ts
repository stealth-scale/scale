/**
 * Renders the mark at the start of a toast.
 *
 * @remarks
 *   The caller passes the glyph, such as a lucide icon or a `Spinner` for a loading toast. The
 *   recipe sizes an `svg` child on the icon scale, centres it on the first line of the title and
 *   inks it in the solid of the toast type's palette. The element sets `aria-hidden` by default,
 *   because the title states what happened in words.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toast/context.ts";

/**
 * Renders a `span` hidden from the accessibility tree by default.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes the props of Toast.Indicator: the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
