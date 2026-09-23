/**
 * Renders a band of a card that extends to the card's side edges, with a rule to each band beside
 * it.
 *
 * @remarks
 *   The element is a `div` with no role. Its content keeps the card's inset, so text in a section
 *   is aligned with the header. As the first band it extends to the top edge, and as the last band
 *   to the bottom edge. It renders a hairline on each side it shares with another band, with the
 *   card's gap on both sides of the rule, and two adjacent sections share one rule. Use it for rows
 *   of settings, a summary under the header, or a list that spans the card.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the section slot.
 */
export const Section = withContext("div", "section");

/**
 * Describes the props of `Section`: the props of a `div`.
 */
export type SectionProps = ComponentProps<typeof Section>;
