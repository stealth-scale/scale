/**
 * Renders the band in the middle of the row.
 *
 * @remarks
 *   The band takes the room the other bands leave and centres its content, such as a title or
 *   segmented controls. It truncates a long title, because a toolbar on two lines moves everything
 *   under it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Renders the `div` with the recipe's center class.
 */
export const Center = withContext("div", "center");

/**
 * Describes the props of the centre band: the props of a `div`.
 */
export type CenterProps = ComponentProps<typeof Center>;
