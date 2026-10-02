/**
 * Renders the control the tooltip describes.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it, and a caller passes another control
 *   through `as`. The machine sets the pointer and focus handlers and `aria-describedby`, so a
 *   screen reader reads the tooltip as the control's description.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Renders the `button` with the tooltip's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useTooltip();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
