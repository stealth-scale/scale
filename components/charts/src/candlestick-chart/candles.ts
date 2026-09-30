/**
 * Reads the candles of a candlestick chart from rows: each period's open, high, low and close, the
 * direction its body takes, and how far it moved.
 *
 * @remarks
 *   A candle's direction is its close against its own open, not against the period before, because
 *   the body is the shape on screen: a rising body in the falling color reads as a fault. A candle
 *   with the other convention's direction passes the previous close as its open.
 */

import { finiteAt } from "#cartesian/finite.ts";
import { type ChartColor, colorOf } from "#chart/colors.ts";

/**
 * Fields a row states for a candle, in the order they are read.
 */
const FIELDS = ["open", "high", "low", "close"] as const;

/**
 * Describes one period's prices.
 */
export interface Candle {
  /**
   * Price the period closed at.
   */
  readonly close: number;

  /**
   * Highest price in the period, the top of the wick.
   */
  readonly high: number;

  /**
   * Lowest price in the period, the bottom of the wick.
   */
  readonly low: number;

  /**
   * Price the period opened at.
   */
  readonly open: number;
}

/**
 * Describes whether a period closed above, below or at its open.
 */
export type CandleDirection = "down" | "flat" | "up";

/**
 * Describes how far a period moved.
 */
export interface CandleChange {
  /**
   * Close minus open.
   */
  readonly absolute: number;

  /**
   * Change as a share of the open, or nothing for an open of 0, from which no share exists.
   */
  readonly ratio: number | undefined;
}

/**
 * Describes a row of a candlestick chart: the period's category, its candle and its color.
 */
export interface CandleRow {
  /**
   * Candle of the period.
   */
  readonly candle: Candle;

  /**
   * Value of the period's category field, which the category axis writes.
   */
  readonly category: unknown;

  /**
   * CSS value of the candle's color, from its direction.
   */
  readonly color: string;

  /**
   * Direction of the candle's body.
   */
  readonly direction: CandleDirection;

  /**
   * Lowest and highest price of the period, which the candle's bar spans.
   */
  readonly range: readonly [number, number];
}

/**
 * Palette each direction takes its chart color from: rising in success, falling in error, flat in
 * neutral.
 */
const PALETTES: Readonly<Record<CandleDirection, ChartColor>> = {
  down: "error",
  flat: "neutral",
  up: "success",
};

/**
 * Returns whether a period closed above its open, below it, or at it.
 *
 * @param candle - The period's open and close.
 */
export function candleDirection({ close, open }: Pick<Candle, "close" | "open">): CandleDirection {
  if (close > open) return "up";

  return close < open ? "down" : "flat";
}

/**
 * Returns how far a period moved from its open to its close, as an amount and as a share of the
 * open.
 *
 * @param candle - The period's open and close.
 */
export function candleChange({ close, open }: Pick<Candle, "close" | "open">): CandleChange {
  const absolute = close - open;

  return { absolute, ratio: open === 0 ? undefined : absolute / open };
}

/**
 * Returns the CSS value of a direction's color.
 */
export function directionColor(direction: CandleDirection): string {
  return colorOf(PALETTES[direction]);
}

/**
 * Returns a row per period with a finite open, high, low and close, in the rows' order.
 *
 * @remarks
 *   A candle's bar spans its lowest to its highest price, open and close included, so a period
 *   whose high is below its close still renders its body inside the bar.
 * @param data - The rows, each with `open`, `high`, `low` and `close`.
 * @param categoryKey - The field each row's category is in.
 */
export function candlesOf(data: readonly object[], categoryKey: string): CandleRow[] {
  return data.flatMap((row): CandleRow[] => {
    const [open, high, low, close] = FIELDS.map((field) => finiteAt(row, field));

    if (open === undefined || high === undefined || low === undefined || close === undefined) {
      return [];
    }

    const direction = candleDirection({ close, open });

    return [
      {
        candle: { close, high, low, open },
        category: Reflect.get(row, categoryKey),
        color: directionColor(direction),
        direction,
        range: [Math.min(low, open, close), Math.max(high, open, close)],
      },
    ];
  });
}
