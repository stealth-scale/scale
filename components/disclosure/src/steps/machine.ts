/**
 * Connects the steps machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context, so the discs, the
 *   titles, the content and the buttons report the same step. The machine derives the ID of every
 *   trigger and content from `id` and the step's index.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as steps from "@zag-js/steps";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `steps.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type StepsApi = ReturnType<typeof steps.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type StepsOptions = Partial<steps.Props>;

/**
 * Describes what the root provides to its parts: the connected api and whether the flow is linear.
 */
export interface StepsMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: StepsApi;

  /**
   * Whether a reader has to complete the steps in order.
   */
  readonly linear: boolean;
}

/**
 * Creates the context through which the root provides the running machine to its parts.
 *
 * @remarks
 *   `useSteps` throws when no `Steps.Root` is mounted above the calling part.
 */
export const [MachineProvider, useSteps] = createRequiredContext<StepsMachine>("Steps");

/**
 * Starts the steps machine and returns its connected api and whether the flow is linear.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 */
export function useStepsMachine(options: StepsOptions): StepsMachine {
  const generated = useId();
  const service = useMachine(steps.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return { api: steps.connect(service, normalizeProps), linear: options.linear === true };
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitStepsProps = splitEnumerable(steps.splitProps);
