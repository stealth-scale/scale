/**
 * Names the prices of a candlestick chart's tooltip and the parts of its key, and writes the
 * tooltip's rows.
 */

import { type ReactNode } from "react";

import { candleChange, type CandleRow } from "#candlestick-chart/candles.ts";
import { type TooltipEntry, type TooltipRow } from "#chart/tooltip.tsx";

/**
 * Describes the names of a candlestick chart's prices and parts, which the tooltip's rows and the
 * key share.
 */
export interface CandleWords {
  /**
   * Name of the body in the key, such as "Open to close".
   */
  readonly body: ReactNode;

  /**
   * Name of the change from open to close, such as "Change".
   */
  readonly change: ReactNode;

  /**
   * Name of the closing price, such as "Close".
   */
  readonly close: ReactNode;

  /**
   * Name of a falling candle's color in the key, such as "Down".
   */
  readonly down: ReactNode;

  /**
   * Name of a flat candle's color in the key, such as "Flat".
   */
  readonly flat: ReactNode;

  /**
   * Name of the highest price, such as "High".
   */
  readonly high: ReactNode;

  /**
   * Name of the lowest price, such as "Low".
   */
  readonly low: ReactNode;

  /**
   * Name of the opening price, such as "Open".
   */
  readonly open: ReactNode;

  /**
   * Name of a rising candle's color in the key, such as "Up".
   */
  readonly up: ReactNode;

  /**
   * Name of the wick in the key, such as "Low to high".
   */
  readonly wick: ReactNode;
}

/**
 * Describes the formatters of a candlestick chart's tooltip.
 */
export interface CandleFormats {
  /**
   * Writes a change of price with its sign, as the value axis writes prices.
   */
  readonly change: (value: unknown) => string;

  /**
   * Writes a change as a percentage with its sign.
   */
  readonly percent: (value: unknown) => string;

  /**
   * Writes a price as the value axis writes it.
   */
  readonly value: (value: unknown) => string;
}

/**
 * Returns a function that writes the tooltip's rows for the period its entries were read from: the
 * open, the high, the low, the close and the change, with its percentage where the open is not 0.
 * The function returns no rows without an entry.
 *
 * @param words - The names of the prices.
 * @param formats - The formatters of the prices, the change and its percentage.
 */
export function factsOf(
  words: CandleWords,
  formats: CandleFormats,
): (entries: readonly TooltipEntry[]) => TooltipRow[] {
  return (entries) => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- recharts passes each entry the row its bar was rendered from
    const row = entries[0]?.payload as CandleRow | undefined;

    if (row === undefined) return [];

    const { candle } = row;
    const { absolute, ratio } = candleChange(candle);
    const change = formats.change(absolute);

    return [
      { key: "open", name: words.open, value: formats.value(candle.open) },
      { key: "high", name: words.high, value: formats.value(candle.high) },
      { key: "low", name: words.low, value: formats.value(candle.low) },
      { key: "close", name: words.close, value: formats.value(candle.close) },
      {
        key: "change",
        name: words.change,
        value: ratio === undefined ? change : `${change} (${formats.percent(ratio)})`,
      },
    ];
  };
}
