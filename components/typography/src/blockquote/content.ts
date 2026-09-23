/**
 * Renders the text of a block quotation.
 *
 * @remarks
 *   The element is `blockquote`. The root's `size` sets its body text style.
 */

import { type ComponentProps } from "react";

import { withContext } from "#blockquote/context.ts";

/**
 * Renders a `blockquote` element with the content slot's classes.
 */
export const Content = withContext("blockquote", "content");

/**
 * Describes the props of Blockquote.Content: the props of a `blockquote` element.
 */
export type ContentProps = ComponentProps<typeof Content>;
