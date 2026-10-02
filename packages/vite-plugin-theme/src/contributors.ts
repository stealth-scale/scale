/**
 * Selects the packages on an application's dependency graph that publish a preset, and the
 * workspace packages whose source the compiler scans.
 *
 * @remarks
 *   Both lists are derived from the graph rather than configured. An application already declares
 *   the packages it uses in its manifest, and a second list of paths would be one more thing to
 *   keep in step. The caller walks the graph once, because the walk reads every manifest on it,
 *   and passes the result to both functions here.
 */

import { dirname, join, relative, resolve, sep } from "node:path";

import { type Dependency, exportTarget, type Manifest } from "@stealthscale/vite-plugin-base";

import { PRESET_SUBPATH } from "#options.ts";

/**
 * The path segment marking a directory as belonging to an installed package rather than to the
 * workspace.
 */
const VENDOR = `${sep}node_modules${sep}`;

/**
 * The directory a workspace package keeps its source in.
 */
const SOURCE = "src";

/**
 * A package contributing a preset to an application.
 */
export interface Contributor {
  /**
   * The package's directory, absolute.
   */
  at: string;

  /**
   * The package's manifest, read for what it publishes.
   */
  manifest: Manifest;

  /**
   * The package's name, which its preset is imported under as `<name>/theme`.
   */
  name: string;
}

/**
 * Returns true when a package's export map carries the preset subpath.
 */
function publishes(one: Dependency): boolean {
  const exports = one.manifest["exports"];

  return typeof exports === "object" && exports !== null && PRESET_SUBPATH in exports;
}

/**
 * Returns true when a manifest names a package under one of its dependency fields.
 */
function names(one: Dependency, field: string, name: string): boolean {
  const held = one.manifest[field];

  return typeof held === "object" && held !== null && name in held;
}

/**
 * Returns true when a package contributes a preset: it publishes the subpath, and it either is the
 * system package or names it as a dependency or a peer.
 *
 * @remarks
 *   The subpath alone is not enough. `./theme` is an ordinary name for an export, and a package
 *   from outside the design system that publishes one has nothing the compiler can install. A
 *   preset is written against the foundation's vocabulary, so the package that publishes one
 *   names the foundation.
 */
function contributes(one: Dependency, systemPackage: string): boolean {
  return (
    publishes(one) &&
    (one.named === systemPackage ||
      names(one, "dependencies", systemPackage) ||
      names(one, "peerDependencies", systemPackage))
  );
}

/**
 * Selects every package on the graph that contributes a preset, the system package first and each
 * other package in graph order after it.
 *
 * @remarks
 *   The system package is moved to the front regardless of the graph order. Every recipe is
 *   written against its vocabulary, and a component package declares it as a peer rather than a
 *   dependency, so the graph never orders it first. The order decides the outcome: where two
 *   presets declare the same thing, the one installed later wins.
 * @param graph - The application's dependency graph, each package after what it depends on.
 * @param systemPackage - The package that publishes the foundation.
 * @returns One contributor per package, carrying its directory, manifest and name.
 */
export function contributors(
  graph: readonly Dependency[],
  systemPackage: string,
): readonly Contributor[] {
  const found = graph
    .filter((one) => contributes(one, systemPackage))
    .map((one) => ({ at: one.at, manifest: one.manifest, name: one.named }));

  return [
    ...found.filter((one) => one.name === systemPackage),
    ...found.filter((one) => one.name !== systemPackage),
  ];
}

/**
 * The directory a package's published JavaScript is read from where its export map names no entry.
 */
const DIST = "dist";

/**
 * Builds a glob for the published JavaScript of every installed contributor, relative to the
 * application, sorted.
 *
 * @remarks
 *   A style prop inside an installed package resolves when the application's stylesheet is
 *   compiled, so the glob has to reach it. The house packs a library unminified, so the compiler
 *   can parse a compiled call for style props. The glob covers the directory the package's entry
 *   is published in, which holds the package's own code and nothing it vendored.
 * @param root - The application's directory, which the globs are written relative to.
 * @param found - Every contributor, the system package included.
 * @returns One glob per installed contributor. A workspace contributor is left out, since its
 *   source is covered by {@link workspaceSources}.
 */
export function installedSources(root: string, found: readonly Contributor[]): readonly string[] {
  return found
    .filter((one) => resolve(one.at).includes(VENDOR))
    .map((one) => {
      const entry = exportTarget(one.manifest, ".", ["import"]);
      const under = entry === undefined ? DIST : dirname(entry.replace(/^\.\//u, ""));

      return `${relative(root, resolve(one.at))}/${under}/**/*.{js,mjs}`.replaceAll(sep, "/");
    })
    .toSorted();
}

/**
 * Resolves the source directory of every workspace package on the graph, absolute, sorted.
 *
 * @remarks
 *   A style prop resolves when the stylesheet is compiled, so a prop the compiler never read is a
 *   class with no rule behind it. The props are written in the packages the application depends
 *   on, so the compiler scans their source along with the application's own. An installed package
 *   is left out, because it publishes no source directory.
 * @param graph - The application's dependency graph.
 * @returns One `src` directory per workspace package, whether or not it contributes a preset.
 */
export function workspaceRoots(graph: readonly Dependency[]): readonly string[] {
  return graph
    .map((one) => resolve(one.at))
    .filter((at) => !at.includes(VENDOR))
    .map((at) => join(at, SOURCE))
    .toSorted();
}

/**
 * Builds a glob over the TypeScript source of every workspace package on the graph, relative to
 * the application, sorted.
 *
 * @param root - The application's directory, which the globs are written relative to.
 * @param graph - The application's dependency graph.
 * @returns One glob per workspace package, in the order {@link workspaceRoots} sorted them.
 */
export function workspaceSources(root: string, graph: readonly Dependency[]): readonly string[] {
  return workspaceRoots(graph).map((at) =>
    `${relative(root, at)}/**/*.{ts,tsx}`.replaceAll(sep, "/"),
  );
}
