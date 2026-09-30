/**
 * Renders the row that contains the pin input's boxes.
 *
 * @remarks
 *   The row lays the boxes side by side with the size's gap, or with none when the root is
 *   `attached`. A mark between two boxes, such as a dash that splits a code in two, goes in the row
 *   beside them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#pin-input/context.ts";
import { usePinInput } from "#pin-input/machine.ts";

/**
 * Renders the `div` with the pin input's control class.
 */
const Row = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Row>;

/**
 * Renders the row with the machine's control props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element that contains the boxes.
 */
export function Control(props: ControlProps): ReactElement {
  const api = usePinInput();

  return <Row {...mergeProps(api.getControlProps(), props)} />;
}
