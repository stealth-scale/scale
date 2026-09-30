/**
 * Renders a waterfall's values above its bars while the widest value fits a step.
 */

import { type ReactElement } from "react";

import { LabelList, usePlotArea } from "recharts";

/**
 * Width in pixels a value takes per character, an upper bound: the values measure 6.2 to 7.8px a
 * character in Firefox and Chromium at the theme's 12.6px label size.
 */
const GLYPH = 8;

/**
 * Space in pixels kept between two neighbouring values.
 */
const GUTTER = 4;

/**
 * Describes the props of a waterfall's values.
 *
 * @typeParam Row - One row of the chart.
 */
export interface ValuesProps<Row> {
  /**
   * Number of steps the plot's width is shared between.
   */
  readonly count: number;

  /**
   * Returns the value a row's bar is labelled with.
   */
  readonly noteOf: (row: Row) => string;

  /**
   * Number of characters of the widest value.
   */
  readonly widest: number;
}

/**
 * Renders recharts' labels above the bars, or nothing while the widest value would run into its
 * neighbour.
 *
 * @remarks
 *   The part renders inside recharts' `Bar`, whose label entries it reads, and reads the plot's
 *   width from recharts. Every bar of a waterfall is as wide as the others, so the values show or
 *   hide together, and the tooltip still writes each one.
 * @typeParam Row - One row of the chart.
 * @param props - The number of steps, the value of a row and the widest value's length.
 */
export function Values<Row>({ count, noteOf, widest }: ValuesProps<Row>): null | ReactElement {
  const plot = usePlotArea();
  const fits = plot === undefined || widest * GLYPH <= plot.width / count - GUTTER;

  return fits ? <LabelList dataKey={noteOf} position="top" /> : null;
}
