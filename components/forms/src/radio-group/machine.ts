/**
 * Runs the radio group machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every item reads the api from context, so the circles, the
 *   words and the inputs report one value. The machine gives every input the group's `name`, or the
 *   group's `id` without one, so the browser moves between the inputs with the arrow keys.
 */

import { useId } from "react";

import * as radio from "@zag-js/radio-group";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `radio.connect` returns: a prop getter per part, and the machine's value and
 * methods.
 */
export type RadioGroupApi = ReturnType<typeof radio.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 */
export type RadioGroupOptions = Partial<radio.Props>;

/**
 * Describes the options of one item: its value, and whether it is disabled or invalid.
 */
export type ItemOptions = radio.ItemProps;

/**
 * Describes what `onValueChange` receives: the value of the checked item, or null.
 */
export type ValueChangeDetails = radio.ValueChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useRadioGroup` throws for a part rendered outside `RadioGroup.Root`.
 */
export const [ApiProvider, useRadioGroup] = createRequiredContext<RadioGroupApi>("RadioGroup");

/**
 * Describes what the root needs from the machine: the connected api and the ID of the label.
 */
export interface RadioGroupMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: RadioGroupApi;

  /**
   * ID the machine gives `RadioGroup.Label`.
   */
  readonly labelId: string;
}

/**
 * Returns the function that builds the ID of one part of an option from the option's value.
 *
 * @remarks
 *   The value is percent-encoded, so an ID never contains a space. `aria-labelledby` reads a list
 *   of IDs separated by spaces, and the machine's own IDs keep the value as written, so an option
 *   named "Same day" referenced two IDs that do not exist and its radio had no name.
 * @param group - ID of the group.
 * @param part - Name of the part.
 * @returns The function from a value to the part's ID.
 */
export function optionIds(group: string, part: string): (value: string) => string {
  return (value) => `radio-group-${group}-${part}-${encodeURIComponent(value)}`;
}

/**
 * Starts the radio group machine and returns its connected api and the label's ID.
 *
 * @remarks
 *   The label's ID is passed to the machine in `ids`, so the root reads it as a typed value
 *   instead of from the machine's untyped root props. The IDs of an option's parts come from
 *   {@link optionIds}. An ID the caller passes in `ids` replaces each.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api, and the ID of the label.
 */
export function useRadioGroupMachine(options: RadioGroupOptions): RadioGroupMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `radio-group-${id}-label`;
  const service = useMachine(radio.machine, {
    ...omitUndefined(options),
    id,
    ids: {
      item: optionIds(id, "item"),
      itemControl: optionIds(id, "control"),
      itemHiddenInput: optionIds(id, "input"),
      itemLabel: optionIds(id, "text"),
      ...options.ids,
      label: labelId,
    },
  });

  return { api: radio.connect(service, normalizeProps), labelId };
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 */
export const splitRadioGroupProps = splitEnumerable(radio.splitProps);

/**
 * Splits an item's props into its options and the element's props.
 */
export const splitItemProps = splitEnumerable(radio.splitItemProps);
