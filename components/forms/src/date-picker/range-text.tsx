/**
 * Renders the visible range of the view in force as text: a month, a year or a decade.
 *
 * @remarks
 *   The text is `September 2026`, `2026` or `2020 – 2029` in the root's locale, with the end only
 *   where it differs from the start, such as `September – October 2026` over two months.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { visibleText } from "#date-picker/texts.ts";

/**
 * Renders the `span` with the date picker's range text class.
 */
const Ranged = withContext("span", "rangeText");

/**
 * Describes the props of the range text: text in place of the range, and the props of a `span`.
 */
export type RangeTextProps = ComponentProps<typeof Ranged>;

/**
 * Renders the range text with the machine's range text props, or the caller's text in its place.
 *
 * @param props - Text in place of the range and the props of a `span`.
 * @returns The `span` element.
 */
export function RangeText({ children, ...props }: RangeTextProps): ReactElement {
  const api = useDatePicker();

  return (
    <Ranged {...mergeProps(api.getRangeTextProps(), props)}>{children ?? visibleText(api)}</Ranged>
  );
}
