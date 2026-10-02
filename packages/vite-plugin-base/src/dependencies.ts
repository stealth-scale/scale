/**
 * Walks the packages a manifest depends on, following Node's resolution.
 *
 * @remarks
 *   The walk reads `dependencies` alone: a peer dependency is installed by the consumer, and a
 *   development dependency is not shipped. An installation is read once however many manifests
 *   reach it. A package that is not installed is skipped rather than reported, so a partial
 *   install never fails a build over a package nothing imports.
 */

import { existsSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { exportTarget } from "#exports.ts";
import { type Manifest, manifestAt } from "#reached.ts";

/**
 * One package the walk reached.
 */
export interface Dependency {
  /**
   * Package's own directory, absolute and with symlinks resolved.
   */
  at: string;

  /**
   * Every name the package's manifest depends on at run time, sorted.
   */
  dependsOn: readonly string[];

  /**
   * Manifest parsed out of that directory.
   */
  manifest: Manifest;

  /**
   * Name the package was depended on under.
   */
  named: string;
}

/**
 * Returns the names a manifest depends on at run time, sorted.
 */
function namesIn(manifest: Manifest | undefined): readonly string[] {
  const held = manifest?.["dependencies"];

  return typeof held === "object" && held !== null ? Object.keys(held).toSorted() : [];
}

/**
 * Resolves one request through a require function, or returns undefined where Node refuses it.
 */
function resolvedBy(require: NodeJS.Require, request: string): string | undefined {
  try {
    return require.resolve(request);
  } catch {
    return undefined;
  }
}

/**
 * Returns the directory of a package, searched from the directory of the package that depends on
 * it.
 *
 * @remarks
 *   The climb tests each `node_modules` directory above the dependent, as Node's resolution does,
 *   and looks for package.json on disk rather than resolving it. A `require` resolution refuses a
 *   package whose `exports` map withholds `package.json`, and one that publishes under the
 *   `import` condition alone; both are found this way. Symlinks are resolved, so a linked
 *   workspace package is reported at its source directory.
 * @returns The directory, or undefined where the package is not installed for that dependent.
 */
export function packageAt(name: string, from: string): string | undefined {
  for (let at = from; ;) {
    const candidate = join(at, "node_modules", name);

    if (existsSync(join(candidate, "package.json"))) return realpathSync(candidate);

    const up = dirname(at);

    if (up === at) return undefined;

    at = up;
  }
}

/**
 * Resolves the entry of a package from one directory: through Node's own resolution, or through
 * the `exports` map where the package publishes under the `import` condition alone.
 */
function entryFrom(name: string, from: string): string | undefined {
  const entry = resolvedBy(createRequire(join(from, "package.json")), name);

  if (entry !== undefined) return entry;

  const at = packageAt(name, from);

  if (at === undefined) return undefined;

  const published = exportTarget(manifestAt(at) ?? {}, ".", ["import"]);

  return published === undefined ? undefined : join(at, published);
}

/**
 * Resolves the entry of a package from the root or from any package on the root's dependency
 * graph.
 *
 * @remarks
 *   A package only a dependency declares is installed where that dependency resolves it, which
 *   under a package manager that does not flatten is not reachable from the root. A caller that
 *   resolves several entries walks the graph once and passes it in; otherwise the walk runs on
 *   every call.
 * @returns The entry file, absolute, or undefined where no package on the graph declares it.
 */
export function resolvedOnGraph(
  root: string,
  name: string,
  graph: readonly Dependency[] = dependencies(root),
): string | undefined {
  for (const at of [root, ...graph.map((one) => one.at)]) {
    const entry = entryFrom(name, at);

    if (entry !== undefined) return entry;
  }

  return undefined;
}

/**
 * Returns every package reachable through `dependencies` from the package at `root`, each
 * installation once, with a package placed after every package it depends on.
 *
 * @remarks
 *   A consumer that layers contributions needs a dependency ahead of its dependent. A cycle ends
 *   the descent rather than the walk, so two packages that depend on each other are placed in the
 *   order they were reached. An installation is keyed by its resolved directory, so two installed
 *   versions of one name are two entries under one `named`. A package whose manifest does not
 *   parse is skipped, and the root package is not listed.
 */
export function dependencies(root: string): readonly Dependency[] {
  const placed: Dependency[] = [];
  const done = new Set<string>();
  const placing = new Set<string>();

  /**
   * Places one installation after every package it depends on, skipping one that is not installed
   * and one already placed or being placed.
   */
  function place(name: string, from: string): void {
    const at = packageAt(name, from);

    if (at === undefined || done.has(at) || placing.has(at)) return;

    const manifest = manifestAt(at);

    if (manifest === undefined) return;

    const dependsOn = namesIn(manifest);

    placing.add(at);

    for (const each of dependsOn) place(each, at);

    placing.delete(at);
    done.add(at);
    placed.push({ at, dependsOn, manifest, named: name });
  }

  for (const name of namesIn(manifestAt(root))) place(name, root);

  return placed;
}
