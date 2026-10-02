/**
 * Renders the button that opens the floating panel and closes it again.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it. The machine sets `aria-controls` and the
 *   press handler, which opens a closed panel and closes an open one. The trigger adds
 *   `aria-expanded` and `aria-haspopup="dialog"`, which the machine leaves out: a closed trigger
 *   would otherwise point `aria-controls` at a panel that is not in the document. Focus returns to
 *   the trigger when the panel closes.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel } from "#floating-panel/machine.ts";

/**
 * Renders the `button` with the floating panel's trigger class.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the trigger with the machine's trigger props and the panel's state merged under the
 * caller's props.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const { api } = useFloatingPanel();
  const own = { "aria-expanded": api.open, "aria-haspopup": "dialog" } as const;

  return <Drawn {...mergeProps(api.getTriggerProps(), own, props)} />;
}
