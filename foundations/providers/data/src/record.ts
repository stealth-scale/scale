/**
 * Tells a JSON object apart from the other values a response or a cache may contain.
 */

/**
 * Returns true for a value that is an object, and neither an array nor null.
 */
export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
