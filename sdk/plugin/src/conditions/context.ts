/**
 * Builds the context a condition is evaluated against from the host's stores.
 */

import { type ConditionContext, HOST } from "@stealthscale/sdk-core";

import { type HostStores } from "#host/stores.ts";

/**
 * Returns the context that evaluates a condition against the host's stores as they are now.
 *
 * @remarks
 *   The context reads a flag only when a condition checks it, so an experiment counts an exposure
 *   only where its variant determines what the person sees. A flag no installed plugin declares is
 *   false, and a plugin the product does not install is not on. The host is always on: no switch,
 *   kill switch or condition applies to it.
 * @param stores - The stores of the host that evaluates the condition.
 * @param place - The matched routes and the record's fields, where the condition is evaluated at a
 *   place that has them. A route's and a plugin's condition take neither.
 */
export function conditionContextOf(
  stores: Pick<HostStores, "availability" | "flags" | "session">,
  place: Partial<Pick<ConditionContext, "field" | "matched">> = {},
): ConditionContext {
  const { entitlements, permissions, session } = stores.session.get();
  const availability = stores.availability.get();

  return {
    authenticated: session.authenticated,
    entitled: (id) => entitlements.has(id),
    field: place.field,
    flag: (id) => stores.flags.read(id) ?? false,
    matched: place.matched,
    on: (pluginId) => pluginId === HOST || availability[pluginId]?.on === true,
    permitted: (id) => permissions.has(id),
  };
}
