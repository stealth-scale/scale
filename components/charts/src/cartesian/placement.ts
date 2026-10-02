/**
 * Places values within a bar recharts renders over a range, for a shape that renders more than the
 * bar: a box, a violin or a candle.
 *
 * @remarks
 *   Recharts hands a bar's shape its rectangle in pixels: the top at the range's largest value and
 *   the height down to its smallest. A shape that places each value within that rectangle grows
 *   with the bar's entrance, which animates the rectangle, and needs no scale of its own.
 */

/**
 * Describes the rectangle recharts passes a bar's shape, in pixels.
 */
export interface BarBox {
  /**
   * Height of the bar, from its range's largest value to its smallest. Recharts passes it.
   */
  readonly height?: number | undefined;

  /**
   * Width of the bar. Recharts passes it.
   */
  readonly width?: number | undefined;

  /**
   * Start of the bar. Recharts passes it.
   */
  readonly x?: number | undefined;

  /**
   * Top of the bar, where its range's largest value is. Recharts passes it.
   */
  readonly y?: number | undefined;
}

/**
 * Describes where a shape's parts go within its bar.
 */
export interface Placement {
  /**
   * Returns a value's pixel within the bar.
   */
  readonly at: (value: number) => number;

  /**
   * Centre of the bar across its width in pixels.
   */
  readonly middle: number;

  /**
   * Width of the bar in pixels.
   */
  readonly width: number;

  /**
   * Start of the bar in pixels.
   */
  readonly x: number;
}

/**
 * Returns where values go within a bar over a range: the largest value at the bar's top and the
 * smallest at its bottom, or every value at the top for a range whose ends are equal.
 *
 * @param range - The smallest and the largest value, which the bar spans.
 * @param bar - The bar's rectangle, each side 0 unless recharts passes it.
 */
export function placementOf(
  [low, high]: readonly [number, number],
  { height = 0, width = 0, x = 0, y = 0 }: BarBox,
): Placement {
  const span = high - low;

  return {
    at: (value) => (span === 0 ? y : y + ((high - value) / span) * height),
    middle: x + width / 2,
    width,
    x,
  };
}
