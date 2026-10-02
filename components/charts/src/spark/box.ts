/**
 * Renders the bound box a sparkline and a sparkbar render their run in.
 *
 * @remarks
 *   The box is a `div`, because recharts renders `div` wrappers inside it, so a spark goes in a
 *   table cell or a row of a layout and not inside a paragraph.
 */

import { withContext } from "#spark/context.ts";

/**
 * Renders the spark's `div` with the recipe's variants.
 */
export const Box = withContext("div");
