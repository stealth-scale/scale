/**
 * Renders the icon above an empty state's copy.
 *
 * @remarks
 *   The box comes from the icon scale at the root's size and any `svg` inside is stretched to fill
 *   it, so a caller passes a glyph without sizing it. The icon is decorative, since the title
 *   below it says the same thing in words, and the caller is expected to set `aria-hidden` on it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Centres a glyph in a box sized from the root's size, in the muted foreground.
 */
export const Indicator = withContext("div", "indicator");

/**
 * The props of a styled `div`.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
