/**
 * Describes the marks a cartesian chart pins to its data, and finds the ones at a category for the
 * tooltip.
 *
 * @remarks
 *   An annotation's fields decide its mark: `until` makes a period from `at` to `until`, `value`
 *   makes a point at `at` and `value`, and `at` alone makes a moment across the plot. `at` and
 *   `until` are categories of the chart, so a period covers the categories between its ends in the
 *   rows' order, whichever end the caller names first.
 */

import { type ChartColor, colorOf } from "#chart/colors.ts";
import { type TooltipNote } from "#chart/tooltip.tsx";

/**
 * Describes one mark pinned to a chart's data: a moment, a period or a point.
 */
export interface Annotation {
  /**
   * Category the mark is at, or the category its period starts at.
   */
  readonly at: number | string;

  /**
   * Palette of the mark, such as `warning` for a flagged point. The neutral palette unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Identity of the mark, unique among the chart's annotations.
   */
  readonly key: string;

  /**
   * Words for the mark, written on the plot and in the tooltip at its category.
   */
  readonly label: string;

  /**
   * Category the mark's period ends at, which makes the mark a period.
   */
  readonly until?: number | string | undefined;

  /**
   * Value of the point the mark rings, which makes the mark a point.
   */
  readonly value?: number | undefined;
}

/**
 * Returns the category of each row, in order.
 */
function categoriesOf(rows: readonly unknown[], key: string): unknown[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every row a cartesian chart plots is an object
  return rows.map((row): unknown => Reflect.get(row as object, key));
}

/**
 * Returns whether an annotation is at a category: a moment or a point at it, or a period that
 * covers it. A period with an end that is not a category covers none.
 */
function isAt(annotation: Annotation, categories: readonly unknown[], category: unknown): boolean {
  if (annotation.until === undefined) return annotation.at === category;

  const place = categories.indexOf(category);
  const ends = [categories.indexOf(annotation.at), categories.indexOf(annotation.until)];

  return !ends.includes(-1) && Math.min(...ends) <= place && place <= Math.max(...ends);
}

/**
 * Returns the writer of the tooltip's notes: each annotation at the category, with its palette's
 * chart color and its words, or nothing for a chart without annotations.
 *
 * @param annotations - The chart's annotations.
 * @param rows - The chart's rows, in order.
 * @param key - The field of each row the category axis reads.
 */
export function annotationNotesOf(
  annotations: readonly Annotation[],
  rows: readonly unknown[],
  key: string,
): ((category: unknown) => TooltipNote[]) | undefined {
  if (annotations.length === 0) return undefined;

  const categories = categoriesOf(rows, key);

  return (category) =>
    annotations
      .filter((annotation) => isAt(annotation, categories, category))
      .map((annotation) => ({
        color: colorOf(annotation.color ?? "neutral"),
        key: annotation.key,
        text: annotation.label,
      }));
}
