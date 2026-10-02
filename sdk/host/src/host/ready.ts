/**
 * Imports the eager plugins' modules, and bounds how long a start waits for the flag source.
 */

import { type PluginCode, type Product } from "@stealthscale/sdk-core";

/**
 * Types the importer of one module of a plugin.
 */
type Importer = () => Promise<unknown>;

/**
 * Returns the values of a record a manifest may leave out.
 */
function valuesOf<T>(record: Readonly<Record<string, T>> | undefined): readonly T[] {
  return record === undefined ? [] : Object.values(record);
}

/**
 * Returns every importer a plugin's code lists: its pages, extensions, commands and sections, and
 * their fallbacks.
 */
function importersOf(code: PluginCode): readonly Importer[] {
  const listed: ReadonlyArray<Importer | undefined> = [
    ...valuesOf(code.routes).flatMap((route) =>
      typeof route === "function" ? [route] : [route.component, route.fallback],
    ),
    ...valuesOf(code.extensions).flatMap(({ component, fallback }) => [component, fallback]),
    ...valuesOf(code.commands).map(({ run }) => run),
    ...valuesOf(code.settings).map(({ component }) => component),
  ];

  return listed.filter((importer) => importer !== undefined);
}

/**
 * Imports every module of the plugins named, and resolves once every import settled.
 *
 * @remarks
 *   A failed import does not fail the caller. The page or the extension whose module failed reports
 *   the failure when it renders.
 * @param manifests - Each installed plugin's manifest, by plugin id.
 * @param pluginIds - Ids of the plugins whose modules to import.
 */
export async function importPlugins(
  manifests: Product["manifests"],
  pluginIds: ReadonlySet<string>,
): Promise<void> {
  const importers = Object.entries(manifests)
    .filter(([pluginId]) => pluginIds.has(pluginId))
    .flatMap(([, manifest]) => importersOf(manifest.code));

  await Promise.allSettled(importers.map((load) => load()));
}

/**
 * Imports the modules of every eager plugin, and resolves once every import settled.
 */
export async function importEager(product: Pick<Product, "manifests" | "plugins">): Promise<void> {
  const eager = product.plugins.filter((plugin) => plugin.eager).map(({ id }) => id);

  await importPlugins(product.manifests, new Set(eager));
}

/**
 * Resolves once a promise settles, or once the milliseconds pass, whichever comes first.
 */
export function within(promise: Promise<unknown>, milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);

    /**
     * Stops the timer and resolves.
     */
    const settle = (): void => {
      clearTimeout(timer);
      resolve();
    };

    void promise.then(settle, settle);
  });
}

/**
 * Resolves once the eager imports settled and the flag source identified the session, or once the
 * timeout passed for the identification.
 *
 * @param eager - The eager plugins' imports.
 * @param identified - The flag source's identification of the first session.
 * @param timeout - Milliseconds to wait at most for the identification.
 */
export async function readied(
  eager: Promise<void>,
  identified: Promise<void>,
  timeout: number,
): Promise<void> {
  await Promise.all([eager, within(identified, timeout)]);
}
