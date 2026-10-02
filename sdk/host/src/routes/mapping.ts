/**
 * Reads what an installed plugin's manifest maps one of its routes to: the page, the fallback and
 * the search validator.
 */

import { type FunctionComponent } from "react";

import {
  type LazyComponent,
  pluginOf,
  type Product,
  type RouteEntry,
  type SearchSchema,
} from "@stealthscale/sdk-core";

/**
 * Describes what a plugin's manifest maps one of its routes to.
 */
export interface RouteMapping {
  /**
   * Imports the page. Absent where no installed manifest maps the route to code.
   */
  readonly component?: LazyComponent<object> | undefined;

  /**
   * Imports the component that renders in the page's place after the page throws.
   */
  readonly fallback?: LazyComponent<object> | undefined;

  /**
   * Validates the route's search string, where the contract states a validator.
   */
  readonly search?: SearchSchema | undefined;
}

/**
 * Returns what the manifest of a route's plugin maps the route to.
 *
 * @remarks
 *   The manifest's code states a page as its importer alone, or as an entry with a fallback. A
 *   route whose plugin has no manifest maps to nothing.
 * @param product - The product, with each installed plugin's manifest.
 * @param routeId - Qualified id of the route.
 */
export function mappingOf(product: Pick<Product, "manifests">, routeId: string): RouteMapping {
  const plugin = pluginOf(routeId);
  const name = routeId.slice(plugin.length + 1);
  const manifest = product.manifests[plugin];
  const routes = manifest?.code.routes;
  const code = routes?.[name];
  const marker = manifest?.contract.routes[name];
  const entry: RouteEntry | undefined = typeof code === "function" ? { component: code } : code;

  return { component: entry?.component, fallback: entry?.fallback, search: marker?.search };
}

/**
 * Returns the one function a page's module exports, as the component the host renders.
 *
 * @param module - The module the importer resolved with.
 * @param routeId - Qualified id of the route, which the error names.
 * @throws {@link Error} Where the module exports no function or more than one.
 */
export function componentOf(
  module: Readonly<Record<string, unknown>>,
  routeId: string,
): FunctionComponent {
  const found = Object.values(module).filter((value) => typeof value === "function");

  if (found.length !== 1) {
    throw new Error(
      `The module of ${routeId} exports ${String(found.length)} functions, and a page's module exports one.`,
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the manifest's types make the module's one function the page
  return found[0] as FunctionComponent;
}
