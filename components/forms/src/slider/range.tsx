/**
 * Renders the part of a slider's track between its origin and the thumb, or between two thumbs.
 *
 * @remarks
 *   The element is a `div` inside the track, which the machine places with custom properties. It
 *   fills in the palette's solid, and in `Highlight` under forced colors.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";

/**
 * Renders the `div` with the slider's range class.
 */
const Fill = withContext("div", "range");

/**
 * Describes the props of the range: the props of a `div`.
 */
export type RangeProps = ComponentProps<typeof Fill>;

/**
 * Renders the range with the machine's props.
 *
 * @param props - Attributes of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Range(props: RangeProps): ReactElement {
  return <Fill {...mergeProps(useSlider().getRangeProps(), props)} />;
}
