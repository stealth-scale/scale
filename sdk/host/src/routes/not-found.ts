/**
 * Reads the data of a not-found error back as the data the route evaluator throws.
 */

import {
  type NotFoundData,
  type PageQuarantined,
  type PluginUnavailable,
} from "#routes/context.ts";

/**
 * Returns true for the data of a page whose plugin a switch or a kill switch stopped.
 */
function isStopped(data: object): data is PluginUnavailable {
  return (
    "plugin" in data &&
    typeof data.plugin === "string" &&
    "reason" in data &&
    (data.reason === "off" || data.reason === "unavailable")
  );
}

/**
 * Returns true for the data of a page the host quarantined.
 */
function isQuarantined(data: object): data is PageQuarantined {
  return (
    "target" in data &&
    typeof data.target === "string" &&
    data.target.startsWith("route:") &&
    "reason" in data &&
    data.reason === "quarantined"
  );
}

/**
 * Reads the data of a not-found error as the host's not-found data.
 *
 * @remarks
 *   Every route of the tree can throw a not-found error, so data of another shape, from a route the
 *   product wrote, reads as none.
 * @param data - The data the router passes the not-found component.
 * @returns The data the route evaluator threw, or nothing.
 */
export function notFoundDataOf(data: unknown): NotFoundData | undefined {
  if (typeof data !== "object" || data === null) return undefined;

  return isStopped(data) || isQuarantined(data) ? data : undefined;
}
