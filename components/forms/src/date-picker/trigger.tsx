/**
 * Renders the button that opens and closes the panel.
 *
 * @remarks
 *   The button is the input group's square at the input's end. It is named by `label`, "Choose
 *   date" by default, followed by the label that names the picker, and reports `aria-expanded` and
 *   `aria-haspopup="dialog"`. Opening the panel moves focus to the selected date, else to today. A
 *   read-only picker opens no panel, so its trigger reports `aria-disabled` and keeps its tab stop.
 *   The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useShared } from "#date-picker/state.ts";

/**
 * Renders the `button` with the date picker's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its name, its glyph and the props of a `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Accessible name of the button, followed by the label's. Defaults to `Choose date`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the trigger with the machine's trigger props, named by `label` and the label.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ label = "Choose date", ...props }: TriggerProps): ReactElement {
  const api = useDatePicker();
  const { ids, label: named, readOnly } = useShared();
  const {
    "aria-haspopup": _popup,
    "aria-label": _label,
    ...machine
  }: TriggerProps = { ...api.getTriggerProps() };
  const own = omitUndefined({
    "aria-disabled": readOnly ? true : undefined,
    "aria-haspopup": "dialog" as const,
    "aria-label": label,
    "aria-labelledby": named === undefined ? undefined : `${ids.trigger} ${named}`,
  });

  return <Pressed {...mergeProps(machine, own, props)} />;
}
