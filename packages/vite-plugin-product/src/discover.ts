/**
 * Finds each installed plugin's web package and contract package among the modules the product's
 * definition loaded.
 *
 * @remarks
 *   The definition imports every installed plugin's manifest, and each manifest names its contract,
 *   so the modules its evaluation loaded already contain both. A package is the one that contains
 *   the module defining the object, matched by identity. A manifest the definition builds itself,
 *   which no module exports, belongs to the definition module's package. No package is imported for
 *   the search alone, so no component package and no React is loaded in Node.
 */

import { realpathSync } from "node:fs";

import { type PluginPackage } from "@stealthscale/sdk-core";
import {
  dependencies,
  type Loaded,
  manifestAt,
  owning,
  text,
} from "@stealthscale/vite-plugin-base";

/**
 * Describes the packages the build found for the installed plugins.
 */
export interface Discovery {
  /**
   * The package of each installed plugin's contract, by plugin id.
   */
  readonly contracts: Readonly<Record<string, PluginPackage>>;

  /**
   * Each installed plugin's web package, by plugin id, where the product depends on it.
   */
  readonly packages: Readonly<Record<string, PluginPackage>>;
}

/**
 * Describes one installed plugin as the definition states it.
 */
interface Installation {
  /**
   * The contract the manifest names.
   */
  readonly contract: object;

  /**
   * The manifest the web package exports.
   */
  readonly manifest: object;

  /**
   * Id of the plugin, from its contract.
   */
  readonly pluginId: string;
}

/**
 * Returns true where a value is an object whose members can be read by name.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns each installed plugin the definition states with a readable manifest and contract.
 *
 * @remarks
 *   A definition of another shape installs nothing here, and the resolver's shape check reports it.
 * @param definition - The definition's default export.
 */
function installationsOf(definition: object): readonly Installation[] {
  const plugins: unknown = Reflect.get(definition, "plugins");

  return (Array.isArray(plugins) ? plugins : []).flatMap((plugin: unknown) => {
    const manifest = isRecord(plugin) ? plugin["manifest"] : undefined;
    const contract = isRecord(manifest) ? manifest["contract"] : undefined;
    const pluginId = isRecord(contract) ? contract["pluginId"] : undefined;

    return isRecord(manifest) && isRecord(contract) && typeof pluginId === "string"
      ? [{ contract, manifest, pluginId }]
      : [];
  });
}

/**
 * Returns the directory of the package that defines each object a loaded module exports.
 *
 * @remarks
 *   A module evaluates after every module it imports, and a module that re-exports an object
 *   imports the module that defines it. The first module that exports an object, in evaluation
 *   order, is therefore the one that defines it.
 * @param loaded - Every module the definition's evaluation loaded, in evaluation order.
 */
function ownersOf(loaded: readonly Loaded[]): ReadonlyMap<unknown, string> {
  const owners = new Map<unknown, string>();

  for (const { exports, file } of loaded) {
    const directory = owning(file);

    for (const value of Object.values(exports)) {
      if (directory !== undefined && isRecord(value) && !owners.has(value)) {
        owners.set(value, directory);
      }
    }
  }

  return owners;
}

/**
 * Returns the package at a directory, or undefined where its manifest states no name.
 */
function packageIn(directory: string | undefined): PluginPackage | undefined {
  const manifest = directory === undefined ? undefined : manifestAt(directory);
  const name = manifest === undefined ? undefined : text(manifest, "name");

  return directory === undefined || name === undefined ? undefined : { directory, name };
}

/**
 * Finds each installed plugin's web package and contract package.
 *
 * @remarks
 *   A web package outside the product's own package and its dependencies is left out, so the
 *   resolver reports the plugin. A contract package is recorded wherever it is, because the build
 *   reads it to leave the plugin's own catalogue out of the namespaces another package publishes.
 * @param definition - The definition's default export.
 * @param loaded - Every module the definition's evaluation loaded, in evaluation order.
 * @param root - The product's directory, whose dependencies are walked.
 * @param file - The definition module, whose package a manifest the definition builds belongs to.
 */
export function discover(
  definition: object,
  loaded: readonly Loaded[],
  root: string,
  file: string,
): Discovery {
  const owners = ownersOf(loaded);
  const own = owning(realpathSync(file));
  const depended = new Set([realpathSync(root), ...dependencies(root).map(({ at }) => at)]);
  const contracts: Record<string, PluginPackage> = {};
  const packages: Record<string, PluginPackage> = {};

  for (const { contract, manifest, pluginId } of installationsOf(definition)) {
    const web = packageIn(owners.get(manifest) ?? own);
    const declaring = packageIn(owners.get(contract));

    if (web !== undefined && depended.has(web.directory)) packages[pluginId] = web;
    if (declaring !== undefined) contracts[pluginId] = declaring;
  }

  return { contracts, packages };
}
