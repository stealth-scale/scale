/**
 * Renders a state's mark, in a crossing or in the legend.
 *
 * @remarks
 *   The tone is a `data-tone` attribute, because a slot recipe resolves its variants once at the
 *   root and every cell differs. A state without a mark renders a filled dot. The label renders
 *   visually hidden, and only when passed: a cell passes it, and the legend writes the label beside
 *   the mark and does not.
 */

import { type ReactElement } from "react";

import { withContext } from "#status-matrix/context.ts";
import { type MatrixState } from "#status-matrix/states.ts";

/**
 * Renders the `span` around the mark and its hidden label.
 */
const Marked = withContext("span", "mark");

/**
 * Renders the filled dot of a state without a mark.
 */
const Dot = withContext("span", "dot");

/**
 * Renders the visually hidden label.
 */
const Named = withContext("span", "name");

/**
 * Describes the props of a mark: the state and an optional hidden label.
 */
export interface MarkProps {
  /**
   * Visually hidden text read with the mark. Left out where the text is visible beside it.
   */
  readonly label?: string | undefined;

  /**
   * The state to render.
   */
  readonly state: MatrixState;
}

/**
 * Renders a state's mark in the state's tone.
 *
 * @param props - The state and the optional hidden label.
 * @returns The `span` with the mark, and the hidden label when passed.
 */
export function Mark({ label, state }: MarkProps): ReactElement {
  return (
    <Marked data-tone={state.tone}>
      {state.mark ?? <Dot />}
      {label === undefined ? null : <Named>{label}</Named>}
    </Marked>
  );
}
