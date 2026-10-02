/**
 * Compiles a product's routes under the product's root route: the plugins' pages, the settings
 * route with its index, and a route per settings page.
 */

import { type AnyRoute, compileRoutes, type RouteDeclaration } from "@stealthscale/provider-router";
import { type Product, type ResolvedRoute } from "@stealthscale/sdk-core";

import { instrumented } from "#recovery/instrument.ts";
import { type HostCondition, type HostRouterContext } from "#routes/context.ts";
import { routeErrorOf } from "#routes/error.tsx";
import { evaluatorOf } from "#routes/evaluate.ts";
import { loaderOf } from "#routes/loader.ts";
import { mappingOf } from "#routes/mapping.ts";
import { loadPage } from "#routes/page.ts";
import { hostComponentOf, settingsIndexOf } from "#settings/routes.ts";

/**
 * Returns a route as the router's compiler takes it, with the host's own component for the
 * settings route and the settings pages.
 */
function declarationOf(product: Product, route: ResolvedRoute): RouteDeclaration<HostCondition> {
  return {
    component: hostComponentOf(product, route) ?? { load: () => loadPage(product, route) },
    id: route.id,
    loader: loaderOf(product, route),
    navigation: route.navigation,
    parent: route.parent,
    path: route.path,
    sample: route.sample,
    search: mappingOf(product, route.id).search,
    when: { pluginId: route.plugin, routeId: route.id, when: route.when },
  };
}

/**
 * Returns a function of the product's root route that compiles every route of the product under
 * it.
 *
 * @remarks
 *   The routes compile in one call, so the compiler sees every path at once. Each route loads its
 *   page with the modules of the plugins in its `loads`, loads its `data` through the data client
 *   in the router's context, validates its search with its contract's validator, and evaluates its
 *   condition against the host in the router's context. The settings route renders the settings
 *   frame, its index opens the first settings page, and each settings page renders its sections.
 *   The pages import through the manifests' importers as `instrumented` wraps them.
 * @param product - The product, with each installed plugin's manifest.
 * @returns The function that compiles the routes under the root, for the root's `addChildren`.
 */
export function createHostRoutes(product: Product): (root: AnyRoute) => readonly AnyRoute[] {
  const loaded = instrumented(product).product;
  const declarations = [
    ...loaded.routes.map((route) => declarationOf(loaded, route)),
    settingsIndexOf(),
  ];
  const evaluate = evaluatorOf(product);

  return (root) =>
    compileRoutes<HostCondition, HostRouterContext>(declarations, {
      errorComponent: ({ id }) => routeErrorOf(id, mappingOf(loaded, id).fallback),
      evaluate,
      parent: root,
    });
}
