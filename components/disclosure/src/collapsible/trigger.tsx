/**
 * Renders the button that shows and hides the content.
 *
 * @remarks
 *   The element is a `button`. The machine sets `aria-expanded` and `aria-controls`, because it
 *   owns the ids of the trigger and the content.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#collapsible/context.ts";
import { useCollapsible } from "#collapsible/machine.ts";

/**
 * Renders the `button` with the collapsible's trigger class.
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
  const api = useCollapsible();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
