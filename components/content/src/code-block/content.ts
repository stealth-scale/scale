/**
 * Renders the scrolling region the code sits in.
 *
 * @remarks
 *   The element is a `pre`, so the browser preserves every space and line break and assistive
 *   technology announces the block as preformatted text. A line wider than the panel scrolls
 *   horizontally rather than wrapping, because a wrapped line of code reads as two lines.
 *   It takes a tab stop, because a region that scrolls and cannot be reached from the keyboard is
 *   a region a keyboard reader cannot read the far end of. A pointer has the scrollbar and a
 *   touch has the swipe; the arrows are the third way in, and they need focus to land here first.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Preserves the whitespace of the code, scrolls it sideways when it overflows, and takes a tab
 * stop so the arrows can do the scrolling.
 */
export const Content = withContext("pre", "content", { defaultProps: { tabIndex: 0 } });

/**
 * Props accepted by `Content`, which are the props of a styled `pre` element.
 */
export type ContentProps = ComponentProps<typeof Content>;
