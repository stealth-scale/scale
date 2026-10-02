/**
 * Renders a candlestick chart: each period's open, high, low and close as a body inside a wick,
 * colored by whether the period closed above or below its open.
 *
 * @remarks
 *   The category axis is ordinal: the periods are spaced evenly in the rows' order, because a time
 *   axis would leave the hours a market is closed as empty room. The value axis steps by 1, 2, 2.5
 *   or 5 times a power of ten around the prices and leaves zero out, because a price is read for
 *   its movement. A rising candle takes the success palette's chart color, a falling one the
 *   error's and a flat one the neutral's. The tooltip writes the four prices and the change,
 *   signed, with its percentage. The key under the plot names the colors and the parts.
 */

import { type ReactElement, type ReactNode } from "react";

import { type YAxisProps } from "recharts";

import { CandleKey } from "#candlestick-chart/candle-key.tsx";
import { CandleShape } from "#candlestick-chart/candle-shape.tsx";
import { candlesOf } from "#candlestick-chart/candles.ts";
import { type CandleFormats, type CandleWords, factsOf } from "#candlestick-chart/words.ts";
import { RANGE, rangedPlotOf } from "#cartesian/ranged.tsx";
import * as Chart from "#chart/index.ts";

/**
 * Message the chart renders without a period to render unless it states one.
 */
const EMPTY = "No data";

/**
 * Widest a candle renders in pixels, however wide its band.
 */
const WIDEST = 28;

/**
 * `Intl.NumberFormat` options of a change's percentage: two decimals with its sign.
 */
const PERCENT: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: "exceptZero",
  style: "percent",
};

/**
 * Describes the props of a candlestick chart: the rows, the words, the switches and the figure's
 * props.
 *
 * @typeParam Row - One row of the data, with `open`, `high`, `low` and `close`.
 */
export interface CandlestickChartProps<Row extends object> extends Omit<
  Chart.RootProps,
  "chart" | "children" | "grid"
> {
  /**
   * Whether the candles grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Name of the body in the key.
   */
  readonly bodyLabel?: ReactNode;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Field of each row the category axis reads, such as a trading day.
   */
  readonly categoryKey: Extract<keyof Row, string>;

  /**
   * Name of the change in the tooltip.
   */
  readonly changeLabel?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the candles, such as a `ReferenceLine`.
   */
  readonly children?: ReactNode;

  /**
   * Name of the closing price in the tooltip.
   */
  readonly closeLabel?: ReactNode;

  /**
   * Rows of the periods, each with `open`, `high`, `low` and `close`. A row without a finite
   * number in each is left out.
   */
  readonly data: readonly Row[];

  /**
   * Index of the period the tooltip shows when the chart first renders. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Name of a falling candle's color in the key.
   */
  readonly downLabel?: ReactNode;

  /**
   * Message the chart renders in the plot's place while no row has a candle.
   */
  readonly empty?: ReactNode;

  /**
   * Name of a flat candle's color in the key, which renders while the chart has a flat candle.
   */
  readonly flatLabel?: ReactNode;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid?: boolean | undefined;

  /**
   * Name of the highest price in the tooltip.
   */
  readonly highLabel?: ReactNode;

  /**
   * Accessible name of the chart's keyboard layer, such as "Daily prices of ACME".
   */
  readonly label: string;

  /**
   * `Intl.DateTimeFormat` options the category ticks and the tooltip's heading are written with,
   * for periods given as dates. The category as it is unless stated.
   */
  readonly labelOptions?: Intl.DateTimeFormatOptions | undefined;

  /**
   * Whether the key naming the colors and the parts renders below the plot.
   */
  readonly legend?: boolean | undefined;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Name of the lowest price in the tooltip.
   */
  readonly lowLabel?: ReactNode;

  /**
   * Name of the opening price in the tooltip.
   */
  readonly openLabel?: ReactNode;

  /**
   * Name of a rising candle's color in the key.
   */
  readonly upLabel?: ReactNode;

  /**
   * Domain of the value axis in recharts' terms. Rounded around the prices unless stated.
   */
  readonly valueDomain?: YAxisProps["domain"];

  /**
   * `Intl.NumberFormat` options the value ticks, the prices and the change are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Name of the wick in the key.
   */
  readonly wickLabel?: ReactNode;
}

/**
 * Describes the props of the figure a candlestick chart renders in.
 */
type FigureProps = Omit<Chart.RootProps, "chart" | "children" | "grid">;

