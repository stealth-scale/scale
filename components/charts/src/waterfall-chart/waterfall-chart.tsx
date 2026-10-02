/**
 * Renders a waterfall chart: the steps that take a running total from one number to another, each
 * as a bar floating on the total before it.
 *
 * @remarks
 *   A change floats from the running total before it to the total after it, rising in the success
 *   palette's chart color and falling in the error's, so direction reads by position and by color.
 *   A total rises from zero in the neutral palette's chart color. A dashed connector joins each bar
 *   to the next at the running total, so the eye follows the sequence. The chart writes each bar's
 *   signed change or total above the bar's upper edge, because a floating bar's height reads off
 *   no axis, and keeps 20px free above the tallest bar for it. The values show while the widest
 *   fits a step and hide together otherwise. The steps keep their order, because the order is
 *   what happened.
 */

import { type ReactElement, type ReactNode } from "react";

import { Bar, BarChart, CartesianGrid, ReferenceLine, Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { axesOf } from "#cartesian/axes.tsx";
import * as Chart from "#chart/index.ts";
import { CONNECTOR } from "#chart/recipe.ts";
import { type RootProps } from "#chart/root.tsx";
import { type WaterfallBar, waterfallBars, type WaterfallStep } from "#waterfall-chart/bars.ts";
import { Values } from "#waterfall-chart/values.tsx";

/**
 * Key of the chart's one series, the field each row's floating span is in.
 */
const SPAN = "span";

/**
 * Message the chart renders without steps unless it states one.
 */
const EMPTY = "No data";

/**
 * Dash pattern of a connector: 4px dashes, 4px apart.
 */
const DASH = "4 4";

/**
 * Radius of every corner of a bar, in pixels, because a floating bar has two free ends.
 */
const RADIUS = 2;

/**
 * Room in pixels above the tallest bar for its value: a line of text and recharts' 5px offset.
 */
const HEADROOM = 20;

/**
 * Maps a step's direction to its bar's color.
 */
const FILLS: Readonly<Record<WaterfallBar["direction"], string>> = {
  down: Chart.colorOf("error"),
  total: Chart.colorOf("neutral"),
  up: Chart.colorOf("success"),
};

/**
 * Describes one row of the chart: a bar and its color.
 */
interface WaterfallRow extends Omit<WaterfallBar, "key"> {
  /**
   * CSS value of the bar's color, which recharts passes to the bar's rectangle.
   */
  readonly fill: string;
}

/**
 * Describes the props of a waterfall chart: the steps, the words, the switches and the figure's
 * props.
 */
export interface WaterfallChartProps extends Omit<RootProps, "chart" | "children" | "grid"> {
  /**
   * Whether the bars animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the bars, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Whether dashed connectors join each bar to the next at the running total.
   */
  readonly connectors?: boolean | undefined;

  /**
   * Index of the step the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no steps.
   */
  readonly empty?: ReactNode;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Revenue bridge for September".
   */
  readonly label: string;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Steps, in the order they happened.
   */
  readonly steps: readonly WaterfallStep[];

  /**
   * Name of the values in the tooltip.
   */
  readonly valueLabel?: ReactNode;

  /**
   * Whether the chart writes each bar's signed change or total above the bar.
   */
  readonly valueLabels?: boolean | undefined;

  /**
   * `Intl.NumberFormat` options the ticks, the tooltip and the bars' values are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Returns a row per bar, with the bar's color.
 */
function rowsOf(bars: readonly WaterfallBar[]): WaterfallRow[] {
  const rows: WaterfallRow[] = [];

  for (const { key: _key, ...bar } of bars) rows.push({ ...bar, fill: FILLS[bar.direction] });

  return rows;
}

/**
 * Returns a connector per pair of neighbouring bars, from the first bar's end to the next bar at
 * the running total.
 */
function connectorsOf(rows: readonly WaterfallRow[]): ReactElement[] {
  return rows.flatMap((row, index) => {
    const next = rows[index + 1];

    return next === undefined
      ? []
      : [
          <ReferenceLine
            className={CONNECTOR}
            ifOverflow="visible"
            key={row.label}
            segment={[
              { x: row.label, y: row.end },
              { x: next.label, y: row.end },
            ]}
            strokeDasharray={DASH}
          />,
        ];
  });
}

/**
 * Describes what the recharts chart is built from.
 */
interface PlotOptions extends Pick<
  WaterfallChartProps,
  "children" | "defaultIndex" | "label" | "valueOptions"
> {
  /**
   * Whether the bars animate in.
   */
  readonly animate: boolean;

  /**
   * Chart whose rows the bars render.
   */
  readonly chart: Chart.ChartApi<WaterfallRow>;

  /**
   * Whether connectors join the bars.
   */
  readonly connectors: boolean;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid: boolean;

  /**
   * Whether the chart writes each bar's value above the bar.
   */
  readonly valueLabels: boolean;
}

/**
 * Returns the row a tooltip entry was read from.
 */
function rowAt(entry: Chart.TooltipEntry): WaterfallRow {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the row its bar was rendered from
  return entry.payload as WaterfallRow;
}

/**
 * Returns recharts' bar chart of the rows: the grid, the axes, the tooltip, the connectors, the
 * floating bars with their values, and the caller's children.
 *
 * @param options - The chart, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { chart, defaultIndex, valueOptions } = options;
  const total = chart.formatNumber(valueOptions);
  const signed = chart.formatNumber({ ...valueOptions, signDisplay: "exceptZero" });

  /**
   * Returns a row's note: its total, or its change with a sign.
   */
  const noteOf = (row: WaterfallRow): string =>
    (row.direction === "total" ? total : signed)(row.change);
  const formats = { end: total, label: undefined, tick: total, value: total };
  const headroom = options.valueLabels ? HEADROOM : undefined;
  const widest = Math.max(0, ...chart.data.map((row) => noteOf(row).length));

  return (
    <BarChart accessibilityLayer data={chart.data} title={options.label}>
      {options.grid ? <CartesianGrid vertical={false} /> : null}
      {axesOf({
        categoryKey: "label",
        direction: "vertical",
        formats,
        headroom,
        valueDomain: undefined,
      })}
      <Tooltip
        content={
          <Chart.Tooltip
            entryColor={(entry) => rowAt(entry).fill}
            formatValue={(_value, entry) => noteOf(rowAt(entry))}
          />
        }
        {...omitUndefined({ defaultIndex })}
      />
      {options.connectors ? connectorsOf(chart.data) : null}
      <Bar dataKey={SPAN} isAnimationActive={options.animate ? "auto" : false} radius={RADIUS}>
        {options.valueLabels ? (
          <Values count={chart.data.length} noteOf={noteOf} widest={widest} />
        ) : null}
      </Bar>
      {options.children}
    </BarChart>
  );
}

/**
 * Renders the chart's figure around the floating bars, their connectors and their values.
 *
 * @param props - The steps, the words, the switches and the figure's props.
 */
export function WaterfallChart({
  animate = false,
  caption,
  children,
  connectors = true,
  defaultIndex,
  empty = EMPTY,
  grid = true,
  label,
  locale,
  steps,
  valueLabel = "Amount",
  valueLabels = true,
  valueOptions,
  ...root
}: WaterfallChartProps): ReactElement {
  const chart = Chart.useChart({
    data: rowsOf(waterfallBars(steps)),
    locale,
    series: [{ key: SPAN, label: valueLabel }],
  });
  const plot = { animate, chart, children, connectors, defaultIndex, grid, label, valueLabels };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>{plotOf({ ...plot, valueOptions })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
