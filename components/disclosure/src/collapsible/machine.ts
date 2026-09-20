/**
 * Runs the collapsible's machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It builds the ARIA references between the
 *   trigger and the content from it, so a caller naming their own passes it here and the
 *   references follow.
 */

import { useId } from "react";

import * as collapsible from "@zag-js/collapsible";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason
 *   alone: a declaration file naming a type from a package nobody declared is not portable.
 */
export type CollapsibleApi = ReturnType<typeof collapsible.connect>;

/**
 * Describes what a caller sets on the machine, less the id it is given.
 */
export type CollapsibleOptions = Partial<collapsible.Props>;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useCollapsible] = createRequiredContext<CollapsibleApi>("Collapsible");

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function useCollapsibleMachine(options: CollapsibleOptions): CollapsibleApi {
  const generated = useId();

  return collapsible.connect(
    useMachine(collapsible.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitCollapsibleProps = splitEnumerable(collapsible.splitProps);
