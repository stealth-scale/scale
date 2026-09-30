/**
 * Describes the props the pie and the donut take: the slices, the chart's words, and the figure's
 * props.
 */

import { type ReactNode } from "react";

import { type ChartColor } from "#chart/colors.ts";
import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions } from "#chart/use-chart.ts";

/**
 * Describes one slice of a pie, a part of the whole.
 */
export interface PieSlice {
  /**
   * Palette the slice takes its color from. The theme's series color at the slice's place, largest
   * first, unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Key of the slice, which the legend, the tooltip and the hidden keys name.
   */
  readonly key: string;

  /**
   * Name the tooltip and the legend show. The key unless stated.
   */
  readonly label?: ReactNode;

  /**
   * Size of the part. A value that is not a finite number counts as zero.
   */
  readonly value: number;
}

/**
 * Describes the props of a pie.
 */
export interface PolarProps
  extends Omit<ChartOptions<PieSlice>, "data" | "series">, Omit<RootProps, "chart" | "children"> {
  /**
   * Whether the slices animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the pie.
   */
  readonly children?: ReactNode;

  /**
   * Index of the slice, largest first, the tooltip shows when the chart first renders. No tooltip
   * shows at first unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no slices.
   */
  readonly empty?: ReactNode;

  /**
   * Accessible name of the chart's keyboard layer, such as "Storage per kind of file".
   */
  readonly label: string;

  /**
   * Whether the legend renders below the plot. It renders while the chart has slices unless
   * stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Largest number of slices the pie renders. The slices past it gather into one slice named by
   * `otherLabel`. Every slice renders unless stated.
   */
  readonly maxSlices?: number | undefined;

  /**
   * Name of the slice the tail gathers into.
   */
  readonly otherLabel?: ReactNode;

  /**
   * Whether each slice's share of the slices shown is written on it.
   */
  readonly shares?: boolean | undefined;

  /**
   * Parts of the whole, in any order. The pie renders them largest first.
   */
  readonly slices: readonly PieSlice[];

  /**
   * `Intl.NumberFormat` options the tooltip writes a slice's value with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}
