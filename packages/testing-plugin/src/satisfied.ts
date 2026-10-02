/**
 * Derives the session, the flags and the switches under which a declaration's condition is true,
 * for the case that renders or runs the declaration.
 *
 * @remarks
 *   The search starts from the standalone session: signed in, every declared permission and
 *   entitlement, every boolean flag on and every plugin on. The first context that makes the
 *   condition true sets the atoms the condition reads, and every other value is the standalone
 *   one. A context in which an experiment serves a variant the condition names none of leaves the
 *   experiment at its default, and the router decides which routes match.
 */

import { type Product, type When } from "@stealthscale/sdk-core";
import { standaloneProduct } from "@stealthscale/sdk-host/standalone";

import { firstWhere, OTHER_VARIANT } from "#conditions.ts";
import { type PluginRenderOptions } from "#options.ts";
import { productOf } from "#product.ts";
import { type Subject } from "#subject.ts";

/**
 * Lists the options a render takes to make a condition true.
 */
export type Satisfying = Pick<PluginRenderOptions, "flags" | "session" | "switches">;

/**
 * Returns each atom of one kind in a context, as the id its key names and the atom's value.
 */
function entriesOf(
  values: ReadonlyMap<string, unknown>,
  kind: string,
): ReadonlyArray<readonly [string, unknown]> {
  const prefix = `${kind}:`;

  return [...values].flatMap(([key, value]) =>
    key.startsWith(prefix) ? [[key.slice(prefix.length), value] as const] : [],
  );
}

/**
 * Returns the options under which a condition is true. Returns none where the declaration states
 * no condition, where no context makes it true, or where its atoms make more contexts than the
 * search evaluates.
 *
 * @param product - The permissions and entitlements the installed plugins declare, which the
 *   standalone session grants.
 * @param when - The declaration's condition.
 */
export function satisfiedBy(
  product: Pick<Product, "entitlements" | "permissions">,
  when?: When,
): Satisfying {
  const values = when === undefined ? undefined : firstWhere(when, true);

  if (values === undefined) return {};

  const refused = new Set(
    [...entriesOf(values, "entitlement"), ...entriesOf(values, "permission")].flatMap(
      ([id, granted]) => (granted === false ? [id] : []),
    ),
  );

  /**
   * Returns the declared ids the context leaves in the session.
   */
  const kept = (ids: readonly string[]): readonly string[] => ids.filter((id) => !refused.has(id));
  const flags: ReadonlyArray<readonly [string, boolean | string]> = [
    ...entriesOf(values, "flag").map(([id, on]) => [id, on === true] as const),
    ...entriesOf(values, "variant").flatMap(([id, variant]) =>
      variant === OTHER_VARIANT ? [] : [[id, String(variant)] as const],
    ),
  ];

  return {
    flags: Object.fromEntries(flags),
    session: {
      authenticated: values.get("authenticated") !== false,
      entitlements: kept(product.entitlements.map(({ id }) => id)),
      permissions: kept(product.permissions.map(({ id }) => id)),
      roles: [],
    },
    switches: Object.fromEntries(entriesOf(values, "plugin").map(([id, on]) => [id, on === true])),
  };
}

/**
 * Returns a plugin's render options under which a condition is true, over the plugin's standalone
 * product.
 *
 * @param subject - The plugin and the plugins beside it.
 * @param when - The declaration's condition.
 * @throws {@link Error} Where the standalone product does not resolve.
 */
export function satisfiedFor(subject: Subject, when?: When): PluginRenderOptions {
  return { ...subject, ...satisfiedBy(productOf(standaloneProduct(subject)), when) };
}
