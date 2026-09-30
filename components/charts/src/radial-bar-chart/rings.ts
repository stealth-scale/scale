/**
 * Reads a radial bar chart's rings from its bars: the rows recharts renders, the angle axis'
 * domain and the ring an entry of the tooltip belongs to.
 */

import { type ReactNode } from "react";

import { type ChartColor } from "#chart/colors.ts";
import { type TooltipEntry } from "#chart/tooltip.tsx";
import { type ChartApi } from "#chart/use-chart.ts";
import { ceilingOf } from "#polar/ceiling.ts";
import { valueOf } from "#polar/slices.ts";

/**
 * Describes one bar of a radial bar chart, a ring read against the value of a full turn.
 */
export interface RadialBarDatum {
  /**
   * Palette the ring takes its color from. The theme's series color at the bar's place unless
   * stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Key of the bar, which the legend, the tooltip and the hidden keys name.
   */
  readonly key: string;

  /**
   * Name the tooltip and the legend show. The key unless stated.
   */
  readonly label?: ReactNode;

  /**
   * Measure the ring shows. A value that is not a finite number counts as zero.
   */
  readonly value: number;
}

/**
 * Describes one ring recharts renders: its color, its measure, its key, its opacity and its turn.
 *
 * @remarks
 *   The ring names the bar's value `measure`, because recharts spreads the ring into the sector it
 *   computes and overwrites the sector's `value` with the plotted `turn`.
 */
export interface Ring {
  /**
   * CSS value of the ring's color.
   */
  readonly fill: string;

  /**
   * Value of the bar, zero for a value that is not a finite number.
   */
  readonly measure: number;

  /**
   * Key of the bar, which the radius axis reads as the ring's category.
   */
  readonly name: string;

  /**
   * CSS value of the ring's opacity, faded while the legend points at another bar.
   */
  readonly opacity: string;

  /**
   * Value the ring's arc renders: the bar's value within zero and the value of a full turn.
   */
  readonly turn: number;
}

/**
 * Returns a ring per bar the legend shows, in the bars' order, the outermost first.
 *
 * @remarks
 *   Each ring's turn is within zero and the value of a full turn. recharts widens a stated
 *   domain to the values it plots, so a ring past `max` would scale every other ring against
 *   itself, and a ring below zero would turn backwards. A ring past `max` closes its track, and the
 *   legend and the tooltip write its value.
 * @param chart - The chart that resolves each bar's color, opacity and hiding.
 * @param bars - The bars in the caller's order.
 * @param max - The caller's value of a full turn.
 */
export function ringsOf(chart: ChartApi, bars: readonly RadialBarDatum[], max?: number): Ring[] {
  const shown = bars.filter((bar) => !chart.hidden(bar.key));
  const ceiling = ceilingOf(
    shown.map((bar) => valueOf(bar)),
    max,
  );

  return shown.map((bar) => ({
    fill: chart.color(bar.key),
    measure: valueOf(bar),
    name: bar.key,
    opacity: chart.opacity(bar.key),
    turn: Math.min(Math.max(valueOf(bar), 0), ceiling),
  }));
}

/**
 * Returns the angle axis' domain: from zero to the value of a full turn, `max` where it is above
 * zero, else the largest measure shown.
 *
 * @param rings - The rings shown.
 * @param max - The caller's value of a full turn.
 */
export function domainOf(rings: readonly Ring[], max?: number): [number, number] {
  return [
    0,
    ceilingOf(
      rings.map((ring) => ring.measure),
      max,
    ),
  ];
}

/**
 * Returns the ring a tooltip entry was read from.
 */
export function ringOf(entry: TooltipEntry): Ring {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the sector it computed, which spreads the ring's fields
  return entry.payload as Ring;
}
