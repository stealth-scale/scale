/**
 * Creates the host's data client: its transport guarded to the declared operations, the decisions
 * each query's data states primed into the access store, changes announced on the bus, and the
 * person sent to sign in where the gateway refuses the session.
 */

import {
  createDataClient,
  findRecords,
  type OperationData,
  type QueryClient,
} from "@stealthscale/provider-data";
import {
  HOST,
  hostContract,
  type KnownDecision,
  type ResolvedDecisions,
  type ResolvedProduct,
} from "@stealthscale/sdk-core";
import { type AccessStore, type EventBus } from "@stealthscale/sdk-plugin";

import { type Connection } from "#host/internals.ts";
import { type HostOptions } from "#host/options.ts";
import { guardedTransport } from "#host/transport.ts";
import { type SessionStore } from "#stores/session.ts";

/**
 * Lists the declarations the data client reads.
 */
type Declared = Pick<ResolvedProduct, "mutations" | "permissions" | "queries">;

/**
 * Lists what the host's data client is created from.
 */
export interface DataOptions {
  /**
   * The access store the decisions are primed into.
   */
  readonly access: Pick<AccessStore, "prime">;

  /**
   * Returns the router's connection, where `HostProvider` connected one.
   */
  readonly connection: () => Connection | undefined;

  /**
   * The product's transport and changes stream. A transport over the declarations' samples where
   * left out.
   */
  readonly data?: HostOptions["data"];

  /**
   * The bus `host/recordsChanged` is emitted on.
   */
  readonly events: EventBus;

  /**
   * The declared queries, mutations and permissions.
   */
  readonly product: Declared;

  /**
   * The session store, read again when the gateway refuses the session.
   */
  readonly session: Pick<SessionStore, "refresh">;
}

/**
 * Returns the decisions one decision selector finds in a query's data.
 *
 * @remarks
 *   A record whose member is not a boolean states no decision, so `useAccess` asks the access
 *   source for it.
 */
function foundBy(
  selector: ResolvedDecisions,
  type: string,
  data: unknown,
): readonly KnownDecision[] {
  return findRecords(data, selector).flatMap(({ id, record }) => {
    const allowed = record[selector.field];

    return typeof allowed === "boolean"
      ? [{ allowed, permission: selector.permission, resource: { id, type } }]
      : [];
  });
}

/**
 * Returns the decisions one arrival of a query's data states, through the decision selectors of
 * every query declared for its operation.
 *
 * @remarks
 *   A selector whose permission states no resource kind finds nothing.
 */
function decisionsIn(product: Declared, arrival: OperationData): readonly KnownDecision[] {
  const kinds = new Map(product.permissions.map(({ id, resource }) => [id, resource]));

  return product.queries
    .filter(({ operation }) => operation.id === arrival.operation)
    .flatMap(({ decisions }) => decisions)
    .flatMap((selector) => {
      const type = kinds.get(selector.permission);

      return type === undefined ? [] : foundBy(selector, type, arrival.data);
    });
}

/**
 * Returns the data client of the page or the request.
 *
 * @remarks
 *   Each arrival of a declared query's data, from a fetch or from a server render the page
 *   hydrates, primes the decisions its selectors state. A refusal of the session reads the session
 *   again and invalidates the router, so the sign-in redirect applies.
 */
export function createHostData({
  access,
  connection,
  data,
  events,
  product,
  session,
}: DataOptions): QueryClient {
  return createDataClient({
    changes: data?.changes,
    onData: (arrival) => {
      const decisions = decisionsIn(product, arrival);

      if (decisions.length > 0) access.prime(decisions);
    },
    onUnauthenticated: () => {
      session.refresh();
      connection()?.invalidate();
    },
    transport: guardedTransport({
      changed: (changes) => {
        events.emit(HOST, hostContract.events.recordsChanged.id, { changes });
      },
      changes: data?.changes,
      product,
      transport: data?.transport,
    }),
  });
}
