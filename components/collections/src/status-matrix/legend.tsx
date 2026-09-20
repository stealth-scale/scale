/**
 * Draws the list that says what each mark in the grid means.
 *
 * @remarks
 *   A grid of marks is unreadable until a reader has been told what a mark is. The legend is the
 *   one place the vocabulary is written out, and it is drawn under the grid rather than over it,
 *   because a reader consults it once and then reads the grid.
 *   The list is named, so a reader moving by landmark hears what it is a list of. A list of marks
 *   announced as a list of five items is a list nobody stops at.
 */

import { type ReactElement } from "react";

import { withContext } from "#status-matrix/context.ts";
import { Mark } from "#status-matrix/mark.tsx";
import { type MatrixState } from "#status-matrix/states.ts";

/**
 * Lays the states along one line, wrapping where they do not fit.
 */
const List = withContext("ul", "legend");

/**
 * Draws one state beside its words.
 */
const Item = withContext("li", "legendItem");

/**
 * Describes what the legend takes.
 */
export interface LegendProps {
  /**
   * Reads out as the name of the list. A legend nobody can name is a row of marks.
   */
  readonly label: string;

  /**
   * The states to explain, in the order they are written.
   */
  readonly states: readonly MatrixState[];
}

/**
 * Writes out each state's mark beside the words for it.
 *
 * @param props - The states, and what the list is called.
 * @returns The list.
 */
export function Legend({ label, states }: LegendProps): ReactElement {
  return (
    <List aria-label={label}>
      {states.map((state) => (
        <Item key={state.label}>
          <Mark state={state} />
          {state.label}
        </Item>
      ))}
    </List>
  );
}
