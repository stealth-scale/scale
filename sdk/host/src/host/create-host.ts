/**
 * Creates the host of one page, or of one request on a server.
 */

import { createEventBus } from "#bus/bus.ts";
import { createHostData } from "#host/data.ts";
import { connector, remember } from "#host/internals.ts";
import { validateManifests } from "#host/manifests.ts";
import { type Host, type HostOptions } from "#host/options.ts";
import { createPage } from "#host/page.ts";
import { importEager, readied } from "#host/ready.ts";
import { createRuntime } from "#host/runtime.ts";
import { followSession } from "#host/sequence.ts";
import { createState } from "#host/state.ts";

/**
 * Milliseconds `ready` waits for the flag source's first identification, where the product states
 * none.
 */
const FLAGS_TIMEOUT = 1000;

/**
 * Creates a host for one page, or for one request on a server.
 *
 * @remarks
 *   The host subscribes to the session source, the setting store, the flag source and the access
 *   source as it is created. It emits the session as `host/sessionChanged`, and starts the flag
 *   source's identification and the eager plugins' imports. The imports go through the runtime's
 *   product, whose importers measure each plugin's first import and recover from a chunk that no
 *   longer exists. `dispose` ends the subscriptions and cancels the data client's fetches.
 * @throws {@link Error} Where the product's manifests lack code for a declared name.
 */
export function createHost(options: HostOptions): Host {
  const { product } = options;

  validateManifests(product);

  const page = createPage(options);
  const events = createEventBus({ events: product.events, report: page.report });
  const state = createState({ events, options, report: page.report });
  const { access, flags, session } = state.stores;
  const connection = connector();
  const data = createHostData({
    access,
    connection: connection.current,
    data: options.data,
    events,
    product,
    session,
  });
  const sequence = followSession({ access, data, events, flags, session });
  const stores = { ...state.stores, ...page.stores };
  const runtime = createRuntime({
    connection: connection.current,
    data,
    events,
    product,
    report: page.report,
    settings: options.store,
    stores,
  });
  const eager = importEager(runtime.product);
  let ready: Promise<void> | undefined;
  const host: Host = {
    data,
    dispose: () => {
      sequence.stop();
      state.dispose();
      void data.cancelQueries();
    },
    ready: () => {
      ready ??= readied(eager, sequence.identified, options.flagsTimeout ?? FLAGS_TIMEOUT);

      return ready;
    },
    retry: page.stores.quarantine.retry,
    stores,
  };

  remember(host, {
    access,
    connect: connection.connect,
    flags,
    glyphs: options.glyphs,
    runtime,
    switches: state.switches,
  });

  return host;
}
