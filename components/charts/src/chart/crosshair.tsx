/**
 * Renders a guide across the plot at the value of the point the tooltip is at, which a reader
 * follows to the value axis.
 *
 * @remarks
 *   Recharts' cursor marks the category. This part renders the guide across the plot at the value
 *   of `dataKey` in the active row, dashed in the cursor's border ink. It renders nothing while
 *   the tooltip is inactive, because recharts reports no active row then, while the row has no
 *   finite value there, or while the legend hides the series. The keyboard layer moves it with the
 *   tooltip. The value is the
 *   series' own, so the guide suits a series that does not stack. On a chart of bars on their side
 *   the guide runs down the plot.
 */

import { type ReactElement } from "react";

import { ReferenceLine, useActiveTooltipDataPoints, useCartesianChartLayout } from "recharts";

import { finiteAt } from "#cartesian/finite.ts";
import { CROSSHAIR } from "#chart/placed.ts";
import { useChartContext } from "#chart/use-chart.ts";

/**
 * Dash pattern of the guide: 3px dashes, 3px apart, as the scatter's cross.
 */
const DASH = "3 3";

/**
 * Describes the props of the crosshair: the series it follows.
 */
export interface CrosshairProps {
  /**
   * Key of the series whose value the guide marks.
   */
  readonly dataKey: string;
}

/**
 * Renders the guide at the active row's value, or nothing without one.
 *
 * @param props - The series the guide follows.
 */
export function Crosshair({ dataKey }: CrosshairProps): null | ReactElement {
  const chart = useChartContext();
  const rows = useActiveTooltipDataPoints();
  const layout = useCartesianChartLayout();
  const value = chart.hidden(dataKey) ? undefined : finiteAt(rows?.[0], dataKey);

  if (value === undefined) return null;

  return (
    <ReferenceLine
      className={CROSSHAIR}
      ifOverflow="hidden"
      strokeDasharray={DASH}
      {...(layout === "vertical" ? { x: value } : { y: value })}
    />
  );
}
