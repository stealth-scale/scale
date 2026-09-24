/**
 * Renders the scrolling region between the header and the footer.
 *
 * @remarks
 *   The content scrolls and the root does not, so the header and the footer remain in place however
 *   long the list of destinations is.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the content `div` at the sidebar's size.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of `Content`.
 */
export type ContentProps = ComponentProps<typeof Content>;
