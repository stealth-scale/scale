/**
 * Renders a candlestick chart's key: the colors of a rising and a falling candle, of a flat one
 * while the chart has one, and the body and the wick.
 *
 * @remarks
 *   A candle is read by convention: what the body and the wick span, and what the two colors
 *   compare, are not visible from the marks. The colors are the data package's `ColorSwatch`, and
 *   the body and the wick render in the whisker's muted ink, so the key's shapes do not read as a
 *   third color.
 */

import { type ReactElement } from "react";

import { ColorSwatch } from "@stealthscale/component-data";

import { directionColor } from "#candlestick-chart/candles.ts";
import { type CandleWords } from "#candlestick-chart/words.ts";
import * as Chart from "#chart/index.ts";
import { WHISKER } from "#chart/recipe.ts";

/**
 * Describes the props of the key: the names, and whether the chart has a flat candle.
 */
export interface CandleKeyProps {
  /**
   * Whether a candle of the chart closed at its open, which the key then names.
   */
  readonly flat: boolean;

  /**
   * Label of each part, the words the tooltip's rows take too.
   */
  readonly words: CandleWords;
}

/**
 * Renders the key's entries.
 *
 * @param props - The names and the flat candle's switch.
 */
export function CandleKey({ flat, words }: CandleKeyProps): ReactElement {
  return (
    <Chart.Key>
      <Chart.KeyItem glyph={<ColorSwatch size="xs" value={directionColor("up")} />}>
        {words.up}
      </Chart.KeyItem>
      <Chart.KeyItem glyph={<ColorSwatch size="xs" value={directionColor("down")} />}>
        {words.down}
      </Chart.KeyItem>
      {flat ? (
        <Chart.KeyItem glyph={<ColorSwatch size="xs" value={directionColor("flat")} />}>
          {words.flat}
        </Chart.KeyItem>
      ) : null}
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <rect className={WHISKER} fill="none" height={10} width={7} x={4.5} y={3} />
          </svg>
        }
      >
        {words.body}
      </Chart.KeyItem>
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <line className={WHISKER} x1={8} x2={8} y1={1} y2={15} />
          </svg>
        }
      >
        {words.wick}
      </Chart.KeyItem>
    </Chart.Key>
  );
}
