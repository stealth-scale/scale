/**
 * Renders a pie preset: the chart's figure, plot, empty state, legend and caption around recharts'
 * pie of the slices, largest first.
 *
 * @remarks
 *   The pie and the donut render this core with the hole they fix. The largest slice starts at 12
 *   o'clock and the slices run clockwise. A slice the legend hides leaves the pie, and each share
 *   is of the slices shown. The pie's own tab stop is off, so the chart's keyboard layer is its one
 *   tab stop. A slice's key travels to recharts as `name`, because recharts spreads each row into
 *   its sector's props.
 */

import { type ReactElement, type ReactNode } from "react";

import { LabelList, Pie, PieChart, Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { SHARE } from "#chart/recipe.ts";
import { slicesOf, valueOf } from "#polar/slices.ts";
import { type PieSlice, type PolarProps } from "#polar/types.ts";

/**
 * Message the chart renders without slices unless the preset states one.
 */
const EMPTY = "No data";

/**
 * Options a slice's share is written with: whole percentages.
 */
const SHARED: Intl.NumberFormatOptions = { maximumFractionDigits: 0, style: "percent" };

/**
 * Describes the props of the core: a pie's props, the content in its middle and the hole.
 */
export interface PolarCoreProps extends PolarProps {
  /**
   * Figure in the middle of the chart, such as the total.
   */
  readonly center?: ReactNode;

  /**
   * Words under the figure in the middle.
   */
  readonly centerLabel?: ReactNode;

  /**
   * Radius of the hole in recharts' terms, 0 for a whole pie.
   */
  readonly hole: number | string;
}

/**
 * Describes one sector recharts renders: its color, its key, its opacity and its value.
 */
interface Sector {
  /**
   * CSS value of the slice's color.
   */
  readonly fill: string;

  /**
   * Key of the slice, which recharts reports to the tooltip as the entry's name.
   */
  readonly name: string;

  /**
   * CSS value of the slice's opacity, faded while the legend points at another slice.
   */
  readonly opacity: string;

  /**
   * Size of the part.
   */
  readonly value: number;
}

/**
 * Returns a sector per slice the legend shows, in the slices' order.
 *
 * @param chart - The chart that resolves each slice's color, opacity and hiding.
 * @param slices - The slices, largest first.
 */
function sectorsOf(chart: Chart.ChartApi, slices: readonly PieSlice[]): Sector[] {
  return slices
    .filter((slice) => !chart.hidden(slice.key))
    .map((slice) => ({
      fill: chart.color(slice.key),
      name: slice.key,
      opacity: chart.opacity(slice.key),
      value: valueOf(slice),
    }));
}

/**
 * Returns a function that writes a sector's value as its share of the sectors shown.
 *
 * @remarks
 *   Recharts renders sectors and their labels only while the values sum to more than zero, so the
 *   total a share divides by is never zero.
 * @param chart - The chart whose locale the shares are written in.
 * @param sectors - The sectors shown.
 */
function sharesOf(chart: Chart.ChartApi, sectors: readonly Sector[]): (value: unknown) => string {
  const total = sectors.reduce((sum, sector) => sum + sector.value, 0);
  const percent = chart.formatNumber(SHARED);

  return (value) => percent(Number(value) / total);
}

/**
 * Describes what the recharts pie is built from.
 */
interface PieOptions {
  /**
   * Whether the slices animate in.
   */
  readonly animate: boolean;

  /**
   * Chart whose slices the pie renders.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Recharts elements rendered after the pie.
   */
  readonly children: ReactNode;

  /**
   * Index of the slice the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Radius of the hole in recharts' terms.
   */
  readonly hole: number | string;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Whether each slice's share is written on it.
   */
  readonly shares: boolean;

  /**
   * Slices, largest first, with the tail gathered.
   */
  readonly shown: readonly PieSlice[];

  /**
   * `Intl.NumberFormat` options the tooltip writes a value with.
   */
  readonly valueOptions: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns recharts' pie chart of the slices the legend shows, with the tooltip and the shares.
 *
 * @param options - The chart, the slices, the hole and the words.
 */
function pieOf(options: PieOptions): ReactElement {
  const { chart, defaultIndex, shares, shown } = options;
  const sectors = sectorsOf(chart, shown);

  return (
    <PieChart accessibilityLayer title={options.label}>
      <Tooltip
        content={<Chart.Tooltip formatValue={chart.formatNumber(options.valueOptions)} />}
        {...omitUndefined({ defaultIndex })}
      />
      <Pie
        data={sectors}
        dataKey="value"
        endAngle={-270}
        innerRadius={options.hole}
        isAnimationActive={options.animate ? "auto" : false}
        nameKey="name"
        rootTabIndex={-1}
        startAngle={90}
      >
        {shares ? (
          <LabelList
            className={SHARE}
            dataKey="value"
            formatter={sharesOf(chart, sectors)}
            position="inside"
          />
        ) : null}
      </Pie>
      {options.children}
    </PieChart>
  );
}

/**
 * Renders the figure around the pie, its legend and its caption.
 *
 * @param props - A pie's props, the content in its middle and the hole.
 */
export function Polar({
  animate = false,
  caption,
  center,
  centerLabel,
  children,
  defaultHiddenKeys,
  defaultIndex,
  empty = EMPTY,
  hiddenKeys,
  hole,
  label,
  legend = true,
  legendLabel,
  locale,
  maxSlices,
  onHiddenKeysChange,
  otherLabel,
  ratio = "square",
  shares = true,
  slices,
  valueOptions,
  ...root
}: PolarCoreProps): ReactElement {
  const shown = slicesOf(slices, maxSlices, otherLabel);
  const chart = Chart.useChart({
    data: shown,
    defaultHiddenKeys,
    hiddenKeys,
    locale,
    onHiddenKeysChange,
    series: shown,
  });
  const pie = { animate, chart, children, defaultIndex, hole, label, shares, shown, valueOptions };

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot {...omitUndefined({ center, centerLabel })}>{pieOf(pie)}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && shown.length > 0 ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
