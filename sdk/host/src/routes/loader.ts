/**
 * Builds the loader of a route from the queries the route's declaration reads.
 */

import { defineQuery } from "@stealthscale/provider-data";
import { type DataNeed, loadNeeds } from "@stealthscale/provider-data/router";
import { type RouteLoader } from "@stealthscale/provider-router";
import { type Product, type ResolvedRoute } from "@stealthscale/sdk-core";

/**
 * Returns the queries a page reads, in the form the data foundation's loader takes.
 */
function needsOf(product: Pick<Product, "queries">, route: ResolvedRoute): readonly DataNeed[] {
  return route.data.flatMap(({ query, variables }) =>
    product.queries
      .filter(({ id }) => id === query)
      .map((declared) => ({
        operation: defineQuery(declared.operation.id),
        resources: declared.records,
        variables,
      })),
  );
}

/**
 * Returns the loader of a route that reads data, or undefined for a route that reads none.
 *
 * @remarks
 *   The loader loads each query through the data client in the router's context, with the variables
 *   the route's parameters and search contain.
 * @param product - The product, whose queries the route's data names.
 * @param route - The route as the build resolved it.
 */
export function loaderOf(
  product: Pick<Product, "queries">,
  route: ResolvedRoute,
): RouteLoader | undefined {
  return route.data.length === 0 ? undefined : loadNeeds(needsOf(product, route));
}
