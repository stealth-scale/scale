/**
 * Runs the switch machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the track, the thumb
 *   and the text report one state. The machine derives the input's identifier from `id`, and the
 *   root's `label` points at that input.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toggle from "@zag-js/switch";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `switch.connect` returns: a prop getter per part, and the machine's state and
 * methods.
 *
 * @remarks
 *   The type is the return type of `connect`, so it follows the installed machine. It references
 *   `@zag-js/types`, so the package declares that dependency, or a consumer's declarations would
 *   not resolve.
 */
export type SwitchApi = ReturnType<typeof toggle.connect>;

/**
 * Describes the machine options the root takes, every one optional, without `label`.
 *
 * @remarks
 *   The machine's splitter claims `label` and the machine reads it nowhere, so the prop would be
 *   removed from the element with no effect. Name a switch with `Switch.Label`, or with
 *   `aria-label` on the root.
 */
export type SwitchOptions = Omit<Partial<toggle.Props>, "label">;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useSwitch` throws for a part rendered outside `Switch.Root`.
 */
export const [ApiProvider, useSwitch] = createRequiredContext<SwitchApi>("Switch");

/**
 * Starts the switch machine and returns its connected api.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api.
 */
export function useSwitchMachine(options: SwitchOptions): SwitchApi {
  const generated = useId();

  return toggle.connect(
    useMachine(toggle.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into the machine's options and the element's props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 */
export const splitSwitchProps = splitEnumerable(toggle.splitProps);
