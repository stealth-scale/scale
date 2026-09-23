/**
 * Connects the collapsible machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the trigger and the
 *   content report the same state. The machine derives the ids of the trigger and the content, and
 *   the `aria-controls` reference between them, from `id`.
 */

import { useId } from "react";

import * as collapsible from "@zag-js/collapsible";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `collapsible.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency. A
 *   declaration file that references an undeclared package does not resolve for a consumer.
 */
export type CollapsibleApi = ReturnType<typeof collapsible.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type CollapsibleOptions = Partial<collapsible.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useCollapsible` throws when no `Collapsible.Root` is mounted above the calling part.
 */
export const [ApiProvider, useCollapsible] = createRequiredContext<CollapsibleApi>("Collapsible");

/**
 * Starts the collapsible machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useCollapsibleMachine(options: CollapsibleOptions): CollapsibleApi {
  const generated = useId();

  return collapsible.connect(
    useMachine(collapsible.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitCollapsibleProps = splitEnumerable(collapsible.splitProps);
