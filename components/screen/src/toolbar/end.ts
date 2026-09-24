/**
 * Renders the band at the end of the row.
 *
 * @remarks
 *   The band is pushed to the row's end, so the controls a reader uses last are in the same place
 *   in every row.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";

/**
 * Renders the `div` with the recipe's end class.
 */
export const End = withContext("div", "end");

/**
 * Describes the props of the end band: the props of a `div`.
 */
export type EndProps = ComponentProps<typeof End>;
