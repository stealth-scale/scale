/**
 * Describes a scatter plot's series and props.
 */

import { type ReactNode } from "react";

import { type YAxisProps } from "recharts";

import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions, type SeriesOptions } from "#chart/use-chart.ts";
import { type Quadrants } from "#scatter-plot/quadrants.ts";

/**
 * Describes the figure's props: the props of `Chart.Root` a scatter passes on.
 */
export type ScatterFigure = Omit<RootProps, "chart" | "children" | "grid">;

/**
 * Describes a series of a scatter: the kit's series and its own points.
 *
 * @typeParam Point - One point of the series.
 */
export interface ScatterSeries<Point> extends SeriesOptions {
  /**
   * Points of the series, each with its own x and y.
   */
  readonly points: readonly Point[];
}

/**
 * Describes the props of a scatter plot: the series and their points, the axes, the size of a
 * point, the quadrants, the words, the switches and the figure's props.
 *
 * @typeParam Point - One point of a series.
 */
export interface ScatterPlotProps<Point>
  extends Omit<ChartOptions<Point>, "data" | "series">, ScatterFigure {
  /**
   * Whether the points animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the points, such as a `RegressionOverlay`.
   */
  readonly children?: ReactNode;

  /**
   * Index in the first series' points of the point the tooltip shows when the chart first renders.
   * No tooltip shows at first unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while no series has a point.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the ticks of both axes.
   */
  readonly grid?: boolean | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Deal size by sales cycle".
   */
  readonly label: string;

  /**
   * Field of each point whose words are written beside it and head its tooltip, such as a vendor's
   * name.
   */
  readonly labelKey?: Extract<keyof Point, string> | undefined;

  /**
   * Whether the legend renders below the plot. It renders while two or more series have points
   * unless stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Quadrants the plot divides into: two dashed lines, the name of each quadrant in its corner,
   * and the quadrant of each point after its name in the tooltip.
   */
  readonly quadrants?: Quadrants | undefined;

  /**
   * Series the chart plots, in the order the legend lists them.
   */
  readonly series: ReadonlyArray<ScatterSeries<Point>>;

  /**
   * Area of every point in square pixels, while no field sizes the points.
   */
  readonly size?: number | undefined;

  /**
   * Field of each point its area reads, for a bubble chart.
   */
  readonly sizeKey?: Extract<keyof Point, string> | undefined;

  /**
   * Name of the size's field, which the tooltip writes beside the value.
   */
  readonly sizeLabel?: string | undefined;

  /**
   * `Intl.NumberFormat` options the tooltip writes the size with.
   */
  readonly sizeOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Smallest and largest area of a sized point, in square pixels.
   */
  readonly sizeRange?: readonly [number, number] | undefined;

  /**
   * Domain of the x axis in recharts' terms. Recharts' rounded domain unless stated.
   */
  readonly xDomain?: YAxisProps["domain"];

  /**
   * Words for the x axis' two ends, the low end's first, such as "Rare" and "Certain", written in
   * place of its ticks. The axis then spans `xDomain`, 0 to 1 unless it states two numbers.
   */
  readonly xEnds?: readonly [string, string] | undefined;

  /**
   * Field of each point the x axis reads.
   */
  readonly xKey: Extract<keyof Point, string>;

  /**
   * Title of the x axis, which the tooltip repeats beside the x value.
   */
  readonly xLabel: string;

  /**
   * `Intl.NumberFormat` options the x ticks and the tooltip's x value are written with.
   */
  readonly xOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Domain of the y axis in recharts' terms. Recharts' rounded domain unless stated.
   */
  readonly yDomain?: YAxisProps["domain"];

  /**
   * Words for the y axis' two ends, the low end's first, written in place of its ticks. The axis
   * then spans `yDomain`, 0 to 1 unless it states two numbers.
   */
  readonly yEnds?: readonly [string, string] | undefined;

  /**
   * Field of each point the y axis reads.
   */
  readonly yKey: Extract<keyof Point, string>;

  /**
   * Title of the y axis, which the tooltip repeats beside the y value.
   */
  readonly yLabel: string;

  /**
   * `Intl.NumberFormat` options the y ticks and the tooltip's y value are written with.
   */
  readonly yOptions?: Intl.NumberFormatOptions | undefined;
}
