/**
 * Renders the band that contains a card's picture.
 *
 * @remarks
 *   The element is a `div` around an image, a video or a map, and it has no accessible name. Put
 *   the alternative text on the image, or `alt=""` on a decorative one. In a vertical card the band
 *   extends to both side edges, to the top edge as the first band and to the bottom edge as the
 *   last. In a
 *   horizontal card it covers the leading third at full height. It positions `Overlay`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the media slot.
 */
export const Media = withContext("div", "media");

/**
 * Describes the props of `Media`: the props of a `div`.
 */
export type MediaProps = ComponentProps<typeof Media>;
