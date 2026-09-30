/**
 * Renders a slider's value in words.
 *
 * @remarks
 *   The element is a `span` that shows each thumb's value in the root's format, joined by
 *   `separator` for a range. It is not a live region: each thumb announces its own value as it
 *   moves. Children replace the words.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";
import { useShared } from "#slider/state.ts";

/**
 * Renders the `span` with the slider's value text class.
 */
const Shown = withContext("span", "valueText");

/**
 * Describes the props of the value text: the words between two values and the props of a `span`.
 */
export interface ValueTextProps extends ComponentProps<typeof Shown> {
  /**
   * Words between the values of a range. Defaults to an en dash between spaces.
   */
  readonly separator?: string | undefined;
}

/**
 * Renders the value text with the machine's props and the formatted values.
 *
 * @param props - The separator and the props of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function ValueText({ separator = " – ", ...rest }: ValueTextProps): ReactElement {
  const api = useSlider();
  const { format } = useShared();
  const words = api.value.map((value) => format(value)).join(separator);

  return <Shown {...mergeProps(api.getValueTextProps(), { children: words }, rest)} />;
}
