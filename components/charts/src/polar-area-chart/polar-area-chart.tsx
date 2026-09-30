/**
 * Renders a polar area chart, a rose: every category of a cycle takes the same angle, and each
 * wedge's area follows its value.
 *
 * @remarks
 *   The wedges run clockwise from 12 o'clock in the slices' order, so a rose of twelve months reads
 *   like a clock face. A wedge's radius is √(value / max) of the full radius, so a wedge worth
 *   twice another covers twice the area. A rose suits categories that wrap, such as hours, months
 *   or compass points, and a bar chart compares values on their own. Every wedge takes one palette
 *   unless its slice states one, and its fill rises from 0.45 to 1 of the color with its value. The
 *   chart writes the names on one circle around the rose, each centred on its wedge. The legend
 *   writes each value beside its name, because a radius is not read for a quantity.
 */

import { type ReactElement, type ReactNode } from "react";

import { Pie, PieChart, PolarAngleAxis, Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions } from "#chart/use-chart.ts";
import { type Wedge, wedgeOf, wedgesOf } from "#polar-area-chart/wedges.ts";
import { valueOf } from "#polar/slices.ts";
import { type PieSlice } from "#polar/types.ts";
import { ValueLabel } from "#polar/value-label.tsx";

/**
 * Message the chart renders without slices unless it states one.
 */
const EMPTY = "No data";

/**
 * Radius of a wedge at the value of a full radius while the names render, in percent of the
 * largest circle the plot fits, which leaves the names room around the rose.
 *
 * @remarks
 *   Names of five characters, such as 00:00, clear the plot by 10px in a room 20rem wide.
 */
const RADIUS = 76;

/**
 * Radius of a wedge at the value of a full radius without names: the whole circle.
 */
const WHOLE = 100;

/**
 * Angle the first wedge starts at: 12 o'clock.
 */
const START = 90;

/**
 * Angle the last wedge ends at: a full turn clockwise from 12 o'clock.
 */
const END = -270;

/**
 * Heading of the tooltip: none, because the row names the wedge.
 */
const HEADLESS = (): string => "";

/**
 * Palette every wedge takes unless stated: the theme's first series color.
 */
const FIRST: Chart.ChartColor = "series.1";

/**
 * Describes the props of a polar area chart: the slices, the scale, the words, the switches and
 * the figure's props.
 */
export interface PolarAreaChartProps
  extends
    Omit<ChartOptions<PieSlice>, "data" | "series">,
    Omit<RootProps, "chart" | "children" | "color"> {
  /**
   * Whether the wedges grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the wedges.
   */
  readonly children?: ReactNode;

  /**
   * Palette every wedge takes its color from, unless its slice states one. The theme's first
   * series color unless stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Index of the slice the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no slices.
   */
  readonly empty?: ReactNode;

  /**
   * Accessible name of the chart's keyboard layer, such as "Requests by hour".
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
   * Value of a full radius, such as a capacity. The largest value shown unless stated.
   */
  readonly max?: number | undefined;

  /**
   * Whether each slice's name renders around the rose.
   */
  readonly names?: boolean | undefined;

  /**
   * Categories of the cycle in their order, such as hours or months, the first at 12 o'clock.
   */
  readonly slices: readonly PieSlice[];

  /**
   * `Intl.NumberFormat` options the legend's and the tooltip's values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether the legend writes each slice's value beside its name.
   */
  readonly values?: boolean | undefined;
}

/**
 * Describes what the recharts pie chart is built from.
 */
interface PlotOptions {
  /**
   * Whether the wedges grow in.
   */
  readonly animate: boolean;

  /**
   * Chart whose slices the wedges render.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Recharts elements rendered after the wedges.
   */
  readonly children: ReactNode;

  /**
   * Index of the slice the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Value of a full radius the caller states.
   */
  readonly max: number | undefined;

  /**
   * Whether the names render around the rose.
   */
  readonly names: boolean;

  /**
   * Slices in their cyclic order.
   */
  readonly slices: readonly PieSlice[];

