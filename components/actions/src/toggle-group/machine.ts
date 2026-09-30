/**
 * Runs the toggle group machine and provides its api to the items.
 *
 * @remarks
 *   The root starts one machine and every item reads the api from context, so the items report one
 *   value. A single-select group is a `radiogroup` of radios, and a multiple-select group is a
 *   `group` of buttons that report `aria-pressed`. The machine moves focus between the items with
 *   the arrow keys, Home and End, and the browser's own button toggles an item on Space and Enter.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toggle from "@zag-js/toggle-group";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `toggle.connect` returns: a prop getter per part, and the machine's value and
 * methods.
 */
export type ToggleGroupApi = ReturnType<typeof toggle.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 */
export type ToggleGroupOptions = Partial<toggle.Props>;

/**
 * Describes the options of one item: its value, and whether it is disabled.
 */
export type ItemOptions = toggle.ItemProps;

/**
 * Describes what `onValueChange` receives: the values of the items that are on.
 */
export type ValueChangeDetails = toggle.ValueChangeDetails;

/**
 * Provides the connected api to the items, and reads it back.
 *
 * @remarks
 *   `useToggleGroup` throws for an item rendered outside `ToggleGroup.Root`.
 */
export const [ApiProvider, useToggleGroup] = createRequiredContext<ToggleGroupApi>("ToggleGroup");

/**
 * Starts the toggle group machine and returns its connected api.
 *
 * @remarks
 *   The ID of an item percent-encodes its value, so an ID never contains a space. An ID the caller
 *   passes in `ids` replaces it.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api.
 */
export function useToggleGroupMachine(options: ToggleGroupOptions): ToggleGroupApi {
  const generated = useId();
  const id = options.id ?? generated;

  return toggle.connect(
    useMachine(toggle.machine, {
      ...omitUndefined(options),
      id,
      ids: {
        item: (value) => `toggle-group-${id}-item-${encodeURIComponent(value)}`,
        ...options.ids,
      },
    }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 */
export const splitToggleGroupProps = splitEnumerable(toggle.splitProps);

/**
 * Splits an item's props into its options and the element's props.
 */
export const splitItemProps = splitEnumerable(toggle.splitItemProps);
