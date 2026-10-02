/**
 * Builds the connection `HostProvider` gives a host: the routes the router matched, its navigation
 * and its invalidation, and the words of every catalogue.
 */

import { type UseTranslationResponse } from "@stealthscale/provider-i18n";
import { type AnyRouter, declaredOf, routeHref } from "@stealthscale/provider-router";

import { type Connection } from "#host/internals.ts";
import { pluginWordsOf } from "#host/words.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Returns the qualified ids of the declared routes the router matched, outermost first.
 *
 * @remarks
 *   The root and every route the product wrote without a name state no id, so the list leaves them
 *   out.
 */
export function matchedOf(router: AnyRouter): readonly string[] {
  return router.state.matches.flatMap((match) => declaredOf(match)?.id ?? []);
}

/**
 * Returns the connection of a router and the catalogues' instance.
 *
 * @remarks
 *   `navigate` resolves the reference through the route map the router's context contains, with
 *   the parameters filled in, and passes the search beside the path, as `RouteLink` does. It
 *   rejects where the map contains no such route or a parameter the path names is missing.
 * @param router - The router whose context contains the host.
 * @param i18n - The instance `useTranslation` returns.
 */
export function connectionOf(
  router: AnyRouter,
  i18n: UseTranslationResponse<"host", undefined>["i18n"],
): Connection {
  const words = pluginWordsOf(i18n);
  // eslint-disable-next-line typescript/no-unsafe-assignment -- AnyRouter types the context as any, and a product's router states the host's context
  const { routes }: HostRouterContext = router.options.context;

  return {
    invalidate: () => {
      void router.invalidate();
    },
    matched: () => matchedOf(router),
    navigate: async (to, options) => {
      await router.navigate({
        ...(options?.search === undefined ? {} : { search: options.search }),
        to: routeHref(routes, to, options?.params),
      });
    },
    translate: (namespace, key, values) => words.t(namespace, key, values),
  };
}
