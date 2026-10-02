/**
 * Renders the group of buttons at the end of the header: the stage triggers and the close trigger.
 *
 * @remarks
 *   The element is a `div` that writes the panel's stage as `data-stage`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's control class.
 */
const Drawn = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Drawn>;

/**
 * Renders the control with the machine's control props merged under the caller's.
 *
 * @param props - The triggers and the props of a `div`.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const { api } = useFloatingPanel();

  return <Drawn {...mergeProps(api.getControlProps(), props)} />;
}
