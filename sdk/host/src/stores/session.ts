/**
 * Keeps the session a product's source reports, with its grants as sets of the ids the installed
 * plugins declare.
 */

import {
  NOBODY,
  type ResolvedProduct,
  type Session,
  type SessionSource,
} from "@stealthscale/sdk-core";
import { type HostReport, type SessionState, type Store } from "@stealthscale/sdk-plugin";

import { writable } from "#stores/store.ts";

/**
 * Describes the session store: the session as the hooks read it, and the end of its subscription.
 */
export interface SessionStore extends Store<SessionState> {
  /**
   * Stops listening to the session source.
   */
  readonly dispose: () => void;

  /**
   * Reads the source again, as a notification of the source does.
   */
  readonly refresh: () => void;
}

/**
 * Lists what the session store is created from.
 */
export interface SessionStoreOptions {
  /**
   * The permissions and entitlements the installed plugins declare.
   */
  readonly product: Pick<ResolvedProduct, "entitlements" | "permissions">;

  /**
   * Receives a `session-failed` entry when the source's `read` throws.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The product's session source.
   */
  readonly source: SessionSource;
}

/**
 * Returns a session's state, with its permissions and entitlements reduced to the declared ids.
 */
function stateOf(
  session: Session,
  permissions: ReadonlySet<string>,
  entitlements: ReadonlySet<string>,
): SessionState {
  return {
    entitlements: new Set(session.entitlements.filter((id) => entitlements.has(id))),
    permissions: new Set(session.permissions.filter((id) => permissions.has(id))),
    session,
  };
}

/**
 * Returns the session store, which reads the source now and again after each notification.
 *
 * @remarks
 *   A permission or an entitlement no installed plugin declares is left out of the sets, so a
 *   check for it is false. A notification after which `read` returns the same object changes
 *   nothing. A `read` that throws keeps the last session and reports `session-failed`. Before the
 *   first successful read the session is `NOBODY`.
 */
export function createSessionStore({ product, report, source }: SessionStoreOptions): SessionStore {
  const permissions = new Set(product.permissions.map(({ id }) => id));
  const entitlements = new Set(product.entitlements.map(({ id }) => id));

  /**
   * Returns the source's session, or undefined after reporting a `read` that threw.
   */
  const read = (): Session | undefined => {
    try {
      return source.read();
    } catch (error) {
      report({ error, kind: "session-failed" });

      return undefined;
    }
  };

  const store = writable(stateOf(read() ?? NOBODY, permissions, entitlements));

  /**
   * Reads the source, and publishes the session where it is another object.
   */
  const refresh = (): void => {
    const session = read();

    if (session !== undefined && session !== store.get().session) {
      store.set(stateOf(session, permissions, entitlements));
    }
  };

  const stop = source.subscribe(refresh);

  return { dispose: stop, get: store.get, refresh, subscribe: store.subscribe };
}
