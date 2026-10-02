/**
 * Builds the API a command's function receives beside its arguments: the host as the command's
 * plugin sees it at the time of the run.
 */

import {
  defineMutation,
  defineQuery,
  mutateOperation,
  operationQuery,
  type QueryClient,
} from "@stealthscale/provider-data";
import {
  type AccessCheck,
  type FlagReference,
  type HostApi,
  type HostData,
  type MutationData,
  type MutationReference,
  type MutationVariables,
  type Product,
  type QueryData,
  type QueryReference,
  type QueryVariables,
  type Toaster,
} from "@stealthscale/sdk-core";
import { changesOf, decisionOf, type EventBus, type HostStores } from "@stealthscale/sdk-plugin";

import { type Connection } from "#host/internals.ts";

/**
 * Lists the declarations the API reads.
 */
type Declared = Pick<Product, "mutations" | "permissions" | "queries">;

/**
 * Lists the stores the API reads.
 */
type ApiStores = Pick<HostStores, "access" | "flags" | "session">;

/**
 * Lists what the API is built from.
 */
export interface ApiOptions {
  /**
   * Returns the router's connection, where `HostProvider` connected one.
   */
  readonly connection: () => Connection | undefined;

  /**
   * The host's data client.
   */
  readonly data: QueryClient;

  /**
   * The bus a command emits on.
   */
  readonly events: EventBus;

  /**
   * The declared queries, mutations and permissions.
   */
  readonly product: Declared;

  /**
   * The stores a command reads.
   */
  readonly stores: ApiStores;

  /**
   * The product's toaster.
   */
  readonly toaster: Toaster;
}

/**
 * The error of a navigation before `HostProvider` connected the router.
 */
const UNCONNECTED =
  "The host is not connected to a router. HostProvider connects one when it renders.";

/**
 * Returns the functions that run declared queries and mutations through the host's data client.
 */
function dataOf(product: Declared, client: QueryClient): HostData {
  return {
    mutate: <M extends MutationReference>(
      mutation: M,
      variables: MutationVariables<M>,
    ): Promise<MutationData<M>> => {
      const declared = product.mutations.find(({ id }) => id === mutation.id);

      if (declared === undefined) {
        return Promise.reject(
          new Error(`No installed plugin declares the mutation ${mutation.id}.`),
        );
      }

      return mutateOperation(
        client,
        defineMutation<MutationData<M>, MutationVariables<M>>(declared.operation.id),
        variables,
        { changes: (given) => changesOf(declared.changes, given) },
      );
    },
    query: <Q extends QueryReference>(
      query: Q,
      variables: QueryVariables<Q>,
    ): Promise<QueryData<Q>> => {
      const declared = product.queries.find(({ id }) => id === query.id);

      if (declared === undefined) {
        return Promise.reject(new Error(`No installed plugin declares the query ${query.id}.`));
      }

      return client.query(
        operationQuery(
          defineQuery<QueryData<Q>, QueryVariables<Q>>(declared.operation.id),
          variables,
          {
            resources: declared.records,
            staleTime: declared.staleTime,
          },
        ),
      );
    },
  };
}

/**
 * Resolves with the decision on one resource once the stores state one, and asks the access source
 * for it meanwhile.
 *
 * @remarks
 *   Every change of the stores that leaves the check pending asks for it again, so a check the host
 *   dropped on a change of subject is asked for again.
 */
function decided(stores: ApiStores, check: AccessCheck): Promise<boolean> {
  return new Promise((resolve) => {
    const stops: Array<() => void> = [];

    /**
     * Resolves with the decision where the stores state one, and asks for it otherwise.
     */
    const settle = (): void => {
      const decision = decisionOf(stores.access.get(), stores.session.get(), check);

      if (decision === "pending") {
        stores.access.request(check);

        return;
      }

      for (const stop of stops) stop();

      resolve(decision === "allowed");
    };

    stops.push(stores.access.subscribe(settle), stores.session.subscribe(settle));
    settle();
  });
}

/**
 * Resolves whether the person has a permission: on the resource where a resource id is given for a
 * scoped permission, and for the tenant otherwise.
 */
function allowed(
  stores: ApiStores,
  product: Declared,
  permission: string,
  resourceId?: string,
): Promise<boolean> {
  const type = product.permissions.find(({ id }) => id === permission)?.resource;

  if (resourceId === undefined || type === undefined) {
    return Promise.resolve(stores.session.get().permissions.has(permission));
  }

  return decided(stores, { permission, resource: { id: resourceId, type } });
}

/**
 * Returns the function that builds a plugin's `HostApi` at the time of a run.
 *
 * @remarks
 *   The session, the connection and the deepest matched route are read when the function is
 *   called, so each run sees the page as it is then. Before `HostProvider` connects the router,
 *   `matched` is undefined, `navigate` rejects, and `t` returns the key.
 */
export function hostApiOf({
  connection,
  data,
  events,
  product,
  stores,
  toaster,
}: ApiOptions): (pluginId: string) => HostApi {
  const hostData = dataOf(product, data);

  return (pluginId) => {
    const connected = connection();

    return {
      can: (permission, resourceId) => allowed(stores, product, permission.id, resourceId),
      data: hostData,
      emit: (event, payload) => {
        events.emit(pluginId, event.id, payload);
      },
      flag: <V extends boolean | string>(flag: FlagReference<V>): V =>
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the reference types the value, and a flag no installed plugin declares takes the reference's default
        (stores.flags.read(flag.id) ?? flag.default ?? false) as V,
      matched: connected?.matched().at(-1),
      navigate: (to, options) =>
        connected === undefined
          ? Promise.reject(new Error(UNCONNECTED))
          : connected.navigate(to, options),
      pluginId,
      session: stores.session.get().session,
      t: (key, values) => connected?.translate(pluginId, key, values) ?? key,
      toaster,
    };
  };
}
