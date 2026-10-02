/**
 * Builds the runtime the hooks of `sdk-plugin` read: the product, the stores, the bus, the toaster,
 * the setting store, the report and the command registry.
 */

import { Toast } from "@stealthscale/component-feedback";
import { type QueryClient } from "@stealthscale/provider-data";
import { type Product } from "@stealthscale/sdk-core";
import { type EventBus, type HostReport, type HostStores } from "@stealthscale/sdk-plugin";
import { type SettingStore } from "@stealthscale/settings";

import { createCommandRegistry } from "#commands/registry.ts";
import { hostApiOf } from "#host/api.ts";
import { type Connection, type Runtime } from "#host/internals.ts";
import { instrumented } from "#recovery/instrument.ts";

/**
 * Lists what the runtime is built from.
 */
export interface RuntimeOptions {
  /**
   * Returns the router's connection, where `HostProvider` connected one.
   */
  readonly connection: () => Connection | undefined;

  /**
   * The host's data client.
   */
  readonly data: QueryClient;

  /**
   * The event bus.
   */
  readonly events: EventBus;

  /**
   * The resolved product, with each installed plugin's manifest.
   */
  readonly product: Product;

  /**
   * Reports an entry.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The store the host keeps a person's choices in.
   */
  readonly settings: SettingStore;

  /**
   * The host's stores.
   */
  readonly stores: HostStores;
}

/**
 * Returns the runtime of one host, with the product's one toaster.
 *
 * @remarks
 *   The runtime's product is the given product with its manifests' importers wrapped by
 *   `instrumented`, so every import of a plugin's module, an extension's included, is measured and
 *   recovers from a chunk that no longer exists. The toaster raises toasts at the end of the
 *   window's bottom edge, five at a time, overlapping until a pointer rests on them. A command runs
 *   with the routes matched at the moment of its run, and with no route before `HostProvider`
 *   connects the router.
 */
export function createRuntime({
  connection,
  data,
  events,
  product,
  report,
  settings,
  stores,
}: RuntimeOptions): Runtime {
  const { product: loaded, recover } = instrumented(product);
  const toaster = Toast.createToaster({ max: 5, overlap: true, placement: "bottom-end" });
  const run = createCommandRegistry({
    hostOf: hostApiOf({ connection, data, events, product: loaded, stores, toaster }),
    matched: () => {
      const connected = connection();

      return connected === undefined ? undefined : new Set(connected.matched());
    },
    product: loaded,
    stores,
  });

  return { events, product: loaded, recover, report, run, settings, stores, toaster };
}
