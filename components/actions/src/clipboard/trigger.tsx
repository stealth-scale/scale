/**
 * Draws the control a person presses to copy the value.
 *
 * @remarks
 *   The element is `button`, and the machine names it for a screen reader with words that say
 *   whether the copy is fresh. A caller whose trigger carries words of its own states the name
 *   through `aria-label` or through `translations` on the root. The trigger draws no control look.
 *   A caller draws it as the library's button with `as`, so a theme that moves the button moves
 *   this with it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the control the recipe places in the row.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes what the trigger takes.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Copies the value when pressed.
 *
 * @param props - Everything a styled button takes.
 * @returns The control, carrying what the machine says it does.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useClipboard();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
