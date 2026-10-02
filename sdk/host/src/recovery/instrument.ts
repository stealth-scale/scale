/**
 * Wraps the importers of a product's manifests, so the host measures each plugin's first import and
 * recovers from a chunk that no longer exists.
 */

import { type PluginCode, type PluginManifest, type Product } from "@stealthscale/sdk-core";

import { staleRecovery } from "#recovery/stale.ts";

/**
 * Describes a product whose importers the host wraps, and the recovery the importers share.
 */
export interface Instrumented {
  /**
   * The product, with every importer of its manifests wrapped.
   */
  readonly product: Product;

  /**
   * Reloads the page once per build version after a module failed to import, and returns true
   * while the page reloads.
   */
  readonly recover: () => boolean;
}

/**
 * Describes what the importers of one product share: the recovery and the start of each plugin's
 * first import.
 */
interface Loading {
  /**
   * Reloads the page once per build version, and returns true while it reloads.
   */
  readonly recover: () => boolean;

  /**
   * Returns the time a plugin's first import starts, or undefined for a later import.
   */
  readonly startOf: (pluginId: string) => number | undefined;
}

/**
 * Wraps one importer of a plugin's module.
 */
type Wrap = <Module>(importer: () => Promise<Module | undefined>) => () => Promise<Module>;

/**
 * The instrumented form of each product the host received, so one product object shares one
 * recovery and one measure per plugin.
 */
const INSTRUMENTED = new WeakMap<Product, Instrumented>();

/**
 * Returns a promise that never settles, for an import whose page reloads.
 */
function reloading(): Promise<never> {
  return new Promise<never>(() => {});
}

/**
 * Returns the module an import resolved with.
 *
 * @throws {@link Error} Where the import resolved with no module, as Vite's preload helper resolves
 *   an import whose `vite:preloadError` event a listener cancelled.
 */
function moduleOf<Module>(module: Module | undefined, pluginId: string): Module {
  if (module === undefined) {
    throw new Error(`An import of a module of ${pluginId} resolved with no module.`);
  }

  return module;
}

/**
 * Imports a plugin's module through its importer, measures the plugin's first import, and reloads
 * the page where the import fails.
 *
 * @returns The module, or a promise that never settles while the page reloads.
 * @throws The import's error where the page does not reload.
 */
async function imported<Module>(
  importer: () => Promise<Module | undefined>,
  pluginId: string,
  loading: Loading,
): Promise<Module> {
  const start = loading.startOf(pluginId);
  let module: Module;

  try {
    module = moduleOf(await importer(), pluginId);
  } catch (error) {
    if (loading.recover()) return reloading();

    throw error;
  }

  if (start !== undefined) performance.measure(`stealth:load:${pluginId}`, { start });

  return module;
}

/**
 * Returns the importer wrapped, or undefined where a manifest states none.
 */
function maybe<Module>(
  importer: (() => Promise<Module>) | undefined,
  wrap: Wrap,
): (() => Promise<Module>) | undefined {
  return importer === undefined ? undefined : wrap(importer);
}

/**
 * Returns a record with each value mapped, or undefined where a manifest leaves the record out.
 */
function mapped<Value, Result>(
  record: Readonly<Record<string, Value>> | undefined,
  map: (value: Value) => Result,
): Readonly<Record<string, Result>> | undefined {
  return record === undefined
    ? undefined
    : Object.fromEntries(Object.entries(record).map(([name, value]) => [name, map(value)]));
}

/**
 * Returns a plugin's code with every importer wrapped: pages, fallbacks, extensions, commands and
 * settings sections.
 */
function codeOf(code: PluginCode, wrap: Wrap): PluginCode {
  return {
    commands: mapped(code.commands, (entry) => ({ ...entry, run: wrap(entry.run) })),
    extensions: mapped(code.extensions, (entry) => ({
      component: wrap(entry.component),
      fallback: maybe(entry.fallback, wrap),
    })),
    routes: mapped(code.routes, (route) =>
      typeof route === "function"
        ? wrap(route)
        : { component: wrap(route.component), fallback: maybe(route.fallback, wrap) },
    ),
    settings: mapped(code.settings, (entry) => ({
      ...entry,
      component: maybe(entry.component, wrap),
    })),
  };
}

/**
 * Returns what the importers of one product share.
 */
function loadingOf(product: Product): Loading {
  const started = new Set<string>();

  return {
    recover: staleRecovery(product),
    startOf: (pluginId) => {
      const first = !started.has(pluginId);

      started.add(pluginId);

      return first ? performance.now() : undefined;
    },
  };
}

/**
 * Returns the product with every importer of its manifests wrapped, once per product object.
 *
 * @remarks
 *   A wrapped importer measures its plugin's first import as `stealth:load:<plugin id>`, from the
 *   moment the import starts until the module resolves. Where an import rejects or resolves with no
 *   module, the page reloads once per build version, and the import never settles. A second failure
 *   for the same version rejects, and the route's error component or the extension's boundary
 *   renders it. `createRuntime` and `createHostRoutes` both wrap the product they receive, so a
 *   product that passes one object to `createHost` and `createHostRoutes` shares one recovery and
 *   one measure per plugin.
 * @param product - The product, with each installed plugin's manifest.
 */
export function instrumented(product: Product): Instrumented {
  const known = INSTRUMENTED.get(product);

  if (known !== undefined) return known;

  const loading = loadingOf(product);
  const manifests = Object.fromEntries(
    Object.entries(product.manifests).map(([pluginId, manifest]): [string, PluginManifest] => [
      pluginId,
      {
        ...manifest,
        code: codeOf(manifest.code, (importer) => () => imported(importer, pluginId, loading)),
      },
    ]),
  );
  const result: Instrumented = { product: { ...product, manifests }, recover: loading.recover };

  INSTRUMENTED.set(product, result);

  return result;
}
