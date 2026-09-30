/**
 * Renders the value of a thumb in a bubble above it while a person drags it.
 *
 * @remarks
 *   The element is a `span` inside `Slider.Thumb`, hidden while its thumb is still. It shows the
 *   thumb's value in the root's format, and children replace it. The machine's inline style places
 *   it as if it were a thumb, so the part leaves that style out and the recipe centres it above its
 *   thumb.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";
import { useShared, useThumbIndex } from "#slider/state.ts";

/**
 * Renders the `span` with the slider's dragging indicator class.
 */
const Bubble = withContext("span", "draggingIndicator");

/**
 * Describes the props of the dragging indicator: the props of a `span`.
 */
export type DraggingIndicatorProps = ComponentProps<typeof Bubble>;

/**
 * Renders the dragging indicator with the machine's props, less its style, and the formatted
 * value.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function DraggingIndicator(props: DraggingIndicatorProps): ReactElement {
  const api = useSlider();
  const index = useThumbIndex();
  const { format } = useShared();
  const { style: _placed, ...machine } = api.getDraggingIndicatorProps({ index });

  return <Bubble {...mergeProps(machine, { children: format(api.getThumbValue(index)) }, props)} />;
}
