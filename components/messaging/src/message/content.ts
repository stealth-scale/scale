/**
 * Renders the column of a turn: the header, the bubbles and the footer, one under the other.
 *
 * @remarks
 *   The column aligns its children to the start of the line, or to the end in a turn with
 *   `align="end"`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the column's `div`.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of `Content`.
 */
export type ContentProps = ComponentProps<typeof Content>;
