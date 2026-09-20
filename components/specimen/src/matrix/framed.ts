/**
 * Reads the one cell a framed document asked a matrix for, and tells the page holding the
 * document which cells the matrix offers.
 */

import { type ReactNode } from "react";

import { useFramed } from "#framed/context.ts";
import { type Choice, useReportedChoices } from "#framed/report.ts";
import { type Axis, nameOf } from "#matrix/axis.ts";

/**
 * Lists each value of an axis the way its cell is captioned, as the part of a pick the axis sets.
 */
function offered<Value>(axis: Axis<Value>, part: Choice["part"]): Choice {
  return { knob: axis.knob, names: axis.of.map((value) => nameOf(axis, value)), part };
}

/**
 * Draws the one cell a framed document was asked for, bare, or nothing where the axes have no
 * value at the position asked for, and reports the axes to the page holding the document.
 *
 * @remarks
 *   Outside a framed document there is no pick, nothing is reported, and the matrix draws its
 *   grid.
 * @param axis - The first axis.
 * @param across - The second axis, where one crosses.
 * @param drawn - How one cell is drawn.
 * @returns The cell, `null` for a position past the axes, or undefined outside a framed document.
 */
export function useFramedCell<Value, Other>(
  axis: Axis<Value>,
  across: Axis<Other> | undefined,
  drawn: (value: Value, across: Other) => ReactNode,
): ReactNode | undefined {
  const pick = useFramed();

  useReportedChoices(
    pick === undefined
      ? undefined
      : [offered(axis, "value"), ...(across === undefined ? [] : [offered(across, "across")])],
  );

  if (pick === undefined) return undefined;

  const value = axis.of[pick.value ?? 0];

  if (value === undefined) return null;
  if (across === undefined) {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the second argument stands for the absent axis, which the type states as undefined
    return drawn(value, undefined as Other);
  }

  const other = across.of[pick.across ?? 0];

  return other === undefined ? null : drawn(value, other);
}
