/**
 * Renders the button that copies the value.
 *
 * @remarks
 *   The machine supplies the accessible name and swaps it once a copy succeeds. A caller whose
 *   button carries its own text overrides that through `aria-label`, or through `translations` on
 *   the root. This slot applies no control styling; pass `as` to render it as the library's button,
 *   which keeps it in step with every other button in a theme.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the trigger slot inside the control row.
 */
const Pressed = withContext("button", "trigger");

/**
 * Accepts every prop the styled button takes.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the button, merging the caller's props over the machine's.
 *
 * @param props - Everything a styled button takes.
 * @returns The button, wired to the machine's copy handler and its accessible name.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useClipboard();

  return <Pressed {...mergeProps(api.getTriggerProps(), props)} />;
}
