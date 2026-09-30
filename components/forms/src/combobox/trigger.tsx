/**
 * Renders the button that opens and closes the panel.
 *
 * @remarks
 *   The button is the input group's square at the input's end, around the caller's glyph, such as
 *   a chevron. It is named by `label` and is out of the tab order, because the arrow keys open the
 *   panel from the input. A press opens or closes the panel, highlights the first selected row,
 *   and keeps focus on the input.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#combobox/context.ts";
import { useCombobox } from "#combobox/machine.ts";

/**
 * Renders the `button` with the combobox's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its name, its glyph and the props of a `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Accessible name of the button. Defaults to `Toggle suggestions`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger with the machine's trigger props, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ label = "Toggle suggestions", ...props }: TriggerProps): ReactElement {
  const api = useCombobox();

  return <Pressed {...mergeProps(api.getTriggerProps(), { "aria-label": label }, props)} />;
}
