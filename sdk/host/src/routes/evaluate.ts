/**
 * Evaluates a plugin route's condition before the route loads, against the host in the router's
 * context.
 */

import { type Evaluate, notFound, redirect, routeHref } from "@stealthscale/provider-router";
import {
  evaluateWhen,
  type ResolvedPlugin,
  type ResolvedProduct,
  type When,
} from "@stealthscale/sdk-core";
import {
  conditionContextOf,
  type PluginAvailability,
  type RenderTarget,
} from "@stealthscale/sdk-plugin";

import {
  type HostCondition,
  type HostRouterContext,
  type PluginUnavailable,
} from "#routes/context.ts";

/**
 * Returns the plugin whose state stops a plugin, with that plugin's reason: the plugin itself where
 * a switch or its kill switch stopped it, else the first plugin it requires without `optional` that
 * a switch or a kill switch stopped. Returns undefined where a condition stops the plugin.
 *
 * @remarks
 *   A plugin the walk has passed reads as stopped by a condition, so a ring of requirements, which
 *   the build refuses, ends the walk.
 * @param pluginId - Id of the plugin that is not on.
 * @param plugins - The installed plugins, with the plugins each requires.
 * @param availability - Every installed plugin's availability, by plugin id.
 * @param seen - Ids of the plugins the walk has passed.
 */
export function stoppedBy(
  pluginId: string,
  plugins: readonly ResolvedPlugin[],
  availability: Readonly<Record<string, PluginAvailability>>,
  seen: ReadonlySet<string> = new Set(),
): PluginUnavailable | undefined {
  const reason = availability[pluginId]?.reason;

  if (reason === "off" || reason === "unavailable") return { plugin: pluginId, reason };

  if (reason !== "requirement" || seen.has(pluginId)) return undefined;

  const walked = new Set([...seen, pluginId]);

  return plugins
    .filter(({ id }) => id === pluginId)
    .flatMap(({ requires }) => requires)
    .filter(({ optional }) => optional !== true)
    .map((required) => stoppedBy(required.pluginId, plugins, availability, walked))
    .find((found) => found !== undefined);
}

/**
 * Returns true where a condition requires a signed-in person at its top level or in a top-level
 * `allOf`.
 */
function requiresSignIn(when: When): boolean {
  return (
    when.authenticated === true || (when.allOf?.some((one) => one.authenticated === true) ?? false)
  );
}

/**
 * Returns the evaluator of the product's plugin routes, which reads the host in the router's
 * context.
 *
 * @remarks
 *   The evaluator throws the router's not-found error where the route's plugin is not on, with the
 *   plugin and its reason as data where a switch or a kill switch stopped it, and where the route
 *   is quarantined, with the target as data. Where the condition is false for a person who is not
 *   signed in, the product states a sign-in route, and the condition requires sign-in at its top
 *   level or in a top-level `allOf`, it throws the router's redirect to the sign-in route, with the
 *   address the navigation enters as the `redirect` search. Otherwise it returns the condition.
 * @param product - The installed plugins and the sign-in route.
 */
export function evaluatorOf(
  product: Pick<ResolvedProduct, "plugins" | "signIn">,
): Evaluate<HostCondition, HostRouterContext> {
  return ({ pluginId, routeId, when }, { host, routes }, location) => {
    const context = conditionContextOf(host.stores);
    const target: RenderTarget = `route:${routeId}`;

    if (!context.on(pluginId)) {
      const data = stoppedBy(pluginId, product.plugins, host.stores.availability.get());

      // eslint-disable-next-line typescript/only-throw-error -- the library's refusal is a value, not an Error subclass
      throw data === undefined ? notFound() : notFound({ data });
    }

    if (host.stores.quarantine.get().has(target)) {
      // eslint-disable-next-line typescript/only-throw-error -- the library's refusal is a value, not an Error subclass
      throw notFound({ data: { reason: "quarantined", target } });
    }

    if (when === undefined || evaluateWhen(when, context)) return true;

    if (product.signIn !== undefined && !context.authenticated && requiresSignIn(when)) {
      // eslint-disable-next-line typescript/only-throw-error -- the library's redirect is a value, not an Error subclass
      throw redirect({
        search: { redirect: location?.href },
        to: routeHref(routes, product.signIn),
      });
    }

    return false;
  };
}
