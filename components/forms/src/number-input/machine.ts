/**
 * Runs the number input machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the field, the
 *   triggers and the scrubber report one value. The machine parses and formats the value with
 *   `Intl.NumberFormat` in `locale`, clamps it on blur, and steps it with the arrow keys and the
 *   triggers.
 */

import { useId, useState } from "react";

import * as number from "@zag-js/number-input";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `number.connect` returns: a prop getter per part, and the machine's value and
 * methods.
 */
export type NumberInputApi = ReturnType<typeof number.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The triggers take their
 *   names as `label`.
 */
export type NumberInputOptions = Omit<Partial<number.Props>, "translations">;

/**
 * Describes what `onValueChange` receives: the formatted value and the value as a number.
 */
export type ValueChangeDetails = number.ValueChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useNumberInput` throws for a part rendered outside `NumberInput.Root`.
 */
export const [ApiProvider, useNumberInput] = createRequiredContext<NumberInputApi>("NumberInput");

/**
 * Starts the number input machine and returns its connected api.
 *
 * @remarks
 *   The machine counts an empty value as zero in its range check. With a minimum above zero, that
 *   check fails for an empty input. The hook passes `invalid: false` while the value is empty and
 *   the options state no `invalid`, so clearing the field to type another value leaves it valid.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the input gives its control, which the field's label points
 *   at, or nothing outside a field. An input ID the caller passes in `ids` replaces it.
 * @returns The connected api.
 */
export function useNumberInputMachine(
  options: NumberInputOptions,
  control: string | undefined,
): NumberInputApi {
  const generated = useId();
  const [typed, setTyped] = useState(options.defaultValue ?? "");
  const empty = (options.value ?? typed) === "";

  return number.connect(
    useMachine(number.machine, {
      ...(empty ? { invalid: false } : {}),
      ...omitUndefined(options),
      id: options.id ?? generated,
      ids: { ...omitUndefined({ input: control }), ...options.ids },
      onValueChange: (details) => {
        setTyped(details.value);
        options.onValueChange?.(details);
      },
    }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitNumberInputProps<Props extends NumberInputOptions>(
  props: Props,
): [NumberInputOptions, Omit<Props, keyof number.Props>] {
  const [options, rest] = splitEnumerable(number.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
