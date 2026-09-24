/**
 * Renders the element the machine positions beside the trigger.
 *
 * @remarks
 *   The machine measures the trigger or the anchor and writes the position inline. A caller who
 *   needs the popover outside a clipping or stacking ancestor wraps this part in a portal.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `div` with the popover's positioner class.
 */
const Drawn = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the positioner with the machine's positioner props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Positioner(props: PositionerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getPositionerProps(), props)} />;
}
