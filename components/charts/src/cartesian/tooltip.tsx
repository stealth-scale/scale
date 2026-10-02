/**
 * Renders a cartesian preset's tooltip: recharts' `Tooltip` with the kit's panel, which writes each
 * series' value, a bar's target and zone, the change from an earlier period, and the annotations at
 * the category.
 */

import { type ReactElement } from "react";

import { Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { type Annotation, annotationNotesOf } from "#cartesian/annotations.ts";
import { bulletWordsOf } from "#cartesian/bullet-text.ts";
import { type Formats } from "#cartesian/formats.ts";
import { changeWordsOf } from "#cartesian/periods.ts";
import { type BulletProps, type CoreSeries } from "#cartesian/types.ts";
import * as Chart from "#chart/index.ts";

/**
 * Describes what a cartesian preset's tooltip is built from.
 */
export interface CartesianTooltipOptions {
  /**
   * Annotations of the chart, which the tooltip lists at their category.
   */
  readonly annotations: readonly Annotation[];

  /**
   * Field of each row the category axis reads.
   */
  readonly categoryKey: string;

  /**
   * Chart the tooltip writes the values of.
   */
  readonly chart: Chart.ChartApi;

  /**
   * Index of the row the tooltip shows when the chart first renders.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Formatters of the preset's categories and values.
   */
  readonly formats: Formats;

  /**
   * Series the preset declared, which state targets and earlier periods.
   */
  readonly series: readonly CoreSeries[];

  /**
   * Name of a bar's target.
   */
  readonly targetLabel?: string | undefined;

  /**
   * Zones of the value axis.
   */
  readonly zones: NonNullable<BulletProps["zones"]>;
}

/**
 * Returns whether a chart's bars are bullet graphs: a series reads targets, or zones are stated.
 */
function bulleted(
  series: readonly CoreSeries[],
  zones: NonNullable<BulletProps["zones"]>,
): boolean {
  return zones.length > 0 || series.some((each) => each.target !== undefined);
}

/**
 * Returns recharts' tooltip with the kit's panel.
 *
 * @param options - The annotations, the category field, the chart, the first row shown, the
 *   formatters, the series, the target's name and the zones.
 */
export function tooltipOf(options: CartesianTooltipOptions): ReactElement {
  const { chart, formats, series, targetLabel, zones } = options;
  const write = bulleted(series, zones)
    ? bulletWordsOf({ series, targetLabel, write: formats.value, zones })
    : formats.value;

  return (
    <Tooltip
      content={
        <Chart.Tooltip
          formatLabel={formats.label}
          formatValue={changeWordsOf({ locale: chart.locale, series, write })}
          notesOf={annotationNotesOf(options.annotations, chart.data, options.categoryKey)}
        />
      }
      {...omitUndefined({ defaultIndex: options.defaultIndex })}
    />
  );
}
