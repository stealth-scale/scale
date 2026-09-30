/**
 * Renders the row that holds the carousel's controls: the triggers, the dots, the rotation control
 * and the progress text.
 *
 * @remarks
 *   The recipe places the row beside the slides, or over them when the root's `controls` is
 *   `overlay`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#carousel/context.ts";
import { useCarousel } from "#carousel/machine.ts";

/**
 * Renders the `div` with the carousel's control class.
 */
const Drawn = withContext("div", "control");

/**
 * Describes the props of the control row: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Drawn>;

/**
 * Renders the control row with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`, the controls among its children.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const { api } = useCarousel();

  return <Drawn {...mergeProps(api.getControlProps(), props)} />;
}
