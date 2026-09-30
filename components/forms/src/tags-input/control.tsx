/**
 * Renders the field box that contains the tags and the input.
 *
 * @remarks
 *   The element is a `div` with no role. It renders the field's edge, surface and states, and a
 *   press on it outside a tag focuses the input. The machine puts a read-only control in the tab
 *   order. This control is left out of it, because the read-only input takes focus.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tags-input/context.ts";
import { useTagsInput } from "#tags-input/machine.ts";

/**
 * Renders the `div` with the tags input's control class.
 */
const Box = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Box>;

/**
 * Renders the control with the machine's props, less its tab stop.
 *
 * @param props - Attributes and children of the `div` element, merged over the machine's.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const { tabIndex: _stop, ...machine } = useTagsInput().getControlProps();

  return <Box {...mergeProps(machine, props)} />;
}
