/**
 * Returns the props of a button that moves the visible range: the previous and the next trigger.
 *
 * @remarks
 *   The machine disables a button at the end of the range `min` and `max` allow, and a focused
 *   button that becomes disabled loses focus to the page. The button reports `aria-disabled` in its
 *   place, keeps its tab stop, and cancels its press, which the machine then ignores.
 */

import { type MouseEvent } from "react";

import { mergeProps } from "@zag-js/react";

import { type DatePickerApi } from "#date-picker/machine.ts";

/**
 * Describes the props the machine returns for a button.
 */
type ButtonProps = ReturnType<DatePickerApi["getNextTriggerProps"]>;

/**
 * Returns the machine's props for a previous or next trigger with its name and its disabled state
 * as `aria-disabled`.
 *
 * @remarks
 *   The guard that cancels a press at the end is merged after the machine's handler, so it runs
 *   first and the machine sees the cancelled press.
 * @param machine - The props the machine returns for the button.
 * @param label - The button's name.
 * @returns The button's props, to merge before the caller's.
 */
export function stepped(machine: ButtonProps, label: string): ButtonProps {
  const { "aria-label": _label, disabled, ...kept } = machine;
  const ended = disabled === true;

  return mergeProps(kept, {
    "aria-disabled": ended ? true : undefined,
    "aria-label": label,
    onClick: (event: MouseEvent<HTMLButtonElement>): void => {
      if (ended) event.preventDefault();
    },
  });
}
