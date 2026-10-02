/**
 * Renders the checkbox's box.
 *
 * @remarks
 *   The element is a `div` that the machine hides from assistive technology, because the root's
 *   `input` already reports the state. The machine sets `data-state` and the other state
 *   attributes the recipe reads on it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `div` with the checkbox's control class.
 */
const Boxed = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Boxed>;

/**
 * Renders the box with the machine's control props.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element that contains the indicators.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useCheckbox();

  return <Boxed {...mergeProps(api.getControlProps(), props)} />;
}
