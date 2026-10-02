/**
 * Creates the host a render runs under: over a plugin's standalone product, from the render's
 * options, or over any resolved product.
 */

import { type FlagSource, type Product } from "@stealthscale/sdk-core";
import { createHost, type Host } from "@stealthscale/sdk-host";
import {
  standaloneProduct,
  type StandaloneSources,
  standaloneSources,
} from "@stealthscale/sdk-host/standalone";
import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { type PluginRenderOptions } from "#options.ts";
import { productOf, seed, transportOf } from "#product.ts";

/**
 * Describes a host created for a render, with what it was created from.
 */
export interface Hosted {
  /**
   * The host.
   */
  readonly host: Host;

  /**
   * The resolved product, with each installed plugin's manifest.
   */
  readonly product: Product;

  /**
   * The session, the decisions and the flags the host reads.
   */
  readonly sources: StandaloneSources;

  /**
   * The setting store of the person's switches, settings and placements.
   */
  readonly store: SettingStore;
}

/**
 * Lists the state a host starts from beside its product.
 */
export type HostState = Pick<
  PluginRenderOptions,
  "access" | "flags" | "placements" | "samples" | "session" | "settings" | "switches"
>;

/**
 * Returns the flag source that serves the values a render states over the standalone source's.
 */
function flagsOf(
  source: FlagSource,
  values: Readonly<Record<string, boolean | string>>,
): FlagSource {
  return { ...source, evaluate: (flag) => values[flag.id] ?? source.evaluate(flag) };
}

/**
 * Creates the host of one render: the standalone product and sources, with the session, the
 * decisions, the flags, the switches, the settings, the placements and the samples the options
 * state.
 *
 * @throws {@link Error} Where the product does not resolve, or a seed names a section no installed
 *   plugin declares.
 */
export function hostedOf(options: PluginRenderOptions): Hosted {
  return hostedOver(productOf(standaloneProduct(options)), options);
}

/**
 * Creates the host of one render over a resolved product: the standalone sources of the product,
 * with the session, the decisions, the flags, the switches, the settings, the placements and the
 * samples the state names.
 *
 * @throws {@link Error} Where a seed names a section no installed plugin declares.
 */
export function hostedOver(product: Product, state: HostState): Hosted {
  const sources = standaloneSources(product);
  const store = memoryStore();
  const { samples } = state;

  if (state.session !== undefined) sources.session.set(state.session);

  if (state.access !== undefined) sources.access.decide(state.access);

  seed(store, product, sources.session.read(), state);

  const host = createHost({
    access: sources.access,
    data: samples === undefined ? undefined : { transport: transportOf(product, samples) },
    flags: flagsOf(sources.flags, state.flags ?? {}),
    product,
    session: sources.session,
    store,
  });

  if (state.placements !== undefined) host.stores.placements.update(state.placements);

  return { host, product, sources, store };
}