/**
 * Describes the props that name a candlestick chart's prices and parts.
 */
type LabelProps = Pick<
  CandlestickChartProps<object>,
  | "bodyLabel"
  | "changeLabel"
  | "closeLabel"
  | "downLabel"
  | "flatLabel"
  | "highLabel"
  | "lowLabel"
  | "openLabel"
  | "upLabel"
  | "wickLabel"
>;

/**
 * Returns the names of the tooltip's prices and change, in English unless stated.
 */
function pricesOf({
  changeLabel = "Change",
  closeLabel = "Close",
  highLabel = "High",
  lowLabel = "Low",
  openLabel = "Open",
}: LabelProps): Pick<CandleWords, "change" | "close" | "high" | "low" | "open"> {
  return {
    change: changeLabel,
    close: closeLabel,
    high: highLabel,
    low: lowLabel,
    open: openLabel,
  };
}

/**
 * Returns the names of the key's colors and parts, in English unless stated.
 */
function partsOf({
  bodyLabel = "Open to close",
  downLabel = "Down",
  flatLabel = "Flat",
  upLabel = "Up",
  wickLabel = "Low to high",
}: LabelProps): Pick<CandleWords, "body" | "down" | "flat" | "up" | "wick"> {
  return { body: bodyLabel, down: downLabel, flat: flatLabel, up: upLabel, wick: wickLabel };
}

/**
 * Describes a candlestick chart's props split into its words and the figure's props.
 */
interface Worded {
  /**
   * Props left for the figure.
   */
  readonly root: FigureProps;

  /**
   * Label of each price and part, in English unless stated.
   */
  readonly words: CandleWords;
}

/**
 * Returns the names of the prices and the parts, and the props left for the figure.
 *
 * @param props - The label props and the figure's props.
 */
function wordsOf({
  bodyLabel,
  changeLabel,
  closeLabel,
  downLabel,
  flatLabel,
  highLabel,
  lowLabel,
  openLabel,
  upLabel,
  wickLabel,
  ...root
}: FigureProps & LabelProps): Worded {
  const prices = pricesOf({ changeLabel, closeLabel, highLabel, lowLabel, openLabel });

  return {
    root,
    words: { ...prices, ...partsOf({ bodyLabel, downLabel, flatLabel, upLabel, wickLabel }) },
  };
}

/**
 * Returns the tooltip's formatters: a price, a change with its sign, and a change's percentage.
 *
 * @param chart - The chart, whose locale the formatters write in.
 * @param options - The caller's `Intl.NumberFormat` options for prices.
 */
function formatsOf(
  chart: Chart.ChartApi,
  options: Intl.NumberFormatOptions | undefined,
): CandleFormats {
  return {
    change: chart.formatNumber({ ...options, signDisplay: "exceptZero" }),
    percent: chart.formatNumber(PERCENT),
    value: chart.formatNumber(options),
  };
}

/**
 * Renders the chart's figure around the candles, the key and the caption.
 *
 * @typeParam Row - One row of the data, with `open`, `high`, `low` and `close`.
 * @param props - The rows, the words, the switches and the figure's props.
 */
export function CandlestickChart<Row extends object>({
  animate = false,
  caption,
  categoryKey,
  children,
  data,
  defaultIndex,
  empty = EMPTY,
  grid = true,
  label,
  labelOptions,
  legend = true,
  locale,
  valueDomain,
  valueOptions,
  ...rest
}: CandlestickChartProps<Row>): ReactElement {
  const { root, words } = wordsOf(rest);
  const chart = Chart.useChart({
    data: candlesOf(data, categoryKey),
    locale,
    series: [{ key: RANGE }],
  });
  const formats = formatsOf(chart, valueOptions);
  const formatLabel = labelOptions === undefined ? undefined : chart.formatDate(labelOptions);
  const plot = { animate, categoryKey: "category", chart, children, defaultIndex, formatLabel };

  return (
    <Chart.Root chart={chart} {...root}>
      <Chart.Plot>
        {rangedPlotOf({
          ...plot,
          activeShape: <CandleShape active />,
          facts: factsOf(words, formats),
          formatValue: formats.value,
          grid,
          label,
          niceTicks: "snap125",
          shape: <CandleShape />,
          valueDomain,
          widest: WIDEST,
        })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && chart.data.length > 0 ? (
        <CandleKey flat={chart.data.some((row) => row.direction === "flat")} words={words} />
      ) : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
