/**
 * Renders the supporting line beneath a card's title.
 *
 * @remarks
 *   The element is a `p` set in the muted ink at the small body style. The contrast gate holds
 *   that ink to the body text ratio, so the line recedes from the title without falling below
 *   what a reader can make out.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the description slot under the title.
 */
export const Description = withContext("p", "description");

/**
 * Accepts every prop the styled p takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
