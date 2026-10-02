/**
 * Renders the button that opens and closes the popover.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it. The machine sets `aria-expanded`,
 *   `aria-controls` and the press handlers.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `button` with the popover's trigger class.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getTriggerProps(), props)} />;
}
