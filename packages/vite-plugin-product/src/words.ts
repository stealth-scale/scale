/**
 * Builds the words the resolver checks from the catalogue plugin's api, so the build checks the
 * words the page loads, found under the scopes the catalogue plugin follows.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { type PluginPackage, type ResolveOptions } from "@stealthscale/sdk-core";
import { type CataloguesApi, LOCALES } from "@stealthscale/vite-plugin-i18n";

/**
 * Returns the fallback catalogue of each namespace, and the packages that publish each namespace
 * other than the plugin's contract package.
 *
 * @remarks
 *   The resolver reports a plugin whose namespace has no entry in `catalogues`. The application's
 *   own catalogues are left out of the publishers, because an application may change the words of
 *   any package it installs.
 * @param api - The catalogue plugin's api.
 * @param contracts - Each installed plugin's contract package, by plugin id.
 */
export function wordsOf(
  api: CataloguesApi,
  contracts: Readonly<Record<string, PluginPackage>>,
): Pick<ResolveOptions, "catalogues" | "namespaces"> {
  const catalogues = api.catalogues();
  const fallback = new Set(
    catalogues
      .filter(({ language }) => language === api.fallback)
      .map(({ namespace }) => namespace),
  );
  const publishers = new Map<string, ReadonlySet<string>>();

  for (const { namespace, own, owner } of catalogues) {
    if (!own && owner !== contracts[namespace]?.name) {
      publishers.set(namespace, new Set([...(publishers.get(namespace) ?? []), owner]));
    }
  }

  return {
    catalogues: Object.fromEntries(
      [...fallback].map((namespace) => [namespace, api.words(api.fallback, namespace)]),
    ),
    namespaces: Object.fromEntries(
      [...publishers].map(([namespace, owners]) => [namespace, [...owners]]),
    ),
  };
}

/**
 * Returns the line that tells a product how the catalogue plugin finds a package's catalogues.
 *
 * @remarks
 *   The catalogue plugin follows the packages of the scopes it was given alone, so a package
 *   without a scope is never followed.
 * @param name - Name of the package whose catalogues the catalogue plugin did not find.
 */
function hintOf(name: string): string {
  const [scope] = name.split("/");

  return name.startsWith("@")
    ? `${name} has catalogues the i18n layer does not follow. Add ${scope} to the scopes of the i18n layer.`
    : `${name} has catalogues the i18n layer does not follow, because the layer follows scoped packages alone.`;
}

/**
 * Returns one line per installed plugin whose contract package has catalogues the catalogue plugin
 * did not find, naming the scope the product adds to the i18n layer.
 *
 * @param api - The catalogue plugin's api.
 * @param contracts - Each installed plugin's contract package, by plugin id.
 */
export function hintsOf(
  api: CataloguesApi,
  contracts: Readonly<Record<string, PluginPackage>>,
): readonly string[] {
  const found = new Set(api.catalogues().map(({ owner }) => owner));

  return Object.values(contracts)
    .filter(({ directory, name }) => !found.has(name) && existsSync(join(directory, LOCALES)))
    .map(({ name }) => hintOf(name));
}
