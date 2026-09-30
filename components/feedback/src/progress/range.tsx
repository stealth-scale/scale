/**
 * Renders the range, which fills the track to the value.
 *
 * @remarks
 *   The machine sets the range's width to the value's share of the track, and sets no width while
 *   the value is not known, where the recipe fills the track with moving stripes.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the range `div`.
 */
const Filled = withContext("div", "range");

/**
 * Describes the props of `Range`.
 */
export type RangeProps = ComponentProps<typeof Filled>;

/**
 * Renders the range with the machine's width and state.
 *
 * @param props - The `div` element's props.
 * @returns The `div` element.
 */
export function Range(props: RangeProps): ReactElement {
  const api = useProgress();

  return <Filled {...mergeProps(api.getRangeProps(), props)} />;
}
