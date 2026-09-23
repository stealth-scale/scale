/**
 * Connects the checkbox machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the control, the
 *   indicator and the label report the same checked state. The machine derives the hidden input's
 *   id from `id`, and the root's label references that input.
 */

import { useId } from "react";

import * as checkbox from "@zag-js/checkbox";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `checkbox.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type CheckboxApi = ReturnType<typeof checkbox.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type CheckboxOptions = Partial<checkbox.Props>;

/**
 * Describes the three checkbox states: checked, unchecked and indeterminate.
 */
export type CheckedState = checkbox.CheckedState;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useCheckbox` throws when no `Checkbox.Root` is mounted above the calling part.
 */
export const [ApiProvider, useCheckbox] = createRequiredContext<CheckboxApi>("Checkbox");

/**
 * Starts the checkbox machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useCheckboxMachine(options: CheckboxOptions): CheckboxApi {
  const generated = useId();

  return checkbox.connect(
    useMachine(checkbox.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitCheckboxProps = splitEnumerable(checkbox.splitProps);
