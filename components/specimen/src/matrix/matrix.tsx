/**
 * Draws a component once per value of an axis, or once per pair where a second axis crosses the
 * first, each cell captioned with the value it was drawn for.
 *
 * @remarks
 *   A specimen showing a component at three sizes, or in every look, is the same shape every time:
 *   a caption, the thing, repeat. This is that shape, so a specimen holds only what it shows. Two
 *   axes are one row per value of the first, captioned, holding one cell per value of the second.
 *   Every arrangement is the library's stack, so a row wraps where it runs out of room and a page
 *   narrower than the row folds it onto the next line.
 */

import { type ReactElement, type ReactNode } from "react";

import { Stack } from "@stealthscale/component-layout";

import { type Axis, captionOf, nameOf } from "#matrix/axis.ts";
import { Caption } from "#matrix/caption.tsx";

/**
 * Describes what a matrix takes.
 *
 * @typeParam Value - What one cell is drawn for along the first axis.
 * @typeParam Across - What one cell is drawn for along the second, where a second axis crosses.
 */
export interface MatrixProps<Value, Across = undefined> extends Axis<Value> {
  /**
   * A second axis, whose values run across each row while the first runs down the rows.
   */
  across?: Axis<Across> | undefined;

  /**
   * Draws one cell, for a value of the axis and, where a second axis crosses, a value of that.
   */
  children: (value: Value, across: Across) => ReactNode;

  /**
   * Which way the cells of one axis run. Across by default, wrapping where the row runs out of
   * room.
   */
  direction?: "column" | "row";
}

/**
 * Draws one captioned cell.
 */
function celled<Value>(axis: Axis<Value>, value: Value, drawn: ReactNode): ReactElement {
  return (
    <Stack align="flex-start" gap="xs" key={captionOf(axis, value)}>
      <Caption knob={axis.knob}>{nameOf(axis, value)}</Caption>
      {drawn}
    </Stack>
  );
}

/**
 * Draws a row of cells, wrapping where it runs out of room.
 */
function rowed(cells: readonly ReactElement[]): ReactElement {
  return (
    <Stack align="flex-start" direction="row" gap="2xl" wrap>
      {cells}
    </Stack>
  );
}

/**
 * Draws one captioned cell per value of an axis, or one per pair where a second axis crosses it.
 *
 * @param props - The axes and what to draw for each value.
 * @returns The cells, captioned and spaced.
 */
export function Matrix<Value, Across = undefined>(props: MatrixProps<Value, Across>): ReactElement {
  const { across, children, direction = "row", ...axis } = props;

  if (across !== undefined) {
    return (
      <Stack align="flex-start" gap="2xl">
        {axis.of.map((value) => (
          <Stack align="flex-start" gap="sm" key={captionOf(axis, value)}>
            <Caption knob={axis.knob}>{nameOf(axis, value)}</Caption>
            {rowed(across.of.map((other) => celled(across, other, children(value, other))))}
          </Stack>
        ))}
      </Stack>
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the second argument stands for the absent axis, which the type states as undefined
  const alone = undefined as Across;
  const cells = axis.of.map((value) => celled(axis, value, children(value, alone)));

  if (direction === "row") return rowed(cells);

  return (
    <Stack align="flex-start" gap="2xl">
      {cells}
    </Stack>
  );
}
