/**
 * Renders the column of a toast's title and description.
 *
 * @remarks
 *   The element is a `div` with no role. It fills the room the indicator and the triggers leave,
 *   and its `min-inline-size: 0` lets a long unbroken word wrap instead of pushing the triggers out
 *   of the toast.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toast/context.ts";

/**
 * Renders the column of the title and the description.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of Toast.Content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Content>;
