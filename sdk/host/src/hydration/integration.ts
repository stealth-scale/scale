/**
 * Passes a host's state from a server render to the browser's first render through the router's
 * dehydrated state.
 */

import { type AnyRouter } from "@stealthscale/provider-router";
import { subjectOf } from "@stealthscale/sdk-core";
import { type FlagReading } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type Host } from "#host/options.ts";

/**
 * Lists what the host integration connects.
 */
export interface HostIntegrationOptions {
  /**
   * The host of the request on a server, or of the page in the browser.
   */
  readonly host: Host;

  /**
   * The router whose context contains the host.
   */
  readonly router: AnyRouter;
}

/**
 * Describes the state a server render passes to the browser's host.
 */
interface HostSnapshot {
  /**
   * The decisions the host knew before the render, by the key `decisionKey` returns.
   */
  readonly decisions: ReadonlyArray<readonly [string, boolean]>;

  /**
   * The flags the request read, with their values and their origins.
   */
  readonly flags: ReadonlyArray<readonly [string, FlagReading]>;

  /**
   * The person and the tenant the request rendered for, or undefined for nobody.
   */
  readonly subject: string | undefined;
}

/**
 * Types the server's side of the router's rendering utilities.
 */
type ServerSsr = NonNullable<AnyRouter["serverSsr"]>;

/**
 * Returns true where a value is an object whose members can be read by name.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns true where a value has the snapshot's two lists.
 */
function isSnapshot(value: unknown): value is HostSnapshot {
  return isRecord(value) && Array.isArray(value["decisions"]) && Array.isArray(value["flags"]);
}

/**
 * Returns the subject of the host's session: the person and the tenant, or undefined for nobody.
 */
function subjectIn(host: Host): string | undefined {
  return subjectOf(host.stores.session.get().session);
}

/**
 * Wraps the router's `dehydrate` on a server: the earlier function's result, plus `host`, a promise
 * of the host's snapshot that resolves once the render finished.
 */
function dehydrating(host: Host, router: AnyRouter): void {
  const { access, flags } = internalsOf(host);
  const earlier = router.options.dehydrate;

  router.options.dehydrate = async (): Promise<Readonly<Record<string, unknown>>> => {
    const dehydrated: unknown = await earlier?.();
    const decisions = [...access.get().decisions];
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the router calls dehydrate from serverSsr.dehydrate, so its server utilities are attached
    const serverSsr = router.serverSsr as ServerSsr;
    const snapshot = new Promise<HostSnapshot>((resolve) => {
      serverSsr.onRenderFinished(() => {
        resolve({ decisions, flags: flags.snapshot(), subject: subjectIn(host) });
      });
    });

    return { ...(isRecord(dehydrated) ? dehydrated : {}), host: snapshot };
  };
}

/**
 * Wraps the router's `hydrate` in the browser: after the earlier function, it awaits the server's
 * snapshot and hydrates the host from it.
 */
function hydrating(host: Host, router: AnyRouter): void {
  const { access, flags } = internalsOf(host);
  const earlier = router.options.hydrate;

  router.options.hydrate = async (dehydrated: unknown): Promise<void> => {
    await earlier?.(dehydrated);

    const snapshot: unknown = isRecord(dehydrated) ? await dehydrated["host"] : undefined;

    if (!isSnapshot(snapshot)) return;

    flags.hydrate(snapshot.flags, snapshot.subject);

    if (snapshot.subject === subjectIn(host)) access.hydrate(snapshot.decisions);
  };
}

/**
 * Passes the host's state from a server render to the browser's first render.
 *
 * @remarks
 *   A product calls it where it calls `setupDataIntegration`: in the server's router factory for
 *   each request, and in the browser before the router hydrates. On a server the router's
 *   dehydrated state gains a snapshot of the host, taken once the render finished: the subject, the
 *   flags the render read and the decisions the host knew before it. In the browser the router
 *   awaits the snapshot before its first render, and the host reads the server's flags until
 *   `HostProvider` mounts, so the first render matches the server's. The host takes the decisions
 *   only where the browser's subject is the server's.
 * @param options - The host and the router whose context contains it.
 */
export function setupHostIntegration({ host, router }: HostIntegrationOptions): void {
  if (router.isServer) dehydrating(host, router);
  else hydrating(host, router);
}
