/**
 * Connects the tooltip machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the trigger and the
 *   content report the same state. The machine derives the content's id from `id`, and the trigger
 *   references that id through `aria-describedby`.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `tooltip.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type TooltipApi = ReturnType<typeof tooltip.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type TooltipOptions = Partial<tooltip.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useTooltip` throws when no `Tooltip.Root` is mounted above the calling part.
 */
export const [ApiProvider, useTooltip] = createRequiredContext<TooltipApi>("Tooltip");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitTooltipProps = splitEnumerable(tooltip.splitProps);

/**
 * Starts the tooltip machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useTooltipMachine(options: TooltipOptions): TooltipApi {
  const generated = useId();

  return tooltip.connect(
    useMachine(tooltip.machine, { ...omitUndefined(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
