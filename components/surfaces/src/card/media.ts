/**
 * Renders the band holding a card's image.
 *
 * @remarks
 *   The element is a `div` wrapping the caller's image, video or map. The band cancels the padding
 *   the root applies, so the image reaches the card's edges, and the root clips the corners rather
 *   than this band restating them. Which edges it reaches follows the orientation: the top and both
 *   sides of a card running down the page, and the leading side of one running across it. The band
 *   carries no accessible name of its own. The alternative text belongs on the image inside it,
 *   where a screen reader reads it, and a decorative image passes `alt=""`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the media slot, bleeding its content to the card's edges.
 */
export const Media = withContext("div", "media");

/**
 * Accepts every prop the styled div takes.
 */
export type MediaProps = ComponentProps<typeof Media>;
