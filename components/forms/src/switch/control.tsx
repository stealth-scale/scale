/**
 * Renders the switch's track.
 *
 * @remarks
 *   The element is a `span` that the machine hides from assistive technology, because the root's
 *   `input` already reports the state. The machine sets `data-state` and the other state attributes
 *   the recipe reads on it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#switch/context.ts";
import { useSwitch } from "#switch/machine.ts";

/**
 * Renders the `span` with the switch's control class.
 */
const Tracked = withContext("span", "control");

/**
 * Describes the props of the control: the props of a `span`.
 */
export type ControlProps = ComponentProps<typeof Tracked>;

/**
 * Renders the track with the machine's control props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element that contains the thumb.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useSwitch();

  return <Tracked {...mergeProps(api.getControlProps(), props)} />;
}
