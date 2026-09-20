/**
 * Tells the shape of a value that arrived from outside the kit: a message from a framed document,
 * or a module the index loaded again.
 */

/**
 * Reports whether a value is an object whose fields can be read.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Reports whether a value is a list of words.
 */
export function isWorded(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((word) => typeof word === "string");
}
