/**
 * Renders the indicator next to the links whose headings are visible.
 *
 * @remarks
 *   The machine writes the offset and height of the active rows to `--top` and `--height`, so the
 *   recipe sets only the indicator's width and color. The machine sets `hidden` until it has a row
 *   to measure. The indicator sets `aria-hidden`, because `aria-current` on the links already
 *   marks the visible headings. Render it as the first child of `Toc.List`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * List item with the indicator slot classes.
 */
const Styled = withContext("li", "indicator");

/**
 * Describes the props of Toc.Indicator: the props of a list item element.
 */
export type IndicatorProps = ComponentProps<typeof Styled>;

/**
 * Renders a list item positioned over the active rows, hidden from the accessibility tree.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useToc();

  return <Styled {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps(), props)} />;
}
