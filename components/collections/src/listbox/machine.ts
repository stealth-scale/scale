/**
 * Runs the listbox's machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It builds every reference between the label,
 *   the field and the list from it, so a caller naming their own passes it here and the references
 *   follow.
 */

import * as listbox from "@zag-js/listbox";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what one row of a list holds, as far as a part is concerned.
 *
 * @remarks
 *   The machine types a row as `any`, because a collection holds whatever a caller put in it. A
 *   part takes `unknown` instead and hands it straight back, which keeps the looser type at the one
 *   boundary that needs it rather than letting it reach every file that draws a row.
 */
export type ListboxItem = unknown;

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason
 *   alone: a declaration file naming a type from a package nobody declared is not portable.
 */
export type ListboxApi = ReturnType<typeof listbox.connect>;

/**
 * Describes what a caller sets on the machine, less the id it is given.
 *
 * @remarks
 *   The collection stays required, because a list with no rows to draw is not a list. The id is
 *   optional here and generated at the root, so a caller who names nothing still gets the
 *   references between the label, the field and the rows.
 */
export type ListboxOptions = {
  /**
   * The identifier every reference between the parts is built from.
   */
  id?: string | undefined;
} & Omit<listbox.Props, "id">;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useListbox] = createRequiredContext<ListboxApi>("Listbox");

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the root split out, the id among them.
 * @returns The api every part reads.
 */
export function useListboxMachine(options: listbox.Props): ListboxApi {
  return listbox.connect(useMachine(listbox.machine, stated(options)), normalizeProps);
}

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitListboxProps = splitEnumerable(listbox.splitProps);
