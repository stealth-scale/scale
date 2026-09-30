/**
 * Reads the span a scatter's axis covers: the two numbers its domain states, 0 to 1 for an axis
 * whose ends are named, else the span of the points' values.
 */

import { type YAxisProps } from "recharts";

import { finiteAt } from "#cartesian/finite.ts";

/**
 * Describes the span of an axis: its lowest and its highest value.
 */
export type Span = readonly [number, number];

/**
 * Describes where an axis' span comes from: its domain, whether its ends are named, and the field
 * of each point it reads.
 */
export interface SpanSource {
  /**
   * Domain of the axis in recharts' terms.
   */
  readonly domain: YAxisProps["domain"];

  /**
   * Words for the axis' two ends, the low end's first, where the axis names them.
   */
  readonly ends?: readonly [string, string] | undefined;

  /**
   * Field of each point the axis reads.
   */
  readonly key: string;
}

/**
 * Span of an axis whose ends are named and whose domain states no two numbers: a score from 0 to 1.
 */
export const SCORES: Span = [0, 1];

/**
 * Returns a domain's two numbers, or nothing for a domain that does not state two numbers.
 *
 * @param domain - The axis' domain in recharts' terms.
 */
export function pairOf(domain: YAxisProps["domain"]): Span | undefined {
  const low: unknown = Array.isArray(domain) ? domain[0] : undefined;
  const high: unknown = Array.isArray(domain) ? domain[1] : undefined;

  return typeof low === "number" && typeof high === "number" ? [low, high] : undefined;
}

/**
 * Returns the span an axis covers: its domain's two numbers, 0 to 1 for an axis with named ends,
 * else the lowest and the highest finite value of its field across the points.
 *
 * @param axis - The axis' domain, its ends and its field.
 * @param points - Every point of every series.
 */
export function spanOf(axis: SpanSource, points: readonly unknown[]): Span {
  const stated = pairOf(axis.domain);

  if (stated !== undefined) return stated;

  if (axis.ends !== undefined) return SCORES;

  const values = points.flatMap((point) => finiteAt(point, axis.key) ?? []);

  return [Math.min(...values), Math.max(...values)];
}
