/**
 * Renders a burndown chart: the work left per period against a straight ideal line, and the trend
 * projected past the last reading.
 *
 * @remarks
 *   The ideal line is what a constant rate leaves, not a prediction, dashed in the neutral
 *   palette's chart color. The projection starts at the last reading and falls at the trend's rate,
 *   dashed in the warning palette's chart color, because it is an extrapolation. A flat or rising
 *   trend has no finish, so the chart renders no projection for it. `burndownFinish` returns the
 *   period the projection falls to zero, which the caption states. The ideal line and the
 *   projection take fractional values, so the values are written to one decimal unless
 *   `valueOptions` states otherwise.
 */

import { type ReactElement, type ReactNode } from "react";

import { type BurndownPoint, type BurndownRow, burndownRows } from "#burndown-chart/rows.ts";
import { Cartesian } from "#cartesian/cartesian.tsx";
import { type CartesianProps, type CoreSeries } from "#cartesian/types.ts";

/**
 * Options the values are written with unless the caller states others: at most one decimal.
 */
const TENTHS: Intl.NumberFormatOptions = { maximumFractionDigits: 1 };

/**
 * Describes the props of a burndown chart: the cartesian props without rows or series, the
 * readings, the plan and the lines' names.
 */
export interface BurndownChartProps extends Omit<
  CartesianProps<BurndownRow>,
  "categoryKey" | "data" | "series"
> {
  /**
   * Name of the ideal line in the legend and the tooltip.
   */
  readonly idealLabel?: ReactNode;

  /**
   * Number of periods the plan covers. The number of points unless stated.
   */
  readonly periods?: number | undefined;

  /**
   * Periods, in order, each with the work left where it was read.
   */
  readonly points: readonly BurndownPoint[];

  /**
   * Name of the projection in the legend and the tooltip.
   */
  readonly projectedLabel?: ReactNode;

  /**
   * Whether the trend is plotted past the last reading.
   */
  readonly projection?: boolean | undefined;

  /**
   * Name of the readings' line in the legend and the tooltip.
   */
  readonly remainingLabel?: ReactNode;

  /**
   * Work at the start. The first reading unless stated.
   */
  readonly total?: number | undefined;
}

/**
 * Renders the chart's figure around the readings, the ideal line and the projection.
 *
 * @param props - The readings, the plan, the words and the projection.
 */
export function BurndownChart({
  idealLabel = "Ideal",
  periods,
  points,
  projectedLabel = "Projected",
  projection = true,
  remainingLabel = "Remaining",
  total,
  valueOptions = TENTHS,
  ...props
}: BurndownChartProps): ReactElement {
  const rows = burndownRows(points, { periods, total });
  const projected: CoreSeries[] =
    projection && rows.some((row) => row.projected !== undefined)
      ? [{ color: "warning", dashed: true, key: "projected", label: projectedLabel }]
      : [];

  return (
    <Cartesian
      {...props}
      categoryKey="at"
      data={rows}
      series={[
        { key: "remaining", label: remainingLabel },
        { color: "neutral", dashed: true, key: "ideal", label: idealLabel },
        ...projected,
      ]}
      shape={{ curve: "linear", direction: "vertical", mark: "line", stack: "none" }}
      valueOptions={valueOptions}
    />
  );
}
