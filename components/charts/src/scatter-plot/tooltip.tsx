/**
 * Renders a scatter's tooltip: a heading that names the point, and each value named by its axis'
 * title and written in its axis' format, with a swatch in the series' color.
 *
 * @remarks
 *   The heading is the point's words where a label field contains them, else the label of the
 *   point's series, and a quadrant chart writes the point's quadrant after it.
 */

import { type ReactElement } from "react";

import { Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { headingOf, type HeadingOptions } from "#scatter-plot/heading.tsx";
import { type Owned, ownersOf } from "#scatter-plot/owners.ts";

/**
 * Dash pattern of the cross recharts renders at the hovered point.
 */
const DASH = "3 3";

/**
 * Describes a field a point's value reads, with its title and the formatter of its values.
 */
export interface Field {
  /**
   * Writes a value of the field.
   */
  readonly format: (value: unknown) => string;

  /**
   * Title of the field.
   */
  readonly title: string;
}

/**
 * Describes what a scatter's tooltip is built from.
 */
export interface TooltipOptions {
  /**
   * Chart whose series name and color the points.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Index of the point in the first series the tooltip shows when the chart first renders.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Returns the field an entry's value reads, from the entry's `dataKey`.
   */
  readonly fieldOf: (key: unknown) => Field;

  /**
   * Label field, quadrants and axes the heading is written from.
   */
  readonly heading: Omit<HeadingOptions, "locale" | "seriesOf">;

  /**
   * Series the chart plots, each with its points.
   */
  readonly series: readonly Owned[];
}

/**
 * Returns recharts' tooltip with the kit's panel.
 *
 * @param options - The chart, the first point shown, the fields, the heading and the series.
 */
export function tooltipOf(options: TooltipOptions): ReactElement {
  const { chart, defaultIndex, fieldOf } = options;
  const owners = ownersOf(options.series);
  const labels = new Map(chart.series.map((each) => [each.key, each.label]));

  /**
   * Returns the key of the series a tooltip entry's point belongs to.
   */
  const ownerOf = (entry: Chart.TooltipEntry | undefined): string =>
    owners.get(entry?.payload) ?? "";

  return (
    <Tooltip
      content={
        <Chart.Tooltip
          entryColor={(entry) => chart.color(ownerOf(entry))}
          formatValue={(value, entry) => fieldOf(entry.dataKey).format(value)}
          headingOf={headingOf({
            ...options.heading,
            locale: chart.locale,
            seriesOf: (entry) => labels.get(ownerOf(entry)),
          })}
          nameOf={(entry) => fieldOf(entry.dataKey).title}
        />
      }
      cursor={{ strokeDasharray: DASH }}
      {...omitUndefined({ defaultIndex })}
    />
  );
}
