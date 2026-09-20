/**
 * Writes the axes a container offers for how it lays its children out, so every layout recipe
 * names the same values and a theme moves the spacing of all of them at once.
 *
 * @remarks
 *   A class carries the value a caller picked and not the axis it picked it on, so no two axes of
 *   one recipe may offer the same value. The main axis takes the short names, because it is the
 *   one a row states most, and the cross axis takes the spellings CSS gives it beside them. A
 *   container that centres its children across the flow states no cross alignment at all, which
 *   is what a row of a mark and a word wants.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import { dense } from "#authoring/recipes/density.ts";
import { SCALE, type Width, WIDTHS } from "#draw/metrics.ts";
import { type Scale } from "#draw/type.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Selects where the children of a container are placed across the direction they run in.
 */
export type Align = "baseline" | "flex-end" | "flex-start" | "stretch";

/**
 * Selects how the space along that direction is shared out.
 */
export type Justify = "around" | "between" | "center" | "end" | "evenly" | "start";

/**
 * Lists the places a child takes across the flow, each already what CSS calls it.
 */
export const ALIGNMENTS: readonly Align[] = ["flex-start", "flex-end", "stretch", "baseline"];

/**
 * Maps each distribution to what CSS calls it.
 */
const SPACING: Readonly<Record<Justify, string>> = {
  around: "space-around",
  between: "space-between",
  center: "center",
  end: "flex-end",
  evenly: "space-evenly",
  start: "flex-start",
};

/**
 * Lists the distributions, from the ones that place the group to the ones that share the space.
 */
export const DISTRIBUTIONS: readonly Justify[] = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
];

/**
 * Writes the `gap` axis of a container, each value a step of the semantic gap scale.
 */
export const gapSizes: Axis<Scale> = axis(SCALE, (gap) => ({ gap: dense(`{spacing.gap.${gap}}`) }));

/**
 * Writes the `align` axis of a container, which places its children across the direction they run
 * in, each value already what CSS calls it.
 */
export const alignVariants: Axis<Align> = axis(ALIGNMENTS, (place) => ({ alignItems: place }));

/**
 * Writes the `justify` axis of a container, which shares the space out along the direction its
 * children run in, each value reading what CSS calls it.
 */
export const justifyVariants: Axis<Justify> = axis(DISTRIBUTIONS, (spacing) => ({
  justifyContent: SPACING[spacing],
}));

/**
 * Writes the `columns` axis of a grid that fits as many columns of one measure as it has room
 * for, keyed `fit-<measure>`.
 *
 * @remarks
 *   The template guards the measure against the space the grid has, so a column wider than the
 *   grid narrows rather than overflowing it. This is the whole of a grid's responsiveness: the
 *   columns answer to the room they are in and the page states no breakpoint.
 */
export function fittedColumns(): Record<`fit-${Width}`, SystemStyleObject>;

/**
 * Writes the fitted `columns` axis for the measures a recipe names.
 *
 * @typeParam Offered - The measures the recipe offers.
 */
export function fittedColumns<const Offered extends Width>(
  widths: readonly Offered[],
): Record<`fit-${Offered}`, SystemStyleObject>;

/**
 * Writes one entry per measure, each a template that fits as many columns of it as there is room
 * for.
 */
export function fittedColumns(
  widths: readonly Width[] = WIDTHS,
): Record<string, SystemStyleObject> {
  return Object.fromEntries(
    widths.map((width) => [
      `fit-${width}`,
      { gridTemplateColumns: `repeat(auto-fit, minmax(min({sizes.${width}}, 100%), 1fr))` },
    ]),
  );
}

/**
 * Writes the `columns` axis of a grid that fills its row with columns of one measure whether or
 * not there are entries for all of them, keyed `fill-<measure>`.
 *
 * @remarks
 *   The difference from `fit-<measure>` shows on a row with fewer entries than columns. A fitted
 *   grid drops the empty columns and stretches the entries across the row, so one card in a group
 *   of one runs the whole width. A filled grid keeps the empty columns, so that card keeps the
 *   measure every other card has.
 */
export function filledColumns(): Record<`fill-${Width}`, SystemStyleObject>;

/**
 * Writes the filled `columns` axis for the measures a recipe names.
 *
 * @typeParam Offered - The measures the recipe offers.
 */
export function filledColumns<const Offered extends Width>(
  widths: readonly Offered[],
): Record<`fill-${Offered}`, SystemStyleObject>;

/**
 * Writes one entry per measure, each a template that fills the row with columns of it.
 */
export function filledColumns(
  widths: readonly Width[] = WIDTHS,
): Record<string, SystemStyleObject> {
  return Object.fromEntries(
    widths.map((width) => [
      `fill-${width}`,
      { gridTemplateColumns: `repeat(auto-fill, minmax(min({sizes.${width}}, 100%), 1fr))` },
    ]),
  );
}

/**
 * Selects a count of columns, which a grid draws and an entry spans.
 */
export type Count = "1" | "10" | "11" | "12" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/**
 * Lists the counts in the order they grow, which is every column of a grid of twelve.
 */
export const COUNTS: readonly Count[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

/**
 * Writes the `columns` axis of a grid that draws a count of equal columns.
 *
 * @remarks
 *   A column is held to a minimum of nothing, so a long word in one entry widens no column.
 */
export const columnCounts: Axis<Count> = axis(COUNTS, (count) => ({
  gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
}));

/**
 * Writes the `span` axis of a grid's entry, which reaches across a count of columns.
 */
export const spanCounts: Axis<Count> = axis(COUNTS, (count) => ({ gridColumn: `span ${count}` }));

/**
 * Writes an axis that holds a box to one of the page's measures, keyed by the measure.
 */
export const widthSizes: Axis<Width> = axis(WIDTHS, (width) => ({ maxInlineSize: width }));
