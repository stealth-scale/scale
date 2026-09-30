/**
 * Writes the machine's state into the native input of a checkbox, a checkbox card or a switch.
 *
 * @remarks
 *   A press toggles the native input before the machine hears of it, and the machine writes the
 *   input's `checked` property only when its own state changes. A controlled toggle whose owner
 *   refuses a press keeps its state, so its input stays toggled and a form submits it. Each machine
 *   hook counts presses in state, so a refused press still renders the toggle again, and the input
 *   takes the state after that render and after every change of the state.
 */

import { type RefObject, useRef } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Describes what a toggle's machine hook returns: the machine's api, and the ref its input takes.
 *
 * @typeParam Api - The connected api of the machine.
 */
export interface Toggle<Api> {
  /**
   * Connected api of the machine.
   */
  readonly api: Api;

  /**
   * Ref the toggle's native input takes.
   */
  readonly input: RefObject<HTMLInputElement | null>;
}

/**
 * Returns the count of presses after one more.
 *
 * @param presses - The count so far.
 * @returns The count after this press.
 */
export function counted(presses: number): number {
  return presses + 1;
}

/**
 * Returns the ref a toggle's input takes, and writes the toggle's state into that input after
 * every press and every change of the state.
 *
 * @param checked - Whether the toggle is on.
 * @param indeterminate - Whether the toggle is partly on.
 * @param presses - Count of presses, which changes with every press.
 * @returns The ref the input takes.
 */
export function useInputState(
  checked: boolean,
  indeterminate: boolean,
  presses: number,
): RefObject<HTMLInputElement | null> {
  const input = useRef<HTMLInputElement>(null);

  useSafeLayoutEffect(() => {
    if (input.current === null) return;

    input.current.checked = checked;
    input.current.indeterminate = indeterminate;
  }, [checked, indeterminate, presses]);

  return input;
}
