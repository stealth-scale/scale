/**
 * Computes whether each installed plugin is on, and why it is not, from its kill switch, its
 * switch, its condition and the plugins it requires.
 */

import {
  evaluateWhen,
  type PluginChanged,
  type ResolvedPlugin,
  type ResolvedProduct,
} from "@stealthscale/sdk-core";
import {
  conditionContextOf,
  type FlagStore,
  type PluginAvailability,
  type SessionState,
  type Store,
} from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";
import { type Switches } from "#stores/switches.ts";

/**
 * Types every installed plugin's availability, by plugin id, in install order.
 */
export type Availability = Readonly<Record<string, PluginAvailability>>;

/**
 * Describes the availability store: the availability the hooks read, and the end of its
 * subscriptions.
 */
export interface AvailabilityStore extends Store<Availability> {
  /**
   * Stops listening to the session, the flags and the switches.
   */
  readonly dispose: () => void;
}

/**
 * Lists what the availability store is created from.
 */
export interface AvailabilityStoreOptions {
  /**
   * Receives each plugin that turns on or off, after the store publishes the change.
   */
  readonly changed: (change: PluginChanged) => void;

  /**
   * The flags, which the kill switches and the conditions read.
   */
  readonly flags: FlagStore;

  /**
   * The installed plugins.
   */
  readonly product: Pick<ResolvedProduct, "plugins">;

  /**
   * The session, which the conditions read.
   */
  readonly session: Store<SessionState>;

  /**
   * The switches of the switchable plugins.
   */
  readonly switches: Store<Switches>;
}

/**
 * Lists what one computation of the availability reads.
 */
interface Inputs {
  /**
   * The availability store, which the condition context reads.
   */
  readonly availability: Store<Availability>;

  /**
   * The flags.
   */
  readonly flags: FlagStore;

  /**
   * The installed plugins, in install order.
   */
  readonly plugins: readonly ResolvedPlugin[];

  /**
   * The session.
   */
  readonly session: Store<SessionState>;

  /**
   * The switches, as they are now.
   */
  readonly switches: Switches;
}

/**
 * The availability of a plugin that passes every test.
 */
const ON: PluginAvailability = { on: true };

/**
 * Returns every installed plugin's availability, in install order.
 *
 * @remarks
 *   A plugin is computed on first need, so it is computed after every plugin its condition names
 *   and every plugin it requires, whatever the install order. A plugin on a ring of conditions and
 *   requirements, which the build refuses, reads as off to the plugin that asks.
 */
function availabilityOf({
  availability,
  flags,
  plugins,
  session,
  switches,
}: Inputs): ReadonlyArray<readonly [string, PluginAvailability]> {
  const installed = new Map(plugins.map((plugin) => [plugin.id, plugin]));
  const known = new Map<string, PluginAvailability>();
  const computing = new Set<string>();

  /**
   * Returns true where a plugin is installed, not being computed, and on.
   */
  const on = (pluginId: string): boolean => {
    const plugin = installed.get(pluginId);

    return plugin !== undefined && !computing.has(pluginId) && computed(plugin).on;
  };

  const context = { ...conditionContextOf({ availability, flags, session }), on };

  /**
   * Returns a plugin's availability: the reason of the first test it fails, else on.
   */
  const tested = (plugin: ResolvedPlugin): PluginAvailability => {
    if (flags.read(plugin.killSwitch) === false) return { on: false, reason: "unavailable" };

    if (!plugin.locked && switches[plugin.id] === false) return { on: false, reason: "off" };

    if (!evaluateWhen(plugin.when, context)) return { on: false, reason: "condition" };

    if (plugin.requires.some(({ optional, pluginId }) => optional !== true && !on(pluginId))) {
      return { on: false, reason: "requirement" };
    }

    return ON;
  };

  /**
   * Returns a plugin's availability, computed once per computation.
   */
  const computed = (plugin: ResolvedPlugin): PluginAvailability => {
    const done = known.get(plugin.id);

    if (done !== undefined) return done;

    computing.add(plugin.id);

    const state = tested(plugin);

    computing.delete(plugin.id);
    known.set(plugin.id, state);

    return state;
  };

  return plugins.map((plugin) => [plugin.id, computed(plugin)]);
}

/**
 * Returns the availability store, computed now and again whenever the session, a flag or a switch
 * changes.
 *
 * @remarks
 *   The tests run in this order, and the first a plugin fails gives its reason: its kill switch is
 *   on (`unavailable`), it is locked or switched on (`off`), its condition is true (`condition`),
 *   and every plugin it requires without `optional` is on (`requirement`). A computation that
 *   changes no plugin's state publishes nothing. A plugin whose reason changes while it remains
 *   off is published without a call to `changed`.
 */
export function createAvailabilityStore({
  changed,
  flags,
  product,
  session,
  switches,
}: AvailabilityStoreOptions): AvailabilityStore {
  const availability = writable<Availability>({});

  /**
   * Returns every plugin's availability as the stores are now.
   */
  const compute = (): ReadonlyArray<readonly [string, PluginAvailability]> =>
    availabilityOf({
      availability,
      flags,
      plugins: product.plugins,
      session,
      switches: switches.get(),
    });

  const first = compute();
  let states = new Map(first.map(([pluginId, state]) => [pluginId, state.on]));

  availability.set(Object.fromEntries(first));

  /**
   * Computes every plugin's availability again, publishes it where it changed, and passes each
   * plugin that turned on or off to `changed`.
   */
  const recompute = (): void => {
    const entries = compute();
    const next = Object.fromEntries(entries);

    if (JSON.stringify(next) === JSON.stringify(availability.get())) return;

    const before = states;

    states = new Map(entries.map(([pluginId, state]) => [pluginId, state.on]));
    availability.set(next);

    for (const [pluginId, state] of entries) {
      if (before.get(pluginId) !== state.on) changed({ ...state, pluginId });
    }
  };

  const stops = [
    session.subscribe(recompute),
    flags.subscribe(recompute),
    switches.subscribe(recompute),
  ];

  return {
    dispose: () => {
      for (const stop of stops) stop();
    },
    get: availability.get,
    subscribe: availability.subscribe,
  };
}
