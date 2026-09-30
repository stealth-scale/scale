/**
 * Renders the column of an attachment's words: the title over the description.
 */

import { type ComponentProps } from "react";

import { withContext } from "#attachment/context.ts";

/**
 * Renders the column's `div`.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of `Content`.
 */
export type ContentProps = ComponentProps<typeof Content>;
