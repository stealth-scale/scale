/**
 * Resolves a finished module graph back to the installed packages it came from.
 *
 * @remarks
 *   Every filesystem read here returns undefined or an empty result on failure. An unreadable
 *   manifest or a directory that cannot be listed costs the caller a detail, never the build.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { type Bundling } from "#plugin.ts";

/**
 * A package.json parsed into a plain object, with nothing assumed about its fields.
 *
 * @remarks
 *   The file belongs to another package, so a field can be missing or hold a type its name does not
 *   suggest. Read fields through a checked accessor such as {@link text}.
 */
export type Manifest = Readonly<Record<string, unknown>>;

/**
 * Reads a manifest field, accepting it only when its value is a string.
 *
 * @remarks
 *   A field holding a number, an object or null is indistinguishable here from a field that is
 *   absent. Index the manifest directly to tell those cases apart.
 */
export function text(manifest: Manifest, field: string): string | undefined {
  const held = manifest[field];

  return typeof held === "string" ? held : undefined;
}

/**
 * One installed package the build imported from, together with the packages it imported in turn.
 *
 * @remarks
 *   Two installs of the same name are two entries. A build can bundle both, and a consumer has to
 *   account for each copy separately.
 */
export interface Reached {
  /**
   * Absolute path to the package's directory.
   */
  at: string;

  /**
   * Directories of the packages this one imports from.
   */
  dependsOn: ReadonlySet<string>;

  /**
   * The package.json parsed from that directory.
   */
  manifest: Manifest;

  /**
   * The name the manifest declares, which need not match the directory.
   */
  named: string;
}

/**
 * Walks up from a file to the directory of the package that contains it.
 *
 * @remarks
 *   The nearest package.json above the file wins, so one nested inside a package's source shadows
 *   the package around it. The walk stops at the filesystem root and returns undefined.
 */
export function owning(from: string): string | undefined {
  for (let at = dirname(from); ;) {
    if (existsSync(join(at, "package.json"))) return at;

    const up = dirname(at);

    if (up === at) return undefined;

    at = up;
  }
}

/**
 * Parses the package.json in one directory.
 *
 * @remarks
 *   A missing file, malformed JSON, and a document that parses to anything but an object all return
 *   undefined. A directory with no package and one with a broken package look the same to a caller.
 */
export function manifestAt(at: string): Manifest | undefined {
  try {
    const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));

    if (typeof held !== "object" || held === null) return undefined;

    return Object.fromEntries(Object.entries(held));
  } catch {
    return undefined;
  }
}

/**
 * Reports whether a module path runs through an installed package.
 *
 * @remarks
 *   The test compares whole path segments, so a directory named `node_modules_old` is not mistaken
 *   for an install. Source from the repository itself is the subject of the build, not a component
 *   of it.
 */
function installed(id: string): boolean {
  return id.split(sep).includes("node_modules");
}

/**
 * Filename pattern for licence text, covering `LICENSE`, `LICENCE.md`, `COPYING` and their like.
 */
const LICENCES = /^(?:licen[cs]e|copying)(?:\..*)?$/iu;

/**
 * One licence file shipped in a package, paired with its contents.
 */
export interface Licensed {
  /**
   * The filename exactly as it appears in the package directory.
   */
  named: string;

  /**
   * The whole file, decoded as UTF-8.
   */
  text: string;
}

/**
 * Reads the licence files a package ships.
 *
 * @remarks
 *   Only the package's top directory is listed, so a licence filed in a subdirectory is missed. A
 *   directory that cannot be listed yields an empty array, indistinguishable from a package that
 *   ships no licence at all.
 */
export function licensed(at: string): readonly Licensed[] {
  try {
    return readdirSync(at, { withFileTypes: true })
      .filter((held) => held.isFile() && LICENCES.test(held.name))
      .map((held) => ({ named: held.name, text: readFileSync(join(at, held.name), "utf8") }));
  } catch {
    return [];
  }
}

/**
 * A package's entry part-way through the crawl, while its dependency set is still growing.
 *
 * @remarks
 *   The same fields as {@link Reached}, with a mutable set. The map is filled through this shape and
 *   returned through the readonly one, so a caller cannot add an edge the module graph never
 *   showed.
 */
interface Made {
  /**
   * Directory holding this package's manifest.
   */
  at: string;

  /**
   * Directories imported from, added as the crawl reaches them.
   */
  dependsOn: Set<string>;

  /**
   * The manifest, parsed once when the package was first seen.
   */
  manifest: Manifest;

  /**
   * The name read from that manifest.
   */
  named: string;
}

/**
 * Gathers every installed package a finished build imported from.
 *
 * @remarks
 *   The result comes from the module graph, not from any manifest. A manifest declares what was
 *   asked for, including code the bundler dropped, and omits anything that arrives as another
 *   package's dependency, such as `scheduler` under React.
 * @returns Each package the build reached, keyed by its own directory.
 */
export function reached(bundling: Bundling): ReadonlyMap<string, Reached> {
  const held = new Map<string, Made>();

  /**
   * Returns the entry for the package a module belongs to, creating it the first time.
   *
   * @remarks
   *   A module outside node_modules, one with no manifest above it, and one whose manifest declares
   *   no name all return undefined and stay out of the result.
   */
  function entry(id: string): Made | undefined {
    if (!installed(id)) return undefined;

    const at = owning(id);

    if (at === undefined) return undefined;

    const already = held.get(at);

    if (already !== undefined) return already;

    const manifest = manifestAt(at);
    const named = manifest === undefined ? undefined : text(manifest, "name");

    if (manifest === undefined || named === undefined) return undefined;

    const made = { at, dependsOn: new Set<string>(), manifest, named };

    held.set(at, made);

    return made;
  }

  for (const id of bundling.getModuleIds()) {
    const from = entry(id);

    for (const imported of bundling.getModuleInfo(id)?.importedIds ?? []) {
      const to = owning(imported);

      if (to === undefined || to === owning(id)) continue;
      if (entry(imported) !== undefined && from !== undefined) from.dependsOn.add(to);
    }
  }

  return held;
}
