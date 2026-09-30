/**
 * Renders the mark at the trigger's end that shows the select opens a list.
 *
 * @remarks
 *   The mark is the caller's glyph, such as a chevron, and is hidden from assistive technology,
 *   because the trigger reports whether the panel is open. It lies over the trigger and takes no
 *   pointer, so a press on it reaches the trigger.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#select/context.ts";
import { useSelect } from "#select/machine.ts";

/**
 * Renders the `span` with the select's indicator class.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes the props of the indicator: the glyph and the props of a `span`.
 */
export type IndicatorProps = ComponentProps<typeof Marked>;

/**
 * Renders the indicator with the machine's indicator props.
 *
 * @param props - The glyph and the props of a `span`.
 * @returns The `span` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useSelect();

  return <Marked {...mergeProps(api.getIndicatorProps(), props)} />;
}
