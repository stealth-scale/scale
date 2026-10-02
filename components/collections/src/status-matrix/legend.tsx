/**
 * Renders the legend: each state's mark beside its label, under the grid.
 *
 * @remarks
 *   The element is a `ul` named by `aria-label`, so a screen reader announces what the list is
 *   about.
 */

import { type ReactElement } from "react";

import { withContext } from "#status-matrix/context.ts";
import { Mark } from "#status-matrix/mark.tsx";
import { type MatrixState } from "#status-matrix/states.ts";

/**
 * Renders the `ul` that wraps the states onto more lines where they do not fit.
 */
const List = withContext("ul", "legend");

/**
 * Renders the `li` of one state.
 */
const Item = withContext("li", "legendItem");

/**
 * Describes the props of the legend: its accessible name and the states.
 */
export interface LegendProps {
  /**
   * Accessible name of the list.
   */
  readonly label: string;

  /**
   * Entries of the legend, in render order.
   */
  readonly states: readonly MatrixState[];
}

/**
 * Renders each state's mark beside its label.
 *
 * @param props - The accessible name and the states.
 * @returns The `ul` element.
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
