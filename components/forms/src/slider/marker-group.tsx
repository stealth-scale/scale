/**
 * Renders the layer a slider's markers lie on.
 *
 * @remarks
 *   The element is a `div` hidden from assistive technology, laid over the track inside the
 *   control, so each marker's dot lies on the track. The machine's inline style places it in the
 *   flow, so the part leaves that style out and the recipe places it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#slider/context.ts";
import { useSlider } from "#slider/machine.ts";

/**
 * Renders the `div` with the slider's marker group class.
 */
const Layer = withContext("div", "markerGroup");

/**
 * Describes the props of the marker group: the props of a `div`.
 */
export type MarkerGroupProps = ComponentProps<typeof Layer>;

/**
 * Renders the marker group with the machine's props, less its style.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function MarkerGroup(props: MarkerGroupProps): ReactElement {
  const { style: _flow, ...machine } = useSlider().getMarkerGroupProps();

  return <Layer {...mergeProps(machine, props)} />;
}
