/**
 * Renders the range, the part of the ring from the top to the value.
 *
 * @remarks
 *   The element is a `circle` over the track. The machine turns it to start at the top and dashes
 *   it to the value's share of the circumference, and hides it at a value of 0. While the value is
 *   not known the recipe dashes a quarter of it and the ring turns.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress-circle/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the range `circle`.
 */
const Arc = withContext("circle", "range");

/**
 * Describes the props of `Range`: the props of a `circle`.
 */
export type RangeProps = ComponentProps<typeof Arc>;

/**
 * Renders the range with the machine's geometry and state.
 *
 * @param props - The `circle` element's props.
 * @returns The `circle` element.
 */
export function Range(props: RangeProps): ReactElement {
  return <Arc {...mergeProps(useProgress().getCircleRangeProps(), props)} />;
}
