/**
 * Renders the recharts chart of a preset that renders one shape per row over the row's range, such
 * as a box, a violin or a candle, on a category axis.
 *
 * @remarks
 *   Each row's bar spans the row's `range`, so the value axis covers every value a shape renders,
 *   and the shape places its parts within the bar. The value axis is rounded around the values
 *   unless a domain is stated, because these charts compare where values fall, not how large they
 *   are. recharts renders the active row's copy of the shape in a later layer, and the band under
 *   the pointer covers the row's category. The preset writes the tooltip's rows.
 */

import { type JSX, type ReactElement, type ReactNode } from "react";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, type YAxisProps } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { CHROME, VALUE_CHROME } from "#cartesian/axes.tsx";
import * as Chart from "#chart/index.ts";

/**
 * Field of each row the bar spans, and the key of the chart's one series.
 */
export const RANGE = "range";

/**
 * Domain of the value axis unless stated: recharts' rounded ticks around the lowest and the
 * highest value.
 */
const ROUNDED: NonNullable<YAxisProps["domain"]> = ["auto", "auto"];

/**
 * Describes what the recharts chart is built from.
 */
export interface RangedPlotOptions {
  /**
   * Shape of the row under the pointer or the keyboard, which recharts renders in a later layer.
   */
  readonly activeShape: JSX.Element;

  /**
   * Whether the shapes grow in with the bars' entrance.
   */
  readonly animate: boolean;

  /**
   * Field of each row the category axis reads.
   */
  readonly categoryKey: string;

  /**
   * Chart whose rows the shapes render.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Recharts elements rendered inside the chart after the shapes.
   */
  readonly children?: ReactNode;

  /**
   * Index of the row the tooltip shows when the chart first renders.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Returns the tooltip's rows for the row its entries were read from.
   */
  readonly facts: (entries: readonly Chart.TooltipEntry[]) => Chart.TooltipRow[];

  /**
   * Writes a category tick and the tooltip's heading. The category as it is unless stated.
   */
  readonly formatLabel?: ((value: unknown) => string) | undefined;

  /**
   * Writes a value tick.
   */
  readonly formatValue: (value: unknown) => string;

  /**
   * Whether lines cross the plot at the value ticks.
   */
  readonly grid: boolean;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Recharts' rule for the value ticks. `snap125` steps by 1, 2, 2.5 or 5 times a power of ten,
   * which can widen the domain. Recharts' own steps unless stated.
   */
  readonly niceTicks?: YAxisProps["niceTicks"];

  /**
   * Shape of a row at rest, which recharts renders over the row's range.
   */
  readonly shape: JSX.Element;

  /**
   * Domain of the value axis in recharts' terms, rounded around the values unless stated.
   */
  readonly valueDomain?: YAxisProps["domain"];

  /**
   * Widest a shape renders in pixels, however wide its band.
   */
  readonly widest: number;
}

/**
 * Returns recharts' bar chart of the rows: the grid, the category axis, the value axis, the
 * tooltip, a shape per row over its range and the caller's children.
 *
 * @param options - The chart, the shape, the formatters and the switches.
 */
export function rangedPlotOf(options: RangedPlotOptions): ReactElement {
  const { chart, defaultIndex, formatLabel, niceTicks } = options;

  return (
    <BarChart accessibilityLayer data={chart.data} title={options.label}>
      {options.grid ? <CartesianGrid vertical={false} /> : null}
      <XAxis
        {...CHROME}
        dataKey={options.categoryKey}
        {...omitUndefined({ tickFormatter: formatLabel })}
      />
      <YAxis
        {...VALUE_CHROME}
        domain={options.valueDomain ?? ROUNDED}
        {...omitUndefined({ niceTicks })}
        tickFormatter={options.formatValue}
        width="auto"
      />
      <Tooltip
        content={<Chart.Tooltip {...omitUndefined({ formatLabel })} rowsOf={options.facts} />}
        {...omitUndefined({ defaultIndex })}
      />
      <Bar
        activeBar={options.activeShape}
        dataKey={RANGE}
        fill={chart.color(RANGE)}
        isAnimationActive={options.animate ? "auto" : false}
        maxBarSize={options.widest}
        shape={options.shape}
      />
      {options.children}
    </BarChart>
  );
}
