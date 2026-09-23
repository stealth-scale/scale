/**
 * Connects the switch machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the control, the
 *   thumb and the label report the same checked state. The machine derives the hidden input's id
 *   from `id`, and the root's label references that input.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as toggle from "@zag-js/switch";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `switch.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type SwitchApi = ReturnType<typeof toggle.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional, less `label`.
 *
 * @remarks
 *   The machine's splitter claims `label` but the machine never reads it, so a `label` prop would
 *   be removed from the element with no effect. Name a switch with `Switch.Label` or with
 *   `aria-label` on the root.
 */
export type SwitchOptions = Omit<Partial<toggle.Props>, "label">;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useSwitch` throws when no `Switch.Root` is mounted above the calling part.
 */
export const [ApiProvider, useSwitch] = createRequiredContext<SwitchApi>("Switch");

/**
 * Starts the switch machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useSwitchMachine(options: SwitchOptions): SwitchApi {
  const generated = useId();

  return toggle.connect(
    useMachine(toggle.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitSwitchProps = splitEnumerable(toggle.splitProps);
