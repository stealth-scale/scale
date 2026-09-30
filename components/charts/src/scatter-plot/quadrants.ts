/**
 * Places a scatter's points into the four quadrants two dividing lines make, and spreads points
 * that are too close together without moving any across a line.
 *
 * @remarks
 *   A quadrant chart places things by two scores and argues about the box each one is in. Two
 *   things with equal scores fall on one point and their labels print over each other, so
 *   `spreadPoints` moves such points apart along a golden-angle spiral around each point's own
 *   place. The spiral is fixed, so every render places the points the same way, and no point moves
 *   across a dividing line, because the quadrant is the claim the chart makes. The function moves
 *   plotted values, and the tooltip writes the moved values: it suits scores read by quadrant and
 *   never measurements.
 */

import { type Span } from "#scatter-plot/span.ts";

/**
 * Describes one of the four quadrants by the reading direction: the start side is the left in a
 * left-to-right document.
 */
export type QuadrantId = "bottomEnd" | "bottomStart" | "topEnd" | "topStart";

/**
 * Lists the four quadrants in reading order: the top row, then the bottom row.
 */
export const QUADRANTS: readonly QuadrantId[] = ["topStart", "topEnd", "bottomStart", "bottomEnd"];

/**
 * Describes where two dividing lines cross the axes.
 */
export interface Division {
  /**
   * Value on the x axis the vertical line crosses at.
   */
  readonly x: number;

  /**
   * Value on the y axis the horizontal line crosses at.
   */
  readonly y: number;
}

/**
 * Describes the quadrants a scatter divides into: the name of each, and where the two lines
 * divide.
 */
export interface Quadrants {
  /**
   * Name of each quadrant, keyed by the reading direction.
   */
  readonly names: Readonly<Record<QuadrantId, string>>;

  /**
   * Value on the x axis the quadrants divide at. The middle of the x axis' span unless stated:
   * its domain's two numbers, 0 to 1 for an axis with named ends, else the points' x values.
   */
  readonly x?: number | undefined;

  /**
   * Value on the y axis the quadrants divide at. The middle of the y axis' span unless stated.
   */
  readonly y?: number | undefined;
}

/**
 * Describes how `spreadPoints` spreads a scatter's points.
 */
export interface SpreadOptions<Point> {
  /**
   * Share of each axis' span two points keep apart. 0.06 unless stated.
   */
  readonly distance?: number | undefined;

  /**
   * Values the quadrants divide at, which no point moves across. The middle of each span unless
   * stated.
   */
  readonly division?: Division | undefined;

  /**
   * Span of the x axis.
   */
  readonly x: Span;

  /**
   * Field of each point the x axis reads.
   */
  readonly xKey: Extract<keyof Point, string>;

  /**
   * Span of the y axis.
   */
  readonly y: Span;

  /**
   * Field of each point the y axis reads.
   */
  readonly yKey: Extract<keyof Point, string>;
}

/**
 * Golden angle in radians, which turns each attempt of the spiral away from the one before.
 */
const GOLDEN = 2.399_963_229_728_653;

/**
 * Attempts a point makes to find a free place before it keeps the last place it found.
 */
const ATTEMPTS = 24;

/**
 * Share of each axis' span two points keep apart unless stated.
 */
const DISTANCE = 0.06;

/**
 * Radius of the spiral's first attempt, in distances.
 */
const REACH = 0.6;

/**
 * Growth of the spiral's radius per attempt, in distances.
 */
const GROWTH = 0.18;

/**
 * Describes a point's place as shares of the two axes' spans, from 0 to 1.
 */
interface Place {
  /**
   * Share of the x axis' span.
   */
  readonly x: number;

  /**
   * Share of the y axis' span.
   */
  readonly y: number;
}

/**
 * Describes the rules a point's place follows: the distance it keeps and the lines it never
 * crosses.
 */
interface Rules {
  /**
   * Share of each axis' span two points keep apart.
   */
  readonly distance: number;

  /**
   * Shares of the axes' spans the quadrants divide at.
   */
  readonly division: Division;
}

