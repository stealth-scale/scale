/**
 * Reads the target an export map names for a subpath, under a set of conditions.
 *
 * @remarks
 *   A plugin reads an export map where it has to name a file rather than import it: to write a
 *   path into a generated file, or to load a package's own subpath from inside that package, which
 *   an import by name does not resolve. The reading follows Node's resolution, so the file it names
 *   is the file a consumer imports.
 */

import { type Manifest } from "#reached.ts";

/**
 * Picks the target of one export map entry, the way Node's resolver does.
 *
 * @remarks
 *   A string is the target. An array is tried element by element and the first that resolves
 *   wins. An object is read in the order its keys are written, and a key is followed where it is
 *   `default` or one of the conditions given. What is found under it is read the same way, and a
 *   key that leads nowhere passes the search on to the next key, which is how a condition nested
 *   under another falls back. A `null` target is Node's spelling of a subpath the package
 *   withholds, and it ends the search.
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
 * Picks the first element of an array target that resolves.
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
 * Finds the file a manifest publishes a subpath as, under the conditions given.
 *
 * @remarks
 *   The two short forms of an export map are read as Node reads them: a string names the `.`
 *   subpath, and an object whose keys are conditions rather than subpaths describes `.` alone. A
 *   subpath is matched by its exact key. A pattern such as `./*` is not expanded, so a subpath
 *   published through one alone reads as unpublished.
 * @returns The target as the manifest writes it, such as `./src/index.ts`, or undefined where the
 *   manifest publishes no such subpath under those conditions or withholds it.
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
