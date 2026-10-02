/**
 * Renders a radial bar chart: each measure as a ring read against the value of a full turn, the
 * first ring outermost.
 *
 * @remarks
 *   A ring's length is its angle times its radius, so the same value renders a longer arc further
 *   out. The chart shows each measure against its own track, such as the use of a quota, and a bar
 *   chart compares measures with each other. `max` is the value of a full turn, such as the quota.
 *   Without it the largest value shown closes its track. A ring past `max` closes its track, and a
 *   ring below zero renders no arc. The legend writes each ring's value beside its name, because an
 *   arc is not read for a quantity. The tooltip writes the ring's name and value, and the arrows
 *   walk the rings from the outermost.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart as RechartsRadialBarChart,
  Tooltip,
} from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions } from "#chart/use-chart.ts";
import { valueOf } from "#polar/slices.ts";
import { ValueLabel } from "#polar/value-label.tsx";
import { ringBarOf } from "#radial-bar-chart/ring-bar.tsx";
import { domainOf, type RadialBarDatum, ringOf, ringsOf } from "#radial-bar-chart/rings.ts";

/**
 * Message the chart renders without bars unless it states one.
 */
const EMPTY = "No data";

/**
 * Radius of the hole in the middle, a share of the largest circle the plot fits.
 */
const HOLE = "30%";

/**
 * Angle the rings start at unless stated: 12 o'clock.
 */
const START = 90;

/**
 * Angle the rings end at unless stated: a full turn clockwise from 12 o'clock.
 */
const END = -270;

/**
 * Heading of the tooltip: none, because the row names the ring.
 */
const HEADLESS = (): string => "";

/**
 * Describes the props of a radial bar chart: the bars, the scale, the words, the switches and the
 * figure's props.
 */
export interface RadialBarChartProps
  extends
    Omit<ChartOptions<RadialBarDatum>, "data" | "series">,
    Omit<RootProps, "chart" | "children"> {
  /**
   * Whether the rings grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Bars of the chart, one ring each, the outermost first.
   */
  readonly bars: readonly RadialBarDatum[];

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the rings.
   */
  readonly children?: ReactNode;

  /**
   * Index of the bar the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no bars.
   */
  readonly empty?: ReactNode;

  /**
   * Angle the rings end at, in recharts' degrees, where clockwise is negative. -270 unless stated.
   */
  readonly endAngle?: number | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Plan usage".
   */
  readonly label: string;

  /**
   * Whether the legend renders below the plot. It renders while the chart has bars unless stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Value of a full turn, such as a quota, a target or a capacity. The largest value shown unless
   * stated.
   */
  readonly max?: number | undefined;

  /**
   * Angle the rings start at, in recharts' degrees, where 90 is 12 o'clock. 90 unless stated.
   */
  readonly startAngle?: number | undefined;

  /**
   * Whether each ring's remainder renders as a track behind it.
   */
  readonly track?: boolean | undefined;

  /**
   * `Intl.NumberFormat` options the legend's and the tooltip's values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether the legend writes each ring's value beside its name.
   */
  readonly values?: boolean | undefined;
}

/**
 * Describes what the recharts radial bar chart is built from.
 */
interface PlotOptions {
  /**
   * Whether the rings grow in.
   */
  readonly animate: boolean;

  /**
   * Bars in the caller's order.
   */
  readonly bars: readonly RadialBarDatum[];

  /**
   * Chart whose bars the rings render.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Recharts elements rendered after the rings.
   */
  readonly children: ReactNode;

  /**
   * Index of the bar the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Angle the rings end at.
   */
  readonly endAngle: number;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Value of a full turn the caller states.
   */
  readonly max: number | undefined;

  /**
   * Angle the rings start at.
   */
  readonly startAngle: number;

  /**
   * Whether each ring's track renders.
   */
  readonly track: boolean;

  /**
   * `Intl.NumberFormat` options the tooltip's value is written with.
   */
  readonly valueOptions: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns recharts' radial bar chart: the angle axis over the value of a full turn, the reversed
 * radius axis that puts the first bar outermost, the tooltip, the rings and the caller's children.
 *
 * @param options - The chart, the bars, the angles, the scale and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { bars, chart, defaultIndex } = options;
  const rings = ringsOf(chart, bars, options.max);
  const format = chart.formatNumber(options.valueOptions);

  /**
   * Returns the name of the ring an entry was read from.
   */
  const nameOf = (entry: Chart.TooltipEntry): ReactNode => {
    const bar = bars.find((each) => each.key === ringOf(entry).name);

    return bar?.label ?? bar?.key;
  };

  /**
   * Writes the value of the ring an entry was read from, which a ring past `max` renders as a
   * full turn.
   */
  const valued = (_turn: unknown, entry: Chart.TooltipEntry): string =>
    format(ringOf(entry).measure);

  return (
    <RechartsRadialBarChart
      accessibilityLayer
      data={rings}
      endAngle={options.endAngle}
      innerRadius={HOLE}
      outerRadius="100%"
      startAngle={options.startAngle}
      title={options.label}
    >
      <PolarAngleAxis
        axisLine={false}
        domain={domainOf(rings, options.max)}
        tick={false}
        tickLine={false}
        type="number"
      />
      <PolarRadiusAxis axisLine={false} dataKey="name" reversed tick={false} type="category" />
      <Tooltip
        content={
          <Chart.Tooltip
            entryColor={(entry) => ringOf(entry).fill}
            formatValue={valued}
            headingOf={HEADLESS}
            nameOf={nameOf}
          />
        }
        cursor={false}
        {...omitUndefined({ defaultIndex })}
      />
      {ringBarOf(options)}
      {options.children}
    </RechartsRadialBarChart>
  );
}

/**
 * Splits the props into the plot's and the figure's.
 *
 * @param props - The chart's props past the bars, the words and the legend.
 */
function split({
  animate = false,
  children,
  defaultIndex,
  endAngle = END,
  label,
  max,
  startAngle = START,
  track = true,
  ...root
}: Omit<
  RadialBarChartProps,
  | "bars"
  | "caption"
  | "defaultHiddenKeys"
  | "empty"
  | "hiddenKeys"
  | "legend"
  | "legendLabel"
  | "locale"
  | "onHiddenKeysChange"
  | "valueOptions"
  | "values"
>): [Omit<PlotOptions, "bars" | "chart" | "valueOptions">, Omit<RootProps, "chart" | "children">] {
  return [{ animate, children, defaultIndex, endAngle, label, max, startAngle, track }, root];
}

/**
 * Renders the chart's figure around the rings, the legend and the caption.
 *
 * @param props - The bars, the scale, the words, the switches and the figure's props.
 */
export function RadialBarChart({
  bars,
  caption,
  defaultHiddenKeys,
  empty = EMPTY,
  hiddenKeys,
  legend = true,
  legendLabel,
  locale,
  onHiddenKeysChange,
  ratio = "square",
  valueOptions,
  values = true,
  ...rest
}: RadialBarChartProps): ReactElement {
  const [plot, root] = split(rest);
  const series = bars.map((bar) => ({
    color: bar.color,
    key: bar.key,
    label: values ? (
      <ValueLabel label={bar.label ?? bar.key} options={valueOptions} value={valueOf(bar)} />
    ) : (
      bar.label
    ),
  }));
  const options = { defaultHiddenKeys, hiddenKeys, locale, onHiddenKeysChange, series };
  const chart = Chart.useChart({ data: [...bars], ...options });

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot>{plotOf({ ...plot, bars, chart, valueOptions })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && bars.length > 0 ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
