/**
 * Renders the scrolling region that contains the code.
 *
 * @remarks
 *   The element is a `pre`, so the browser preserves spaces and line breaks and assistive
 *   technology announces preformatted text. A line wider than the panel scrolls horizontally and
 *   does not wrap. The region has `tabIndex={0}`, so a keyboard user can focus it and scroll it
 *   with the arrow keys.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Renders the content slot as a focusable `pre`.
 */
export const Content = withContext("pre", "content", { defaultProps: { tabIndex: 0 } });

/**
 * Describes the props of `Content`: the props of the styled `pre` element.
 */
export type ContentProps = ComponentProps<typeof Content>;
