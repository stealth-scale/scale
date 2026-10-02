/**
 * Renders the button that clears the dates.
 *
 * @remarks
 *   The button is the input group's square before the trigger. It is named by `label`, "Clear date"
 *   by default, and is `hidden` while no date is set and in a read-only picker. A press clears the
 *   dates and moves focus to the first input. The glyph is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";
import { useShared } from "#date-picker/state.ts";

/**
 * Renders the `button` with the date picker's clear trigger class.
 */
const Cleared = withContext("button", "clearTrigger");

/**
 * Describes the props of the clear trigger: its name, its glyph and the props of a `button`.
 */
export interface ClearTriggerProps extends ComponentProps<typeof Cleared> {
  /**
   * Accessible name of the button. Defaults to `Clear date`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the clear trigger with the machine's clear trigger props, named by `label`.
 *
 * @param props - The name, the glyph and the props of a `button`.
 * @returns The `button` element, hidden while no date is set.
 */
export function ClearTrigger({ label = "Clear date", ...props }: ClearTriggerProps): ReactElement {
  const api = useDatePicker();
  const { readOnly } = useShared();
  const { "aria-label": _label, ...machine }: ClearTriggerProps = {
    ...api.getClearTriggerProps(),
  };
  const own: ClearTriggerProps = {
    "aria-label": label,
    disabled: api.disabled,
    hidden: readOnly || api.value.length === 0,
  };

  return <Cleared {...mergeProps(machine, own, props)} />;
}
