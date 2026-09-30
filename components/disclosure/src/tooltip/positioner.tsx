/**
 * Renders the element the machine positions beside the trigger.
 *
 * @remarks
 *   The machine measures the trigger and writes the position inline. A caller who needs the
 *   tooltip outside a clipping or stacking ancestor wraps this part in a portal. The positioner
 *   renders nothing while the content is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTipPresence, useTooltip } from "#tooltip/machine.ts";

/**
 * Renders the `div` with the tooltip's positioner class.
 */
const Placed = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Placed>;

/**
 * Renders the positioner with the machine's positioner props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the content is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const api = useTooltip();
  const { unmounted } = useTipPresence();

  if (unmounted) return null;

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
