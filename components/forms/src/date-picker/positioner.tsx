/**
 * Renders the element the machine places under the control.
 *
 * @remarks
 *   The machine measures the control and writes the position inline. A caller who needs the panel
 *   outside a clipping or stacking ancestor wraps this part in a portal. The positioner renders
 *   nothing while the panel is out of the document. An inline picker renders its panel without
 *   one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker, usePanelPresence } from "#date-picker/machine.ts";

/**
 * Renders the `div` with the date picker's positioner class.
 */
const Placed = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Placed>;

/**
 * Renders the positioner with the machine's positioner props merged under the caller's.
 *
 * @param props - The panel and the props of a `div`.
 * @returns The `div` element, or nothing while the panel is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const api = useDatePicker();
  const { unmounted } = usePanelPresence();

  if (unmounted) return null;

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
