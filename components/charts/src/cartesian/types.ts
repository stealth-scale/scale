/**
 * Describes the props every cartesian preset takes: the rows and the series, the chart's words, the
 * axes, and the figure's props.
 */

import { type ReactNode } from "react";

import { type YAxisProps } from "recharts";

import { type Annotation } from "#cartesian/annotations.ts";
import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions, type SeriesOptions } from "#chart/use-chart.ts";
import { type GaugeZone } from "#gauge-chart/bands.ts";

/**
 * Describes a series of a cartesian preset: the kit's series, and whether its line is dashed.
 */
export interface CartesianSeries extends SeriesOptions {
  /**
   * Whether the series' line renders dashed, as a target or a projection does. A series with
   * `previousOf` renders dashed unless stated.
   */
  readonly dashed?: boolean | undefined;

  /**
   * Key of the series this series is the earlier period of, such as last week's revenue for this
   * week's. The series takes the neutral palette unless it states a color, and the tooltip writes
   * the change from it after the other series' value.
   */
  readonly previousOf?: string | undefined;
}

/**
 * Describes a series of a bar chart: the preset's series, and the target each bar is measured
 * against.
 */
export interface BarSeries extends CartesianSeries {
  /**
   * Field of each row the series' target reads, which a tick across the row's bar marks. A row
   * without a finite number in it renders no tick.
   */
  readonly target?: string | undefined;
}

/**
 * Describes whether a line runs straight between two points or is smoothed through them.
 */
export type Curve = "linear" | "monotone";

/**
 * Describes the mark a series renders as.
 */
export type Mark = "area" | "bar" | "line";

/**
 * Describes the value axis a series reads: the one at the plot's start edge or the one at its end
 * edge.
 */
export type ValueAxis = "end" | "start";

/**
 * Describes a series of a combo chart: the preset's series, the mark it renders as and the value
 * axis it reads.
 */
export interface ComboSeries extends CartesianSeries {
  /**
   * Value axis the series reads. The start axis unless stated. An end axis renders while a series
   * reads it.
   */
  readonly axis?: undefined | ValueAxis;

  /**
   * Mark the series renders as.
   */
  readonly mark: Mark;
}

/**
 * Describes a band: a series plotted as the area between two fields of each row, such as the low
 * and high ends of a forecast.
 */
export interface RangeBand extends SeriesOptions {
  /**
   * Field of each row the band's upper edge reads.
   */
  readonly high: string;

  /**
   * Field of each row the band's lower edge reads.
   */
  readonly low: string;
}

/**
 * Describes a series as the core plots it: a preset's series, with the mark, the value axis, the
 * band or the target a preset states for it.
 */
export interface CoreSeries extends BarSeries {
  /**
   * Value axis the series reads. The start axis unless stated.
   */
  readonly axis?: undefined | ValueAxis;

  /**
   * Fields of the band the series plots, in place of a line through one field.
   */
  readonly band?: Pick<RangeBand, "high" | "low"> | undefined;

  /**
   * Mark the series renders as. The shape's mark unless stated.
   */
  readonly mark?: Mark | undefined;
}

/**
 * Describes what a preset fixes: its mark, how its series stack, where its values run and the path
 * of its lines.
 */
export interface Shape {
  /**
   * Path of a line or an area's edge between two points. A step is flat from each point to the
   * next.
   */
  readonly curve: "step" | Curve;

  /**
   * Direction the value axis runs in: up for an upright chart, across for bars on their side.
   */
  readonly direction: "horizontal" | "vertical";

  /**
   * Mark each series renders as, or `mixed` where each series states its own, a line unless
   * stated.
   */
  readonly mark: "mixed" | Mark;

  /**
   * Stacking of the series: none, summed, summed to 100%, or summed about a moving baseline, which
   * `wiggle` keeps as still as it can and `silhouette` centres.
   */
  readonly stack: "none" | "percent" | "silhouette" | "stacked" | "wiggle";
}

/**
 * Describes the props a bar chart adds to a preset's: the target's name and the zones of the value
 * axis, which together make each bar a bullet graph.
 */
export interface BulletProps {
  /**
   * Name of a bar's target in the tooltip and in the key. "Target" unless stated.
   */
  readonly targetLabel?: string | undefined;

  /**
   * Zones of the value axis, such as poor, fair and good, which fill each bar's row behind a
   * measure 42% of its thickness. The zones resolve against the value axis' domain, which
   * `valueDomain` states. None unless stated.
   */
  readonly zones?: readonly GaugeZone[] | undefined;
}

/**
 * Describes the props every cartesian preset takes.
 *
 * @remarks
 *   The figure's props leave out `grid`, the style prop, because a preset takes `grid` as the
 *   switch of its grid lines.
 * @typeParam Row - One row of the data.
 */
export interface CartesianProps<Row>
  extends Omit<ChartOptions<Row>, "series">, Omit<RootProps, "chart" | "children" | "grid"> {
  /**
   * Whether the marks animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Marks pinned to the data, a moment, a period or a point each, which the tooltip lists at their
   * category. None unless stated.
   */
  readonly annotations?: readonly Annotation[] | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Field of each row the category axis reads, such as a day or a plan.
   */
  readonly categoryKey: Extract<keyof Row, string>;

  /**
   * Recharts elements rendered inside the chart after the marks, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Index in `data` of the row the tooltip shows when the chart first renders, until the pointer
   * or a key moves it. No tooltip shows at first unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no rows.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Revenue per day".
   */
  readonly label: string;

  /**
   * `Intl.DateTimeFormat` options the category ticks and the tooltip's heading are written with,
   * for a time axis. The category as it is unless stated.
   */
  readonly labelOptions?: Intl.DateTimeFormatOptions | undefined;

  /**
   * Whether the legend renders below the plot. It renders while two or more series have rows
   * unless stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Series the chart plots, in the order the legend lists them.
   */
  readonly series: readonly CartesianSeries[];

  /**
   * Domain of the value axis in recharts' terms, such as `[0, 100]`. From zero unless stated.
   */
  readonly valueDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the value ticks and the tooltip's values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Describes the props of the core: a preset's props, the series as the core plots them, the shape
 * the preset fixes, the end axis, and a bar chart's targets and zones.
 *
 * @typeParam Row - One row of the data.
 */
export interface CartesianCoreProps<Row> extends BulletProps, Omit<CartesianProps<Row>, "series"> {
  /**
   * Domain of the end axis in recharts' terms. From zero unless stated.
   */
  readonly endDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the end axis' ticks and its series' values are written with.
   */
  readonly endOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Series the chart plots, with the mark, the value axis or the band a preset states for each.
   */
  readonly series: readonly CoreSeries[];

  /**
   * Shape the preset fixes: its mark, its stack, its direction and its curve.
   */
  readonly shape: Shape;

  /**
   * Keys of the series in the order their marks render, the bottom of a stack first. The series'
   * order unless stated.
   */
  readonly stackOrder?: readonly string[] | undefined;
}
