/**
 * Renders a cell set in the inverted text ink on the inverted surface.
 */

import { type ReactNode } from "react";

import { Sample } from "#sample/sample.tsx";

/**
 * Value of the `tone` axis that sets text in `fg.inverted`.
 */
const INVERTED = "inverted";

/**
 * Returns the cell in an inverted sample for the `inverted` tone, and the cell unchanged for any
 * other tone.
 *
 * @remarks
 *   `fg.inverted` is the ink of the opposite mode, so it fails the text contrast ratio on the page.
 *   The inverted sample fills the cell with `bg.inverted`, the page colour of that mode.
 * @param tone - Value of the cell's `tone` axis.
 * @param cell - Rendered cell.
 * @returns The cell, on `bg.inverted` for the `inverted` tone.
 */
export function grounded(tone: unknown, cell: ReactNode): ReactNode {
  return tone === INVERTED ? <Sample variant="inverted">{cell}</Sample> : cell;
}
