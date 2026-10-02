/**
 * Keeps a host in step with its router and with the page while `HostProvider` is mounted.
 */

import { useEffect } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { type AnyRouter } from "@stealthscale/provider-router";
import { HOST, hostContract, type Navigated } from "@stealthscale/sdk-core";
import { type EventBus, type FlagsState, type HostStores } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type Host } from "#host/options.ts";
import { connectionOf, matchedOf } from "#parts/connection.ts";
import { listenForStaleChunks } from "#recovery/stale.ts";

/**
 * Returns true where an override changed, or a reading the page took was replaced or dropped.
 *
 * @remarks
 *   The flag store keeps a reading's object until its value or its origin changes. A first read
 *   adds a reading with the value the reader already used, a route condition included, so a reading
 *   added alone changes nothing a condition read.
 */
function changedFlags(previous: FlagsState, next: FlagsState): boolean {
  if (previous.overrides !== next.overrides) return true;

  for (const [id, reading] of previous.readings) {
    if (next.readings.get(id) !== reading) return true;
  }

  return false;
}

/**
 * Calls `invalidate` once per task after a change a route condition reads: the session, a plugin's
 * availability, a quarantine, an override, or the value of a flag the page read. Returns a
 * function that stops the calls.
 */
function followStores(stores: HostStores, invalidate: () => void): () => void {
  let queued = false;
  let flags = stores.flags.get();

  /**
   * Queues one call for the task, however many stores change in it.
   */
  const queue = (): void => {
    if (queued) return;

    queued = true;
    queueMicrotask(() => {
      queued = false;
      invalidate();
    });
  };

  const stops = [
    stores.availability.subscribe(queue),
    stores.quarantine.subscribe(queue),
    stores.session.subscribe(queue),
    stores.flags.subscribe(() => {
      const next = stores.flags.get();

      if (changedFlags(flags, next)) queue();

      flags = next;
    }),
  ];

  return () => {
    for (const stop of stops) stop();
  };
}

/**
 * Emits `host/navigated` for the address the router resolved before the call, and after each
 * navigation it resolves. Returns a function that stops the emits.
 *
 * @remarks
 *   A load that resolves the address already resolved, such as an invalidation, emits nothing.
 */
function followNavigations(events: EventBus, router: AnyRouter): () => void {
  /**
   * Emits the address with the declared routes the router matched, as the host.
   */
  const announce = (href: string): void => {
    const navigated: Navigated = { href, matched: matchedOf(router) };

    events.emit(HOST, hostContract.events.navigated.id, navigated);
  };

  const resolved = router.state.resolvedLocation;

  if (resolved !== undefined) announce(resolved.href);

  return router.subscribe("onResolved", ({ hrefChanged, toLocation }) => {
    if (hrefChanged) announce(toLocation.href);
  });
}

/**
 * Connects a host to its router until the caller unmounts.
 *
 * @remarks
 *   The host's API and its commands read the router's matches, its navigation and the catalogues
 *   through the connection. The router runs `beforeLoad` again once per task after a change a route
 *   condition reads, so a session change, a switch, a kill switch or a quarantine costs one
 *   invalidation. The host emits `host/navigated` after every navigation the router resolves.
 *   Vite's `vite:preloadError` event reloads the page once per build version. The last effect ends
 *   the hydration from a server render, once the stores' readers are subscribed, so what the
 *   browser's flags change renders again.
 */
export function useConnected(host: Host, router: AnyRouter): void {
  const { i18n } = useTranslation("host");
  const { connect, flags, runtime } = internalsOf(host);
  const { stores } = host;

  useEffect(() => connect(connectionOf(router, i18n)), [connect, i18n, router]);

  useEffect(() => listenForStaleChunks(runtime.recover), [runtime.recover]);

  useEffect(
    () =>
      followStores(stores, () => {
        void router.invalidate();
      }),
    [router, stores],
  );

  useEffect(() => followNavigations(runtime.events, router), [router, runtime.events]);

  useEffect(() => {
    flags.settle();
  }, [flags]);
}
