/**
 * Runs the popover's machine and carries what it answers down to the parts.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   The id is the machine's and never an element's. It names the panel, the heading and the
 *   paragraph, and points the panel at the last two, so a caller naming their own passes it here
 *   and every reference follows.
 */

import { useId } from "react";

import * as popover from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason.
 */
export type PopoverApi = ReturnType<typeof popover.connect>;

/**
 * Describes what a caller sets on the machine, every setting of it optional.
 */
export type PopoverOptions = Partial<popover.Props>;

/**
 * Hands the running machine to every part, and reads it back.
 */
export const [ApiProvider, usePopover] = createRequiredContext<PopoverApi>("Popover");

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitPopoverProps = splitEnumerable(popover.splitProps);

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads.
 */
export function usePopoverMachine(options: PopoverOptions): PopoverApi {
  const generated = useId();

  return popover.connect(
    useMachine(popover.machine, { ...stated(options), id: options.id ?? generated }),
    normalizeProps,
  );
}
