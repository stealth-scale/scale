/**
 * Draws the box the code scrolls in.
 *
 * @remarks
 *   The element is `pre`, so the browser keeps every space and line break and a screen reader
 *   reads the passage as preformatted text. A line longer than the panel scrolls across inside
 *   the box rather than wrapping, because a wrapped line of code reads as two.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Draws the box at the size the root states.
 */
export const Content = withContext("pre", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