/**
 * Returns the quadrant a point falls in. A point on a dividing line belongs to the upper side or
 * the end side.
 *
 * @param x - The point's value on the x axis.
 * @param y - The point's value on the y axis.
 * @param division - The values the quadrants divide at.
 */
export function quadrantOf(x: number, y: number, division: Division): QuadrantId {
  const end = x >= division.x;

  if (y >= division.y) return end ? "topEnd" : "topStart";

  return end ? "bottomEnd" : "bottomStart";
}

/**
 * Returns where the quadrants divide: the values they state, else the middle of each axis' span.
 *
 * @param quadrants - The quadrants, with any values they state.
 * @param x - The span the x axis covers.
 * @param y - The span the y axis covers.
 */
export function divisionOf(quadrants: Quadrants, x: Span, y: Span): Division {
  return {
    x: quadrants.x ?? (x[0] + x[1]) / 2,
    y: quadrants.y ?? (y[0] + y[1]) / 2,
  };
}

/**
 * Returns a share clamped to 0 and 1.
 */
function clamped(share: number): number {
  return Math.min(1, Math.max(0, share));
}

/**
 * Returns a value's share of a span, clamped to the span, or 0 for a span of no width.
 */
function shareOf(value: number, [low, high]: Span): number {
  return high === low ? 0 : clamped((value - low) / (high - low));
}

/**
 * Returns the value at a share of a span.
 */
function valueAt(share: number, [low, high]: Span): number {
  return low + share * (high - low);
}

/**
 * Returns whether a place is closer than the distance to a placed point.
 */
function crowded(place: Place, placed: readonly Place[], distance: number): boolean {
  return placed.some((other) => Math.hypot(other.x - place.x, other.y - place.y) < distance);
}

/**
 * Returns the place a point takes: its own place where it keeps `distance` from every placed
 * point, else the last place along the spiral inside its quadrant.
 *
 * @param home - The point's own place.
 * @param index - The point's place in the list, which turns its spiral.
 * @param placed - The places of the points before it.
 * @param rules - The distance two points keep and the shares the quadrants divide at.
 */
function placeOf(home: Place, index: number, placed: readonly Place[], rules: Rules): Place {
  const quadrant = quadrantOf(home.x, home.y, rules.division);
  let next = home;

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (!crowded(next, placed, rules.distance)) break;

    const radius = rules.distance * (REACH + attempt * GROWTH);
    const angle = GOLDEN * (index + attempt);
    const moved = {
      x: clamped(home.x + Math.cos(angle) * radius),
      y: clamped(home.y + Math.sin(angle) * radius),
    };

    if (quadrantOf(moved.x, moved.y, rules.division) === quadrant) next = moved;
  }

  return next;
}

/**
 * Returns the points in the order given, each moved until it keeps `distance` from the points
 * before it, and never across a dividing line.
 *
 * @remarks
 *   A point without a finite value on both axes is returned as it is and takes no place. A span
 *   clamps each point to the axis, so every moved point is inside the plot.
 * @typeParam Point - One point, with a numeric field per axis.
 * @param points - The points to place.
 * @param options - The axes' fields and spans, the distance and the division.
 */
export function spreadPoints<Point extends object>(
  points: readonly Point[],
  options: SpreadOptions<Point>,
): Point[] {
  const { distance = DISTANCE, x, xKey, y, yKey } = options;
  const middle = { x: valueAt(0.5, x), y: valueAt(0.5, y) };
  const division = {
    x: shareOf(options.division?.x ?? middle.x, x),
    y: shareOf(options.division?.y ?? middle.y, y),
  };
  const placed: Place[] = [];
  const spread: Point[] = [];

  for (const [index, point] of points.entries()) {
    const values = { x: Number(Reflect.get(point, xKey)), y: Number(Reflect.get(point, yKey)) };

    if (Number.isFinite(values.x) && Number.isFinite(values.y)) {
      const home = { x: shareOf(values.x, x), y: shareOf(values.y, y) };
      const place = placeOf(home, index, placed, { distance, division });

      placed.push(place);
      spread.push({ ...point, [xKey]: valueAt(place.x, x), [yKey]: valueAt(place.y, y) });
    } else {
      spread.push(point);
    }
  }

  return spread;
}
