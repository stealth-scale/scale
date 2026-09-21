/**
 * Draws one axis of a recipe as a matrix of its values.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Axis } from "#matrix/axis.ts";
import { Matrix } from "#matrix/matrix.tsx";

/**
 * Describes what the drawing takes.
 */
export interface DrawnProps {
  /**
   * A second axis, whose values run across each row.
   */
  readonly across?: Axis<unknown> | undefined;

  /**
   * Draws one cell, for a value of the axis and, where a second crosses, a value of that.
   */
  readonly cell: (value: unknown, across: unknown) => ReactNode;

  /**
   * Which way the cells run. Across by default.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * The axis the rows turn, written before each value.
   */
  readonly knob: string;

  /**
   * The values the axis turns to.
   */
  readonly of: readonly unknown[];
}

/**
 * Draws a cell per value, and per pair of values where a second axis crosses.
 *
 * @param props - The axis, its values, the second axis where there is one, and the cell.
 * @returns The matrix.
 */
export function Drawn({ across, cell, direction, knob, of }: DrawnProps): ReactElement {
  return (
    <Matrix
      knob={knob}
      of={of}
      {...(across === undefined ? {} : { across })}
      {...(direction === undefined ? {} : { direction })}
    >
      {cell}
    </Matrix>
  );
}
