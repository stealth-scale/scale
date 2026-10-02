/**
 * Renders an angle slider's value in words.
 *
 * @remarks
 *   The element is a `span` that shows the value in the root's format, 45° by default, in the
 *   middle of the dial when it is a child of the control. It is not a live region: the thumb
 *   announces its value as it moves. Children replace the words.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#angle-slider/context.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";
import { useShared } from "#angle-slider/state.ts";

/**
 * Renders the `span` with the angle slider's value text class.
 */
const Shown = withContext("span", "valueText");

/**
 * Describes the props of the value text: the props of a `span`.
 */
export type ValueTextProps = ComponentProps<typeof Shown>;

/**
 * Renders the value text with the machine's props and the formatted value.
 *
 * @param props - Attributes and children of the `span`, merged over the machine's.
 * @returns The `span` element.
 */
export function ValueText(props: ValueTextProps): ReactElement {
  const api = useAngleSlider();
  const { format } = useShared();

  return <Shown {...mergeProps(api.getValueTextProps(), { children: format(api.value) }, props)} />;
}
