/**
 * Marks an edge on or off the path a preset traces from its focused node, for the recipe's rules.
 *
 * @remarks
 *   React's types list no data attribute for an SVG element, so the type adds the one the recipe
 *   reads to the attributes React Flow spreads onto the edge's element. An edge on the path renders
 *   in the ink, and an edge off it fades.
 */

import { type Edge } from "@xyflow/react";

/**
 * Describes the data attribute that marks an edge on or off a traced path.
 */
interface TraceMark {
  /**
   * `on` for an edge on the traced path, `off` for an edge beside it.
   */
  readonly "data-trace": "off" | "on";
}

/**
 * Describes the attributes of an edge on or off a traced path.
 */
export type TraceAttributes = NonNullable<Edge["domAttributes"]> & TraceMark;

/**
 * Returns the attributes that mark an edge on or off a traced path.
 *
 * @param on - Whether the edge is on the traced path.
 */
export function traceMarkOf(on: boolean): TraceAttributes {
  return { "data-trace": on ? "on" : "off" };
}
