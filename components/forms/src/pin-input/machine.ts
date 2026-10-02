/**
 * Runs the pin input machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the boxes, the label
 *   and the hidden input report one value. The machine finds the boxes inside the root by the
 *   root's ID. It moves focus from box to box as a person types or deletes, and fills every box
 *   from a pasted code.
 */

import { useId } from "react";

import * as pin from "@zag-js/pin-input";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `pin.connect` returns: a prop getter per part, and the machine's value and
 * methods.
 */
export type PinInputApi = ReturnType<typeof pin.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. Each box takes its name as
 *   `label`.
 */
export type PinInputOptions = Omit<Partial<pin.Props>, "translations">;

/**
 * Describes what `onValueChange` and `onValueComplete` receive: the characters and the code.
 */
export type ValueChangeDetails = pin.ValueChangeDetails;

/**
 * Describes what `onValueInvalid` receives: the refused text and the box it was typed into.
 */
export type ValueInvalidDetails = pin.ValueInvalidDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `usePinInput` throws for a part rendered outside `PinInput.Root`.
 */
export const [ApiProvider, usePinInput] = createRequiredContext<PinInputApi>("PinInput");

/**
 * Describes what the root needs from the machine: the connected api and the ID of the label.
 */
export interface PinInputMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: PinInputApi;

  /**
   * ID the machine gives `PinInput.Label`.
   */
  readonly labelId: string;
}

/**
 * Starts the pin input machine and returns its connected api and the label's ID.
 *
 * @remarks
 *   The label's ID is passed to the machine in `ids`, so the root reads it as a typed value. Inside
 *   a field the first box takes the field's control ID, so the field's label points at a box a
 *   person can reach. An ID the caller passes in `ids` replaces each.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the pin input gives its control, or nothing outside a
 *   field.
 * @returns The connected api, and the ID of the label.
 */
export function usePinInputMachine(
  options: PinInputOptions,
  control: string | undefined,
): PinInputMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `pin-input:${id}:label`;
  const service = useMachine(pin.machine, {
    ...omitUndefined(options),
    id,
    ids: {
      input: (index) =>
        index === "0" && control !== undefined ? control : `pin-input:${id}:${index}`,
      ...options.ids,
      label: labelId,
    },
  });

  return { api: pin.connect(service, normalizeProps), labelId };
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
export function splitPinInputProps<Props extends PinInputOptions>(
  props: Props,
): [PinInputOptions, Omit<Props, keyof pin.Props>] {
  const [options, rest] = splitEnumerable(pin.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
