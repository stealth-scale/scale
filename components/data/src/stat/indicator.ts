/**
 * Renders the mark that shows which way the figure moved, in the stat's palette.
 *
 * @remarks
 *   The caller passes the glyph and chooses the palette, because the direction of a change and
 *   whether it is good are separate facts. Hide the glyph with `aria-hidden` and write the
 *   direction in the help text with a sign, such as `+12%`, which a screen reader announces.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stat/context.ts";

/**
 * Renders the indicator `span`.
 */
export const Indicator = withContext("span", "indicator");

/**
 * Describes the props of `Indicator`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
