/**
 * Draws a board: samples a specimen writes and arranges itself, on the library's grid.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";

import { type Display, DisplayProvider } from "#sample/display.ts";

/**
 * The gap a board leaves between its samples until a caller says otherwise.
 *
 * @remarks
 *   The widest gap the scale offers, which is what a matrix leaves between its cells. Two drawings
 *   of one component read as two only when the room between them is wider than the room inside
 *   either, and a specimen shows components that carry insets of their own.
 */
const GAP = "2xl";

/**
 * The columns a board draws until a caller says otherwise: as many of the smallest measure as the
 * room holds, whether or not there are samples for all of them.
 *
 * @remarks
 *   Equal columns are what make a page of drawings read as a set. Components differ in width by
 *   their nature, and cells that each take their own width put the captions at uneven intervals
 *   and leave a ragged edge down the page. A filled row rather than a fitted one keeps a column
 *   the same width whether three samples or eight sit on it, so two scenes of one page line up
 *   with each other as well as within themselves.
 */
const COLUMNS = "fill-xs";

/**
 * Describes what a board takes: everything the library's grid takes, and the look it sets for
 * every sample on it.
 */
export interface BoardProps extends ComponentProps<typeof Grid.Root>, Display {}

/**
 * Lays out the samples a specimen writes, and states how each of them is drawn.
 *
 * @remarks
 *   A board is the library's grid and nothing more, so the columns, the gap, the alignment and the
 *   flow are the grid's own axes and a specimen laid out on one is also a specimen of the grid.
 *   What a board adds is the look: it is stated once here and every sample below takes it, so a
 *   page of boxed drawings is one prop rather than one per cell.
 *   Use it where a matrix cannot say what a page should look like: where the drawings are not one
 *   per value of an axis, where two of them belong side by side and a third below, or where one of
 *   them needs the whole width.
 * @param props - The grid's axes, the look of every sample, and the samples.
 * @returns The samples, arranged.
 */
export function Board({
  children,
  columns = COLUMNS,
  gap = GAP,
  place,
  variant,
  ...grid
}: BoardProps): ReactElement {
  return (
    <Grid.Root align="flex-start" columns={columns} gap={gap} {...grid}>
      <DisplayProvider value={{ place, variant }}>{children}</DisplayProvider>
    </Grid.Root>
  );
}
