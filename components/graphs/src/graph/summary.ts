/**
 * Renders a graph's summary: a row below the canvas for what the canvas's selection means, and the
 * controls that change it.
 *
 * @remarks
 *   A preset renders the selection's words in an `output`, which a screen reader reads when they
 *   change, beside a control that clears the selection. The row wraps at a narrow width.
 */

import { type ComponentProps } from "react";

import { withContext } from "#graph/context.ts";

/**
 * Renders the `div` with the recipe's summary class.
 */
export const Summary = withContext("div", "summary");

/**
 * Describes the props of the summary: the props of a `div`.
 */
export type SummaryProps = ComponentProps<typeof Summary>;
