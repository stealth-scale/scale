/**
 * Renders a Pareto chart: the categories as bars sorted largest first, and the running share of
 * the total as a line on an end axis from 0 to 100%.
 *
 * @remarks
 *   The sort is the analysis: in size order the chart shows which few categories account for most
 *   of the total. A dashed line in the neutral palette's chart color marks the threshold, 80%
 *   unless stated. `paretoCutoff` returns how many categories add up to it, which the caption
 *   states, because reading it off where two lines cross is a task a caption spares a reader.
 */

import { type ReactElement, type ReactNode } from "react";

import { ReferenceLine } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { Cartesian } from "#cartesian/cartesian.tsx";
import { END } from "#cartesian/marks.tsx";
import { type CartesianProps } from "#cartesian/types.ts";
import { colorOf } from "#chart/colors.ts";
import { paretoRows } from "#pareto-chart/rows.ts";

/**
 * Options the end axis and the running share are written with: whole percentages.
 */
const SHARE: Intl.NumberFormatOptions = { maximumFractionDigits: 0, style: "percent" };

/**
 * Dash pattern of the threshold: 6px dashes, 4px apart.
 */
const DASH = "6 4";

/**
 * Describes the props of a Pareto chart: the cartesian props without series, the field the bars
 * read, and the threshold.
 *
 * @typeParam Row - One row of the data.
 */
export interface ParetoChartProps<Row> extends Omit<CartesianProps<Row>, "series"> {
  /**
   * Name of the running share's line in the legend and the tooltip.
   */
  readonly cumulativeLabel?: ReactNode;

  /**
   * Share of the total the dashed line marks, from 0 to 1. 0 renders no line.
   */
  readonly threshold?: number | undefined;

  /**
   * Words written on the threshold's line, such as "80% of tickets". None unless stated.
   */
  readonly thresholdLabel?: string | undefined;

  /**
   * Field of each row the bars read.
   */
  readonly valueKey: Extract<keyof Row, string>;

  /**
   * Name of the bars in the legend and the tooltip. The field's name unless stated.
   */
  readonly valueLabel?: ReactNode;
}

/**
 * Renders the chart's figure around the sorted bars, the running share and the threshold.
 *
 * @typeParam Row - One row of the data.
 * @param props - The rows, the field the bars read, the words and the threshold.
 */
export function ParetoChart<Row extends object>({
  children,
  cumulativeLabel = "Cumulative share",
  data,
  threshold = 0.8,
  thresholdLabel,
  valueKey,
  valueLabel,
  ...props
}: ParetoChartProps<Row>): ReactElement {
  const label = omitUndefined({
    label:
      thresholdLabel === undefined
        ? undefined
        : { position: "insideBottomRight" as const, value: thresholdLabel },
  });

  return (
    <Cartesian
      {...props}
      data={paretoRows(data, valueKey)}
      endDomain={[0, 1]}
      endOptions={SHARE}
      series={[
        { key: valueKey, label: valueLabel, mark: "bar" },
        { axis: "end", key: "cumulative", label: cumulativeLabel, mark: "line" },
      ]}
      shape={{ curve: "linear", direction: "vertical", mark: "mixed", stack: "none" }}
    >
      {threshold > 0 ? (
        <ReferenceLine
          {...label}
          stroke={colorOf("neutral")}
          strokeDasharray={DASH}
          y={threshold}
          yAxisId={END}
        />
      ) : null}
      {children}
    </Cartesian>
  );
}
