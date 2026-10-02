/**
 * Keeps each switchable plugin's switch for the session's subject, as the person set it in the
 * setting store.
 *
 * @remarks
 *   A switch is `on` or `off` under `stealth.<productId>.<subject>.plugin.<pluginId>`, where the
 *   subject is the session's person and tenant, or `anyone` for a session nobody signed in to. A
 *   plugin the person never switched takes the product's `enabled`. A locked plugin has no switch.
 *   A value stored for it is ignored and reported as `setting-dropped`.
 */

import { type ResolvedPlugin, type ResolvedProduct } from "@stealthscale/sdk-core";
import { type HostReport, type SessionState, type Store } from "@stealthscale/sdk-plugin";
import { settingKey, type SettingStore } from "@stealthscale/settings";

import { writable } from "#stores/store.ts";
import { subjectFor } from "#stores/subject.ts";

/**
 * Types the switches of the switchable plugins, by plugin id: true where a plugin is switched on.
 */
export type Switches = Readonly<Record<string, boolean>>;

/**
 * Describes the switch store: the switches, the setter the Plugins page calls, and the end of its
 * subscriptions.
 */
export interface SwitchStore extends Store<Switches> {
  /**
   * Stops listening to the setting store and to the session.
   */
  readonly dispose: () => void;

  /**
   * Switches a plugin on or off for the session's subject, and stores the choice. Does nothing for
   * a plugin that is locked or not installed.
   */
  readonly set: (pluginId: string, on: boolean) => void;
}

/**
 * Lists what the switch store is created from.
 */
export interface SwitchStoreOptions {
  /**
   * The installed plugins, and the product's id, which every key contains.
   */
  readonly product: Pick<ResolvedProduct, "plugins" | "productId">;

  /**
   * Receives a `setting-dropped` entry for each stored value the store ignores.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The session, whose subject every key contains.
   */
  readonly session: Store<SessionState>;

  /**
   * Where the person's switches are kept.
   */
  readonly store: SettingStore;
}

/**
 * Returns a switchable plugin's switch as stored, or the product's `enabled` where nothing is
 * stored. A stored value other than `on` and `off` is reported and reads as `enabled`.
 */
function switchOf(
  plugin: ResolvedPlugin,
  key: string,
  store: SettingStore,
  report: (entry: HostReport) => void,
): boolean {
  const stored = store.read(key);

  if (stored === "on") return true;

  if (stored === "off") return false;

  if (stored !== null) {
    report({
      key,
      kind: "setting-dropped",
      reason: `the stored switch is ${JSON.stringify(stored)}, neither "on" nor "off"`,
    });
  }

  return plugin.enabled;
}

/**
 * Returns the switch store over the setting store, for the session's subject.
 *
 * @remarks
 *   A change of subject reads every switch from the new subject's keys and follows those keys
 *   alone. A write to a key the store follows, from this tab or another, reads that switch again.
 */
export function createSwitchStore({
  product,
  report,
  session,
  store,
}: SwitchStoreOptions): SwitchStore {
  const switchable = product.plugins.filter(({ locked }) => !locked);
  const locked = product.plugins.filter((plugin) => plugin.locked);
  let subject = subjectFor(session.get());

  /**
   * Returns the key of a plugin's switch for the current subject.
   */
  const keyOf = (pluginId: string): string =>
    settingKey(product.productId, `${subject}.plugin.${pluginId}`);

  /**
   * Reads every switch of the subject, and reports a value stored for a locked plugin.
   */
  const read = (): Switches => {
    for (const { id } of locked) {
      if (store.read(keyOf(id)) !== null) {
        report({ key: keyOf(id), kind: "setting-dropped", reason: "the plugin is locked" });
      }
    }

    return Object.fromEntries(
      switchable.map((plugin) => [plugin.id, switchOf(plugin, keyOf(plugin.id), store, report)]),
    );
  };

  const state = writable(read());

  /**
   * Reads one plugin's switch again, and publishes it where it changed.
   */
  const refresh = (plugin: ResolvedPlugin): void => {
    const on = switchOf(plugin, keyOf(plugin.id), store, report);

    if (state.get()[plugin.id] !== on) state.set({ ...state.get(), [plugin.id]: on });
  };

  /**
   * Follows the key of every switchable plugin for the current subject.
   */
  const follow = (): ReadonlyArray<() => void> =>
    switchable.map((plugin) =>
      store.subscribe(keyOf(plugin.id), () => {
        refresh(plugin);
      }),
    );

  let stops = follow();

  const stopSession = session.subscribe(() => {
    const next = subjectFor(session.get());

    if (next === subject) return;

    subject = next;

    for (const stop of stops) stop();

    stops = follow();
    state.set(read());
  });

  return {
    dispose: () => {
      stopSession();

      for (const stop of stops) stop();
    },
    get: state.get,
    set: (pluginId, on) => {
      const plugin = switchable.find(({ id }) => id === pluginId);

      if (plugin === undefined) return;

      store.write(keyOf(pluginId), on ? "on" : "off");
      refresh(plugin);
    },
    subscribe: state.subscribe,
  };
}
