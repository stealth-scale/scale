/**
 * Runs the switch's machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It builds the reference from the root's label
 *   to the hidden input from it, so a caller naming their own passes it here and the reference
 *   follows.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toggle from "@zag-js/switch";

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
export type SwitchApi = ReturnType<typeof toggle.connect>;

/**
 * Describes what a caller sets on the machine, less the id it is given.
 *
 * @remarks
 *   `label` is left out. The machine's splitter claims the name and the machine reads it nowhere,
 *   so a caller stating it would lose it off the element and gain nothing. Name a switch with
 *   `Switch.Label` or with `aria-label` on the root.
 */
export type SwitchOptions = Omit<Partial<toggle.Props>, "label">;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useSwitch] = createRequiredContext<SwitchApi>("Switch");

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function useSwitchMachine(options: SwitchOptions): SwitchApi {
  const generated = useId();

  return toggle.connect(
    useMachine(toggle.machine, { ...stated(options), id: options.id ?? generated }),
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
export const splitSwitchProps = splitEnumerable(toggle.splitProps);
