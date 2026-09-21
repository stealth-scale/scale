/**
 * Renders the band holding a card's substance.
 *
 * @remarks
 *   The element is a `div` with no role. The band stacks its children at the body text style, so a
 *   card of running prose needs no `Text` wrapper around each line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the content slot, stacking whatever the card is about.
 */
export const Content = withContext("div", "content");

/**
 * Accepts every prop the styled div takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
