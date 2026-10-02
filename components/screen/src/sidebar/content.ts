/**
 * Renders the scrolling region between the header and the footer.
 *
 * @remarks
 *   The region is the primitives package's scroll area, so its bars are the theme's. The content
 *   scrolls and the root does not, so the header and the footer remain in place however long the
 *   list of destinations is. The viewport is outside the tab order, because the content is rows of
 *   links, and a link that takes focus scrolls into view.
 */

import { createElement, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the scroll area's root, which fills the column between the header and the footer.
 */
const Scroller = withContext(ScrollArea.Root, "scroller");

/**
 * Renders the scroll area's content at the sidebar's size, which spaces and pads the blocks.
 */
const Blocks = withContext(ScrollArea.Content, "content");

/**
 * Describes the props of `Content`: the props of the scroll area's content, without `as`, because
 * another element in its place would drop the content's part.
 */
export type ContentProps = Omit<ScrollArea.ContentProps, "as">;

/**
 * Renders the blocks inside a scroll area with a vertical bar.
 *
 * @param props - The props of the scroll area's content, the blocks among its children.
 * @returns The scroll area's root.
 */
export function Content(props: ContentProps): ReactElement {
  return createElement(
    Scroller,
    null,
    createElement(ScrollArea.Viewport, { focusable: false }, createElement(Blocks, props)),
    createElement(ScrollArea.Scrollbar),
  );
}
