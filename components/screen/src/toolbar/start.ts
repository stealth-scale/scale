/**
 * Renders the band at the start of the row.
 *
 * @remarks
 *   The band has the controls that act on all of the content under the toolbar, such as a back
 *   control, a filter or a set of views. It takes the width of its controls, so the centre gets the
 *   rest.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Renders the `div` with the recipe's start class.
 */
export const Start = withContext("div", "start");

/**
 * Describes the props of the start band: the props of a `div`.
 */
export type StartProps = ComponentProps<typeof Start>;
