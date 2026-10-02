/**
 * Names the chunk each lazy module of an installed plugin's web package builds into: one chunk per
 * plugin, which every page, extension, command and settings section of the plugin shares.
 *
 * @remarks
 *   The product imports each web package's main entry statically, through its definition. The main
 *   entry and every module it imports statically build into the chunks the entry loads, because in
 *   the plugin's chunk they would make the first load fetch the whole plugin.
 */

import { sep } from "node:path";

import { type PluginPackage } from "@stealthscale/sdk-core";

/**
 * Describes what the name function reads of a module rolldown passes it.
 */
export interface ChunkedModule {
  /**
   * Ids of the modules that import this one statically.
   */
  readonly importers: readonly string[];

  /**
   * True where the module is an entry of the build.
   */
  readonly isEntry: boolean;
}

/**
 * Describes what the name function reads of the context rolldown passes it.
 */
export interface Chunking {
  /**
   * Returns a module of the build by its id, or null where the build has none.
   */
  readonly getModuleInfo: (id: string) => ChunkedModule | null;
}

/**
 * Returns true where an entry of the build imports a module statically, directly or through other
 * modules.
 *
 * @remarks
 *   The walk follows each module's static importers back towards the entries. A dynamic import
 *   ends the walk, because a module behind one loads after the entry.
 */
function initial(id: string, chunking: Chunking): boolean {
  const seen = new Set<string>();
  const queue = [id];

  for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
    const info = seen.has(next) ? null : chunking.getModuleInfo(next);

    seen.add(next);

    if (info?.isEntry === true) return true;

    queue.push(...(info?.importers ?? []));
  }

  return false;
}

/**
 * Returns the chunk a module builds into: `plugin-<id>` for a module of an installed plugin's web
 * package that no entry imports statically, and null for every other module.
 *
 * @param id - The module's id, its absolute path.
 * @param chunking - The context rolldown passes a group's name function.
 * @param packages - Each installed plugin's web package, by plugin id.
 */
export function pluginChunkOf(
  id: string,
  chunking: Chunking,
  packages: Readonly<Record<string, PluginPackage>>,
): null | string {
  const owner = Object.entries(packages).find(([, { directory }]) =>
    id.startsWith(`${directory}${sep}`),
  );

  return owner === undefined || initial(id, chunking) ? null : `plugin-${owner[0]}`;
}