  /**
   * `Intl.NumberFormat` options the tooltip's value is written with.
   */
  readonly valueOptions: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns recharts' pie chart: the names on the angle axis, the tooltip, the wedges and the
 * caller's children.
 *
 * @remarks
 *   Recharts puts a category of the angle axis at the start of its wedge, so the chart's angles run
 *   half a wedge ahead of the pie's and each name centres on its wedge.
 * @param options - The chart, the slices, the scale and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { chart, defaultIndex, slices } = options;
  const half = 180 / Math.max(slices.length, 1);
  const radius = options.names ? RADIUS : WHOLE;
  const format = chart.formatNumber(options.valueOptions);

  /**
   * Returns the slice a key names.
   */
  const sliceOf = (key: unknown): PieSlice | undefined => slices.find((each) => each.key === key);

  /**
   * Writes a slice's name on the angle axis: its label where it is text, else its key.
   */
  const titled = (key: unknown): string => {
    const label = sliceOf(key)?.label;

    return typeof label === "string" ? label : String(key);
  };

  /**
   * Returns the name of the slice an entry was read from.
   */
  const nameOf = (entry: Chart.TooltipEntry): ReactNode => {
    const slice = sliceOf(wedgeOf(entry).name);

    return slice?.label ?? slice?.key;
  };

  /**
   * Writes the value of the slice an entry was read from, where recharts passes the angle.
   */
  const valued = (_angle: unknown, entry: Chart.TooltipEntry): string =>
    format(wedgeOf(entry).measure);

  return (
    <PieChart
      accessibilityLayer
      endAngle={END - half}
      outerRadius={`${String(radius)}%`}
      startAngle={START - half}
      title={options.label}
    >
      {options.names ? (
        <PolarAngleAxis
          axisLine={false}
          dataKey="name"
          tickFormatter={titled}
          tickLine={false}
          type="category"
        />
      ) : null}
      <Tooltip
        content={<Chart.Tooltip formatValue={valued} headingOf={HEADLESS} nameOf={nameOf} />}
        {...omitUndefined({ defaultIndex })}
      />
      <Pie
        data={wedgesOf(chart, slices, options.max)}
        dataKey="angle"
        endAngle={END}
        isAnimationActive={options.animate ? "auto" : false}
        nameKey="name"
        outerRadius={(wedge: Wedge) => `${String(wedge.extent * radius)}%`}
        rootTabIndex={-1}
        startAngle={START}
      />
      {options.children}
    </PieChart>
  );
}

/**
 * Splits the props into the plot's and the figure's.
 *
 * @param props - The chart's props past the slices, the words and the legend.
 */
function split({
  animate = false,
  children,
  defaultIndex,
  label,
  max,
  names = true,
  ...root
}: Omit<
  PolarAreaChartProps,
  | "caption"
  | "color"
  | "defaultHiddenKeys"
  | "empty"
  | "hiddenKeys"
  | "legend"
  | "legendLabel"
  | "locale"
  | "onHiddenKeysChange"
  | "slices"
  | "valueOptions"
  | "values"
>): [
  Omit<PlotOptions, "chart" | "slices" | "valueOptions">,
  Omit<RootProps, "chart" | "children">,
] {
  return [{ animate, children, defaultIndex, label, max, names }, root];
}

/**
 * Renders the chart's figure around the wedges, the legend and the caption.
 *
 * @param props - The slices, the scale, the words, the switches and the figure's props.
 */
export function PolarAreaChart({
  caption,
  color = FIRST,
  defaultHiddenKeys,
  empty = EMPTY,
  hiddenKeys,
  legend = true,
  legendLabel,
  locale,
  onHiddenKeysChange,
  ratio = "square",
  slices,
  valueOptions,
  values = true,
  ...rest
}: PolarAreaChartProps): ReactElement {
  const [plot, root] = split(rest);
  const series = slices.map((slice) => ({
    color: slice.color ?? color,
    key: slice.key,
    label: values ? (
      <ValueLabel label={slice.label ?? slice.key} options={valueOptions} value={valueOf(slice)} />
    ) : (
      slice.label
    ),
  }));
  const options = { defaultHiddenKeys, hiddenKeys, locale, onHiddenKeysChange, series };
  const chart = Chart.useChart({ data: [...slices], ...options });

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot>{plotOf({ ...plot, chart, slices, valueOptions })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && slices.length > 0 ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
