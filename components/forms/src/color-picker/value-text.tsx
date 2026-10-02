/**
 * Renders the picker's color as text.
 *
 * @remarks
 *   The text is the color in the format in force, such as `rgba(59, 130, 246, 1)`, or in the format
 *   passed as `format`, such as `hex`. Children replace it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ColorStringFormat } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `span` with the color picker's value text class.
 */
const Written = withContext("span", "valueText");

/**
 * Describes the props of the value text: the format and the props of a `span`.
 */
export interface ValueTextProps extends ComponentProps<typeof Written> {
  /**
   * Format the color is written in, such as `hex` or `css`. Defaults to the format in force.
   */
  readonly format?: ColorStringFormat | undefined;
}

/**
 * Renders the value text with the machine's value text props merged under the caller's.
 *
 * @param props - The format, the text that replaces the color, and the props of a `span`.
 * @returns The `span` element.
 */
export function ValueText({ children, format, ...props }: ValueTextProps): ReactElement {
  const api = useColorPicker();
  const text = format === undefined ? api.valueAsString : api.value.toString(format);

  return <Written {...mergeProps(api.getValueTextProps(), props)}>{children ?? text}</Written>;
}
