/**
 * Finds the packages on an application's dependency graph that publish a preset, and the workspace
 * packages whose source the compiler scans.
 *
 * @remarks
 *   Both lists are read off the graph rather than stated. An application that names the packages
 *   it draws with has said so in its manifest, and a second list written as paths would be one
 *   more thing to keep in step. The graph is walked once by the caller, because the walk reads
 *   every manifest on it, and both readers here take the result.
 */

import { dirname, join, relative, resolve, sep } from "node:path";

import { type Dependency, exportTarget, type Manifest } from "@stealthscale/vite-plugin-base";

import { PRESET_SUBPATH } from "#options.ts";

/**
 * Marks a directory that belongs to an installed package rather than to the workspace.
 */
const VENDOR = `${sep}node_modules${sep}`;

/**
 * Fixes the directory a workspace package keeps its source in.
 */
const SOURCE = "src";

/**
 * Describes a package contributing a preset to an application.
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
 * Reports whether a package publishes the preset subpath.
 */
function publishes(one: Dependency): boolean {
  const exports = one.manifest["exports"];

  return typeof exports === "object" && exports !== null && PRESET_SUBPATH in exports;
}

/**
 * Reports whether a manifest names a package under one of its dependency fields.
 */
function names(one: Dependency, field: string, name: string): boolean {
  const held = one.manifest[field];

  return typeof held === "object" && held !== null && name in held;
}

/**
 * Reports whether a package contributes a preset: it publishes the subpath, and it is the system
 * package or names the system package as a dependency or a peer.
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
 * Lists every package on the graph that contributes a preset, the system package first and each
 * other package after the packages it depends on.
 *
 * @remarks
 *   The system package goes first whatever the graph says. Every recipe is written against its
 *   vocabulary, and a component package names it as a peer rather than a dependency, so nothing
 *   in the graph puts it where it belongs. The order decides the outcome: where two presets state
 *   the same thing, the one installed later wins.
 * @param graph - The application's dependency graph, each package after what it depends on.
 * @param systemPackage - The package that publishes the foundation.
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
 * Fixes the directory a package's published JavaScript is read from where its export map names
 * no entry.
 */
const DIST = "dist";

/**
 * Lists a glob for the published JavaScript of every installed contributor, relative to the
 * application, sorted.
 *
 * @remarks
 *   A style prop written inside a component of an installed package is resolved when the
 *   application's stylesheet is compiled, as one in a workspace package is, and nothing else names
 *   the rules it needs. The house packs a library unminified, and the compiler reads a compiled
 *   call the way it reads the source. The directory read is the one the package's entry is
 *   published in, so only what the package ships as its own code is read, and only a package that
 *   contributes a preset is read at all.
 * @param root - The application's directory, which the globs are written relative to.
 * @param found - Every contributor, the system package included.
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
 * Lists the source directory of every workspace package on the graph, absolute, sorted.
 *
 * @remarks
 *   A style prop is resolved when the stylesheet is compiled, so a prop the compiler never read is
 *   a class with no rule behind it. The props are written in the packages the application draws
 *   with, so their source is scanned beside the application's own. An installed package is left
 *   out: what ships in one is compiled JavaScript whose props were resolved before it was
 *   published.
 * @param graph - The application's dependency graph.
 */
export function workspaceRoots(graph: readonly Dependency[]): readonly string[] {
  return graph
    .map((one) => resolve(one.at))
    .filter((at) => !at.includes(VENDOR))
    .map((at) => join(at, SOURCE))
    .toSorted();
}

/**
 * Lists a glob for the source of every workspace package on the graph, relative to the
 * application, sorted.
 *
 * @param root - The application's directory, which the globs are written relative to.
 * @param graph - The application's dependency graph.
 */
export function workspaceSources(root: string, graph: readonly Dependency[]): readonly string[] {
  return workspaceRoots(graph).map((at) =>
    `${relative(root, at)}/**/*.{ts,tsx}`.replaceAll(sep, "/"),
  );
}
