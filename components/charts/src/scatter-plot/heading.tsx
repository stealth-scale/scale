/**
 * Writes the heading of a scatter's tooltip: the words of the point's label field, else the label
 * of the point's series, and after them the name of the quadrant the point falls in.
 *
 * @remarks
 *   The heading is the first thing the tooltip's live region reads at a point, so a screen reader
 *   hears which point the keys moved to and the box the chart puts it in. The quadrant's name
 *   follows the locale's list separator.
 */

import { type ReactNode } from "react";

import { finiteAt } from "#cartesian/finite.ts";
import { separatorOf } from "#chart/separator.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";
import { type Division, type QuadrantId, quadrantOf } from "#scatter-plot/quadrants.ts";

/**
 * Describes the quadrants a heading names: where they divide and what each is called.
 */
export interface HeadingQuadrants {
  /**
   * Values the quadrants divide at.
   */
  readonly division: Division;

  /**
   * Name of each quadrant.
   */
  readonly names: Readonly<Record<QuadrantId, string>>;
}

/**
 * Describes what a scatter's tooltip heading is written from.
 */
export interface HeadingOptions {
  /**
   * Field of each point whose words head the tooltip.
   */
  readonly labelKey?: string | undefined;

  /**
   * Locale the chart writes in, whose list separator joins the words and the quadrant.
   */
  readonly locale: string;

  /**
   * Quadrants the plot divides into, whose name follows the words.
   */
  readonly quadrants?: HeadingQuadrants | undefined;

  /**
   * Returns the label of the series an entry's point belongs to.
   */
  readonly seriesOf: (entry: TooltipEntry | undefined) => ReactNode;

  /**
   * Field of each point the x axis reads.
   */
  readonly xKey: string;

  /**
   * Field of each point the y axis reads.
   */
  readonly yKey: string;
}

/**
 * Returns the words in a point's field, or nothing where the field contains no words.
 */
function wordsOf(point: unknown, key: string | undefined): string | undefined {
  const value: unknown =
    key === undefined || typeof point !== "object" || point === null
      ? undefined
      : Reflect.get(point, key);

  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

/**
 * Returns the writer of a scatter tooltip's heading.
 *
 * @param options - The label field, the locale, the quadrants, the series' labels and the axes.
 */
export function headingOf(
  options: HeadingOptions,
): (entries: readonly TooltipEntry[]) => ReactNode {
  /**
   * Returns the heading of the entries the tooltip shows, which are the values of one point.
   */
  return function heading(entries) {
    const entry = entries[0];
    const point: unknown = entry?.payload;
    const words = wordsOf(point, options.labelKey) ?? options.seriesOf(entry);
    const { quadrants } = options;

    if (quadrants === undefined) return words;

    const x = Number(finiteAt(point, options.xKey));
    const y = Number(finiteAt(point, options.yKey));
    const name = quadrants.names[quadrantOf(x, y, quadrants.division)];

    return (
      <>
        {words}
        {separatorOf(options.locale)}
        {name}
      </>
    );
  };
}
