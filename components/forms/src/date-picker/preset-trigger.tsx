/**
 * Renders a button that sets a preset range or preset dates.
 *
 * @remarks
 *   The button is named by its words, such as "Last 7 days". The machine's English name, which
 *   would replace them, is left out. `value` takes a range the machine knows, such as `last7Days`
 *   or `thisMonth`, or the dates themselves.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { type DatePickerApi, type PresetValue, useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `button` with the date picker's preset trigger class.
 */
const Preset = withContext("button", "presetTrigger");

/**
 * Describes the props of a preset trigger: the range or the dates it sets, its words and the props
 * of a `button`.
 */
export interface PresetTriggerProps extends Omit<ComponentProps<typeof Preset>, "value"> {
  /**
   * The range, such as `last7Days`, or the dates the button sets.
   */
  readonly value: PresetValue;
}

/**
 * Renders the preset trigger with the machine's props, named by its words.
 *
 * @param props - The value, the words and the props of a `button`.
 * @returns The `button` element.
 */
export function PresetTrigger({ value, ...props }: PresetTriggerProps): ReactElement {
  const api = useDatePicker();
  const { "aria-label": _label, ...machine }: ReturnType<DatePickerApi["getPresetTriggerProps"]> =
    api.getPresetTriggerProps({ value });

  return <Preset {...mergeProps(machine, props)} />;
}
