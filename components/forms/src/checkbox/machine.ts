/**
 * Runs the checkbox machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the box, the marks
 *   and the text report one state. The machine derives the input's identifier from `id`, and the
 *   root's `label` points at that input. The hook counts presses, so the root renders again after a
 *   press the owner of a controlled box refuses, and its input takes the state back.
 */

import { useId, useReducer } from "react";

import * as checkbox from "@zag-js/checkbox";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

import { counted, type Toggle, useInputState } from "#toggled.ts";

/**
 * Describes the api `checkbox.connect` returns: a prop getter per part, and the machine's state
 * and methods.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine. It references
 *   `@zag-js/types`, so the package declares that dependency, or a consumer's declarations would
 *   not resolve.
 */
export type CheckboxApi = ReturnType<typeof checkbox.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 */
export type CheckboxOptions = Partial<checkbox.Props>;

/**
 * Describes the three states of a checkbox: `true`, `false` and `"indeterminate"`.
 */
export type CheckedState = checkbox.CheckedState;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useCheckbox` throws for a part rendered outside `Checkbox.Root`.
 */
export const [ApiProvider, useCheckbox] = createRequiredContext<CheckboxApi>("Checkbox");

/**
 * Starts the checkbox machine and returns its connected api and the ref its input takes.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api, and the ref the root's input takes.
 */
export function useCheckboxMachine(options: CheckboxOptions): Toggle<CheckboxApi> {
  const generated = useId();
  const [presses, press] = useReducer(counted, 0);
  const api = checkbox.connect(
    useMachine(checkbox.machine, {
      ...omitUndefined(options),
      id: options.id ?? generated,
      onCheckedChange: (details) => {
        options.onCheckedChange?.(details);
        press();
      },
    }),
    normalizeProps,
  );

  return { api, input: useInputState(api.checked, api.indeterminate, presses) };
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 */
export const splitCheckboxProps = splitEnumerable(checkbox.splitProps);
