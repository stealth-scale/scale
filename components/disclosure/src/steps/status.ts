/**
 * Renders the node a step shows in its state: completed, current or later.
 *
 * @remarks
 *   The part renders no element. It chooses between its three props by the step's state, and
 *   renders the step's number, counted from one, for a state without one. A disc that turns into a
 *   check once the step is done passes `complete` alone.
 */

import { type ReactNode } from "react";

import { useSteps } from "#steps/machine.ts";
import { useItem } from "#steps/state.ts";

/**
 * Describes the props of the status: the node for each state.
 */
export interface StatusProps {
  /**
   * Node a completed step shows, such as a check.
   */
  readonly complete?: ReactNode;

  /**
   * Node the current step shows.
   */
  readonly current?: ReactNode;

  /**
   * Node a later step shows.
   */
  readonly incomplete?: ReactNode;
}

/**
 * Renders the prop for the step's state, or the step's number when that prop is absent.
 *
 * @param props - The node for each state.
 * @returns The chosen node, or the step's number.
 */
export function Status({ complete, current, incomplete }: StatusProps): ReactNode {
  const { api } = useSteps();
  const { index } = useItem();
  const state = api.getItemState({ index });
  const shown = [
    [state.completed, complete],
    [state.current, current],
    [state.incomplete, incomplete],
  ].find(([matched]) => matched === true)?.[1];

  return shown ?? index + 1;
}
