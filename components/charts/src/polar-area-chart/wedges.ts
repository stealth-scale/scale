/**
 * Reads a polar area chart's wedges from its slices: the rows recharts renders, the radius that
 * makes a wedge's area follow its value, and the wedge an entry of the tooltip belongs to.
 */

import { type TooltipEntry } from "#chart/tooltip.tsx";
import { type ChartApi } from "#chart/use-chart.ts";
import { ceilingOf } from "#polar/ceiling.ts";
import { valueOf } from "#polar/slices.ts";
import { type PieSlice } from "#polar/types.ts";

/**
 * Opacity of the fill of a wedge at zero. The fill rises to 1 at the value of a full radius.
 */
export const FLOOR = 0.45;

/**
 * Describes one wedge recharts renders: its angle, its extent, its color, the opacity of its fill,
 * its measure, its key and its opacity.
 *
 * @remarks
 *   Every wedge takes the same angle, so recharts reads `angle` as the pie's value and gives each
 *   wedge an equal share of the turn. The slice's value is the wedge's `measure`.
 */
export interface Wedge {
  /**
   * Share of the turn the wedge takes, the same for every wedge.
   */
  readonly angle: number;

  /**
   * Radius of the wedge as a share of the full radius, 0 for a wedge the legend hides.
   */
  readonly extent: number;

  /**
   * CSS value of the wedge's color.
   */
  readonly fill: string;

  /**
   * Opacity of the wedge's fill: `FLOOR` at zero, rising to 1 at the value of a full radius.
   */
  readonly fillOpacity: number;

  /**
   * Value of the slice, zero for a value that is not a finite number.
   */
  readonly measure: number;

  /**
   * Key of the slice, which recharts reports to the tooltip as the entry's name.
   */
  readonly name: string;

  /**
   * CSS value of the wedge's opacity, faded while the legend points at another slice.
   */
  readonly opacity: string;
}

/**
 * Returns the radius of a wedge as a share of the full radius, so the wedge's area follows its
 * value: √(value / max), at most 1, and 0 for a value or a max that is not above zero.
 *
 * @remarks
 *   A wedge's area grows with the square of its radius. A wedge worth four times another is twice
 *   as long and covers four times the area. A radius in proportion to the value would render it
 *   four times as long, with sixteen times the area.
 */
export function areaRadius(value: number, max: number): number {
  return value > 0 && max > 0 ? Math.sqrt(Math.min(1, value / max)) : 0;
}

/**
 * Returns a wedge per slice in the slices' order, the first at 12 o'clock.
 *
 * @remarks
 *   A wedge the legend hides keeps its place at no radius, because a place in a cycle has a
 *   meaning: dropping 03:00 would turn every later hour into the one before it. The value of a full
 *   radius is `max`, else the largest value shown.
 * @param chart - The chart that resolves each slice's color, opacity and hiding.
 * @param slices - The slices in their cyclic order.
 * @param max - The caller's value of a full radius.
 */
export function wedgesOf(chart: ChartApi, slices: readonly PieSlice[], max?: number): Wedge[] {
  const ceiling = ceilingOf(
    slices.filter((slice) => !chart.hidden(slice.key)).map((slice) => valueOf(slice)),
    max,
  );

  return slices.map((slice) => {
    const measure = valueOf(slice);
    const extent = chart.hidden(slice.key) ? 0 : areaRadius(measure, ceiling);

    return {
      angle: 1,
      extent,
      fill: chart.color(slice.key),
      fillOpacity: FLOOR + (1 - FLOOR) * extent ** 2,
      measure,
      name: slice.key,
      opacity: chart.opacity(slice.key),
    };
  });
}

/**
 * Returns the wedge a tooltip entry was read from.
 */
export function wedgeOf(entry: TooltipEntry): Wedge {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the row its wedge was rendered from
  return entry.payload as Wedge;
}
