/**
 * Renders the button that opens and closes the toggle tip.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it and a press on a touch screen opens the
 *   tip. The machine sets `aria-expanded`, `aria-controls` and the press handlers. The trigger
 *   drops the machine's `aria-haspopup="dialog"`, because the note is not a dialog. A trigger that
 *   contains only an icon takes its name from `aria-label`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toggle-tip/context.ts";
import { useToggleTip } from "#toggle-tip/machine.ts";

/**
 * Renders the `button` with the toggle tip's trigger class.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the trigger with the machine's trigger props, less `aria-haspopup`, merged over the
 * caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useToggleTip();
  const { "aria-haspopup": _popup, ...machine }: TriggerProps = { ...api.getTriggerProps() };

  return <Drawn {...mergeProps(machine, props)} />;
}
