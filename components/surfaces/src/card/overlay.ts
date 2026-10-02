/**
 * Renders a layer over a card's picture for a badge or a caption.
 *
 * @remarks
 *   The element is a `div` positioned over `Media`, so place it inside `Media` after the image. It
 *   lays its children in a column at the bottom, in white, over a scrim of 64% black across the
 *   lower half. The layer passes the pointer through to the picture and its children take it back.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the overlay slot.
 */
export const Overlay = withContext("div", "overlay");

/**
 * Describes the props of `Overlay`: the props of a `div`.
 */
export type OverlayProps = ComponentProps<typeof Overlay>;
