/**
 * Renders the current step's actions through a function the caller passes as children.
 *
 * @remarks
 *   A step lists its buttons as data, so the caller maps each action to a `Tour.ActionTrigger` and
 *   chooses its look: the way forward filled, the others quieter. The function receives an empty
 *   array for a step without actions.
 */

import { type ReactNode } from "react";

import { type StepAction } from "@zag-js/tour";

import { useTourContext } from "#tour/machine.ts";

/**
 * Describes the props of the actions: the function that renders them.
 */
export interface ActionsProps {
  /**
   * Returns what to render for the current step's actions, in the order the step lists them.
   */
  readonly children: (actions: readonly StepAction[]) => ReactNode;
}

/**
 * Renders what the children function returns for the current step's actions.
 *
 * @param props - The function that renders the actions.
 * @returns The nodes the function returns for the step's actions.
 */
export function Actions({ children }: ActionsProps): ReactNode {
  const api = useTourContext();

  return children(api.step?.actions ?? []);
}
