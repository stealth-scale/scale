/**
 * Renders the words of an entry on one side of the rail.
 *
 * @remarks
 *   Content written before the connector fills the column before the rail and aligns to the rail,
 *   and content written after it fills the column after the rail.
 */

import { type ComponentProps } from "react";

import { withContext } from "#timeline/context.ts";

/**
 * Renders the content `div`, a column of a title and a description.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of `Content`.
 */
export type ContentProps = ComponentProps<typeof Content>;
