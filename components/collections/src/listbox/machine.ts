/**
 * Runs the listbox machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the label, the field
 *   and the rows report one highlight and one selection. The machine derives every element's
 *   identifier and ARIA reference from `id`.
 */

import * as listbox from "@zag-js/listbox";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes one item of a collection as the parts receive it.
 *
 * @remarks
 *   The machine types an item as `any`. The parts take `unknown` and pass it back unchanged, so
 *   `any` stays in the machine's types.
 */
export type ListboxItem = unknown;

/**
 * Describes the api `listbox.connect` returns: a prop getter per part, and the machine's state and
 * methods.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine. It references
 *   `@zag-js/types`, so the package declares that dependency, or a consumer's declarations would
 *   not resolve.
 */
export type ListboxApi = ReturnType<typeof listbox.connect>;

/**
 * Describes the machine options the root takes. `collection` is required and `id` is optional.
 */
export type ListboxOptions = {
  /**
   * Base of every element identifier the machine generates. React generates one when the caller
   * states none.
   */
  id?: string | undefined;
} & Omit<listbox.Props, "id">;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useListbox` throws for a part rendered outside `Listbox.Root`.
 */
export const [ApiProvider, useListbox] = createRequiredContext<ListboxApi>("Listbox");

/**
 * Starts the listbox machine and returns its connected api.
 *
 * @param options - The machine options split from the root's props, with `id` resolved.
 * @returns The connected api.
 */
export function useListboxMachine(options: listbox.Props): ListboxApi {
  return listbox.connect(useMachine(listbox.machine, omitUndefined(options)), normalizeProps);
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 */
export const splitListboxProps = splitEnumerable(listbox.splitProps);
