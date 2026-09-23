/**
 * Connects the listbox machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the label, the input
 *   and the rows report the same highlight and selection. The machine derives every element id and
 *   ARIA reference between the label, the input and the list from `id`.
 */

import * as listbox from "@zag-js/listbox";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes one item of a collection as the parts see it.
 *
 * @remarks
 *   Zag types a collection item as `any`. The parts accept `unknown` and pass it back to the
 *   machine unchanged, so `any` stays at this boundary instead of spreading into every part file.
 */
export type ListboxItem = unknown;

/**
 * Describes the api `listbox.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type ListboxApi = ReturnType<typeof listbox.connect>;

/**
 * Describes the machine settings a caller can pass to the root.
 *
 * @remarks
 *   `collection` stays required. `id` is optional because the root generates one when the caller
 *   passes none.
 */
export type ListboxOptions = {
  /**
   * The value the machine embeds in every element id it generates.
   */
  id?: string | undefined;
} & Omit<listbox.Props, "id">;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useListbox` throws when no `Listbox.Root` is mounted above the calling part.
 */
export const [ApiProvider, useListbox] = createRequiredContext<ListboxApi>("Listbox");

/**
 * Starts the listbox machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props, with `id` already resolved.
 */
export function useListboxMachine(options: listbox.Props): ListboxApi {
  return listbox.connect(useMachine(listbox.machine, omitUndefined(options)), normalizeProps);
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitListboxProps = splitEnumerable(listbox.splitProps);
