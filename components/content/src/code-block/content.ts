/**
 * Renders the scrolling region the code sits in.
 *
 * @remarks
 *   The element is a `pre`, so the browser preserves every space and line break and assistive
 *   technology announces the block as preformatted text. A line wider than the panel scrolls
 *   horizontally rather than wrapping, because a wrapped line of code reads as two lines.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Preserves the whitespace of the code and scrolls it sideways when it overflows.
 */
export const Content = withContext("pre", "content");

/**
 * Props accepted by `Content`, which are the props of a styled `pre` element.
 */
export type ContentProps = ComponentProps<typeof Content>;
