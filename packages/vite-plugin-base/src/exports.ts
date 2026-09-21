/**
 * Reads the target an export map names for a subpath, under a given set of conditions.
 *
 * @remarks
 *   A plugin needs this where it has to name a file rather than import it: writing a path into a
 *   generated file, or loading a package's own subpath from inside that package. Resolution follows
 *   Node's, so the file named here is the file a consumer gets.
 */

import { type Manifest } from "#reached.ts";

/**
 * Resolves one export map entry to its target, the way Node's resolver does.
 *
 * @remarks
 *   A string is the target itself. An array is tried element by element and the first that resolves
 *   wins. An object is read in key order, following a key where it is `default` or one of the given
 *   conditions, and resolving its value the same way; a key that resolves to nothing hands the
 *   search to the next. A `null` target means the package withholds that subpath, and ends the
 *   search.
 * @returns The target, `null` for a withheld subpath, or undefined where nothing matched.
 */
function target(entry: unknown, conditions: readonly string[]): null | string | undefined {
  if (typeof entry === "string" || entry === null) return entry;
  if (Array.isArray(entry)) return first(entry, conditions);
  if (typeof entry !== "object") return undefined;

  for (const [key, value] of Object.entries(entry)) {
    if (key !== "default" && !conditions.includes(key)) continue;

    const found = target(value, conditions);

    if (found !== undefined) return found;
  }

  return undefined;
}

/**
 * Takes the first element of an array target that resolves to anything.
 */
function first(
  entries: readonly unknown[],
  conditions: readonly string[],
): null | string | undefined {
  for (const entry of entries) {
    const found = target(entry, conditions);

    if (found !== undefined) return found;
  }

  return undefined;
}

/**
 * Resolves the file a manifest publishes a subpath as, under the conditions given.
 *
 * @remarks
 *   Node's two short forms are handled as well: a bare string is the target of `.`, and an object
 *   whose keys are conditions rather than subpaths covers `.` alone. A subpath has to match its key
 *   exactly. Patterns such as `./*` are not expanded, so a subpath published only through one
 *   resolves to undefined.
 * @returns The target as the manifest writes it, such as `./src/index.ts`, or undefined where the
 *   manifest publishes no such subpath under those conditions, or withholds it.
 */
export function exportTarget(
  manifest: Manifest,
  subpath: string,
  conditions: readonly string[] = [],
): string | undefined {
  const exports = manifest["exports"];

  if (typeof exports === "string") return subpath === "." ? exports : undefined;
  if (typeof exports !== "object" || exports === null) return undefined;

  const keyed = Object.keys(exports).some((key) => key.startsWith("."));
  const found = keyed
    ? target(Reflect.get(exports, subpath), conditions)
    : subpath === "."
      ? target(exports, conditions)
      : undefined;

  return found ?? undefined;
}
