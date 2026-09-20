/**
 * Draws the mark that slides down the list to the rows naming the headings on screen.
 *
 * @remarks
 *   The machine measures those rows and writes their place as custom properties on the root, so
 *   the recipe states the mark's thickness and its colour and never its position. It is hidden
 *   until there is something to measure, and it states `aria-hidden`, because the list owns its
 *   rows and a mark with no words is one more thing for a reader to step past. Which headings are
 *   on screen is `aria-current` on the links themselves. Draw it as the list's first child.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * Draws the mark at the thickness the recipe states.
 */
const Marked = withContext("li", "indicator");

/**
 * Describes what the mark takes.
 */
export type IndicatorProps = ComponentProps<typeof Marked>;

/**
 * Moves to the rows naming the headings on screen.
 *
 * @param props - Everything a styled list item takes.
 * @returns The mark, positioned by the machine.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useToc();

  return <Marked {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
