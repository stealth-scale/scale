/**
 * Renders a trend line across a scatter: the least-squares line through the points, over the range
 * of x the points cover.
 *
 * @remarks
 *   The line is dashed and spans the smallest to the largest x present, because a fit extended past
 *   its data is an extrapolation. With `series`, the line takes the series' color, hides while the
 *   legend hides the series, and fades while the legend points at another series. Without it, the
 *   line takes the neutral palette's chart color and ignores the legend. `linearRegression` returns
 *   r², which the page states in the caption and reads to decide whether the line belongs on the
 *   chart at all.
 */

import { type ReactElement } from "react";

import { ReferenceLine } from "recharts";

import { finiteAt } from "#cartesian/finite.ts";
import { colorOf } from "#chart/colors.ts";
import { TREND } from "#chart/recipe.ts";
import { useChartContext } from "#chart/use-chart.ts";
import { linearRegression } from "#regression-overlay/regression.ts";

/**
 * Dash pattern of the line: 6px dashes, 4px apart.
 */
const DASH = "6 4";

/**
 * Width of the line in pixels.
 */
const STROKE = 2;

/**
 * Describes the props of a trend line: the points it fits, the fields their x and y are read from,
 * and the series it summarises.
 *
 * @typeParam Point - One point of the scatter.
 */
export interface RegressionOverlayProps<Point> {
  /**
   * Points to fit, the same points a scatter's series renders.
   */
  readonly data: readonly Point[];

  /**
   * Key of the series the line summarises, whose color the line takes and whose legend state it
   * follows. The line takes the neutral palette's chart color and ignores the legend unless stated.
   */
  readonly series?: string | undefined;

  /**
   * Field each point's x is read from.
   */
  readonly xKey: Extract<keyof Point, string>;

  /**
   * Field each point's y is read from.
   */
  readonly yKey: Extract<keyof Point, string>;
}

/**
 * Renders the trend line as recharts' `ReferenceLine` segment, or nothing where no line fits or
 * the legend hides the line's series.
 *
 * @typeParam Point - One point of the scatter.
 * @param props - The points, the fields their x and y are read from, and the series.
 */
export function RegressionOverlay<Point>({
  data,
  series,
  xKey,
  yKey,
}: RegressionOverlayProps<Point>): null | ReactElement {
  const chart = useChartContext();
  const fit = linearRegression(data, xKey, yKey);

  if (fit === undefined || (series !== undefined && chart.hidden(series))) return null;

  const xs = data.flatMap((point) => finiteAt(point, xKey) ?? []);
  const from = Math.min(...xs);
  const to = Math.max(...xs);

  return (
    <ReferenceLine
      className={TREND}
      ifOverflow="hidden"
      opacity={series === undefined ? "1" : chart.opacity(series)}
      segment={[
        { x: from, y: fit.intercept + fit.slope * from },
        { x: to, y: fit.intercept + fit.slope * to },
      ]}
      stroke={series === undefined ? colorOf("neutral") : chart.color(series)}
      strokeDasharray={DASH}
      strokeWidth={STROKE}
    />
  );
}
