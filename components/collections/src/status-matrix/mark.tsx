/**
 * Draws one state, as the mark a crossing carries and as the mark the legend explains.
 *
 * @remarks
 *   The tone is written as an attribute rather than taken as an axis. A slot recipe resolves its
 *   variants once at the root, and a grid whose whole point is that every cell differs cannot hold
 *   its states on one.
 *   A state that states no mark of its own draws a filled disc. Left blank it would draw nothing at
 *   all, and a crossing a reader cannot see is worse than a crossing they cannot tell from its
 *   neighbour.
 *   The words are drawn out of sight and only where a caller asks for them. A cell has nothing else
 *   to read out, so it asks. The legend already writes them beside the mark, so it does not, and a
 *   legend that did would read every state twice.
 */

import { type ReactElement } from "react";

import { withContext } from "#status-matrix/context.ts";
import { type MatrixState } from "#status-matrix/states.ts";

/**
 * Wraps the mark and the words that name it.
 */
const Marked = withContext("span", "mark");

/**
 * Draws the filled disc a state with no mark of its own falls back to.
 */
const Dot = withContext("span", "dot");

/**
 * Reads the mark out, from out of sight.
 */
const Named = withContext("span", "name");

/**
 * Describes what the mark takes.
 */
export interface MarkProps {
  /**
   * Read out beside the mark, out of sight. Left off where the words are already on the screen.
   */
  readonly label?: string | undefined;

  /**
   * The state to draw.
   */
  readonly state: MatrixState;
}

/**
 * Draws a state's mark in the state's own tone.
 *
 * @param props - The state, and the words that name it where they are needed.
 * @returns The mark, and the words where they were asked for.
 */
export function Mark({ label, state }: MarkProps): ReactElement {
  return (
    <Marked data-tone={state.tone}>
      {state.mark ?? <Dot />}
      {label === undefined ? null : <Named>{label}</Named>}
    </Marked>
  );
}
