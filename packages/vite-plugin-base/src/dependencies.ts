/**
 * Walks the packages a manifest depends on, the way Node finds them.
 *
 * @remarks
 *   The walk reads `dependencies` alone. A peer is installed by whoever depends on the package,
 *   and a development dependency is the package's own business. An installation is read once
 *   however many manifests reach it, and a package that is not installed is passed over, so a
 *   missing install never fails a build over a package nothing in it imports.
 */

import { existsSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { exportTarget } from "#exports.ts";
import { type Manifest, manifestAt } from "#reached.ts";

/**
 * One package the walk reached, with what its manifest depends on.
 */
export interface Dependency {
  /**
   * The package's own directory, absolute and real, so a package linked into the workspace is
   * reported where it is written.
   */
  at: string;

  /**
   * The names the package's manifest depends on, sorted.
   */
  dependsOn: readonly string[];

  /**
   * The package.json parsed out of that directory.
   */
  manifest: Manifest;

  /**
   * The name the package was depended on under.
   */
  named: string;
}

/**
 * Lists the names a manifest depends on at run time, sorted.
 */
function namesIn(manifest: Manifest | undefined): readonly string[] {
  const held = manifest?.["dependencies"];

  return typeof held === "object" && held !== null ? Object.keys(held).toSorted() : [];
}

/**
 * Resolves one request through a require function, and returns undefined where Node refuses it.
 */
function resolvedBy(require: NodeJS.Require, request: string): string | undefined {
  try {
    return require.resolve(request);
  } catch {
    return undefined;
  }
}

/**
 * Finds the directory of a package from the directory of the package that depends on it.
 *
 * @remarks
 *   The walk climbs through every `node_modules` above the dependent, the way Node looks a package
 *   up, and reads the manifest itself rather than resolving it. So a package whose export map
 *   withholds `package.json` is found, and so is a package that publishes for `import` alone,
 *   which a `require` resolution refuses. The directory is the real one behind any link, so a
 *   workspace package is reported where it is written and an installed one under `node_modules`.
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
 * the export map where the package publishes for `import` alone.
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
 * Resolves the entry of a package from the root, or from any package on the root's dependency
 * graph, the way Node resolves it from each.
 *
 * @remarks
 *   A package that only a dependency declares is installed where that dependency resolves it,
 *   which under a package manager that does not flatten is not where the root resolves from. The
 *   graph is walked once by a caller that resolves several entries and handed in; without it the
 *   walk happens here.
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
 * Lists every package reachable through `dependencies` from the package at `root`, each
 * installation once, with a package placed after every package it depends on.
 *
 * @remarks
 *   The order is what a consumer needs when a later package's contribution has to win over an
 *   earlier one's. Two packages depending on each other are placed in the order they were met, so
 *   a cycle ends the descent rather than the walk. An installation is keyed by its real directory,
 *   so two installed versions of one name are two entries under one `named`, and a consumer that
 *   cannot take two decides what to do with them. A package whose manifest does not parse is
 *   passed over. The root package itself is not listed.
 */
export function dependencies(root: string): readonly Dependency[] {
  const placed: Dependency[] = [];
  const done = new Set<string>();
  const placing = new Set<string>();

  /**
   * Places one installation after everything it depends on, and passes over one that is absent.
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
