/**
 * Renders the layer an angle slider's markers lie on.
 *
 * @remarks
 *   The element is a `div` over the whole dial, hidden from assistive technology and out of the
 *   pointer's way, because the thumb reports the value. Render it before the thumb, so the thumb
 *   covers the marker it rests on.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#angle-slider/context.ts";
import { useAngleSlider } from "#angle-slider/machine.ts";

/**
 * Renders the `div` with the angle slider's marker group class.
 */
const Layer = withContext("div", "markerGroup");

/**
 * Describes the props of the marker group: the props of a `div`.
 */
export type MarkerGroupProps = ComponentProps<typeof Layer>;

/**
 * Renders the marker group with the machine's props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function MarkerGroup(props: MarkerGroupProps): ReactElement {
  return (
    <Layer
      {...mergeProps(useAngleSlider().getMarkerGroupProps(), { "aria-hidden": true }, props)}
    />
  );
}
