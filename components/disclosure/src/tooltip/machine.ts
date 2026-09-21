/**
 * Runs the tooltip's machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It names the box so the trigger can point at it
 *   with `aria-describedby`, so a caller naming their own passes it here and the reference follows.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason.
 */
export type TooltipApi = ReturnType<typeof tooltip.connect>;

/**
 * Describes what a caller sets on the machine, every setting of it optional.
 */
export type TooltipOptions = Partial<tooltip.Props>;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, useTooltip] = createRequiredContext<TooltipApi>("Tooltip");

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitTooltipProps = splitEnumerable(tooltip.splitProps);

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function useTooltipMachine(options: TooltipOptions): TooltipApi {
  const generated = useId();

  return tooltip.connect(
    useMachine(tooltip.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
