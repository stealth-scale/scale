---
rfc: 0020
title: "Plugin data"
author: Roy Klopper, drafted with Claude
status: Draft
created: 2026-09-30
updated: 2026-10-02
discussion: tbd
supersedes: none
superseded-by: none
produces-adr: tbd
---

# RFC-0020: Plugin data

## Summary

A plugin reads and changes data through the data foundation (RFC-0005), and the host provides the
client. A plugin's contract declares:

- The queries and mutations the plugin runs
- The records each query's data contains, and the person's actions the data states
- The samples its tests and the standalone host serve
- The data each page needs

The build checks these declarations and lists every operation the plugins declare. The host acts on
them without running plugin code:

- It loads a page's data with its code.
- It primes the access decisions a query's data states, in the browser and after a server render.
- It resets the data when the person or the tenant changes.
- It announces changes to records on the bus.

## Motivation

### The requirements

- A plugin runs only the operations its contract declares, so a product's build knows every
  operation its plugins run.
- A page's data loads with its code, on intent, from a declaration rather than from plugin code.
- A plugin reads another plugin's data by reference, typed by the other plugin's contract, without
  importing its code.
- Data that states the person's actions on its records primes the access checks, so a page sends no
  check for a record it displays (RFC-0014). Data the server rendered primes them in the browser as
  well.
- A change one plugin makes to a record shows in the other plugins that display the record, and a
  plugin can act on the change.
- An extension renders only for the records it applies to, such as an offer to reorder an item that
  is out of stock.
- A plugin's pages render in its tests and in the standalone host from samples, in every error state
  as well as with data.

### Why this layer

RFC-0005 defines operations, queries, mutations, resources and changes for any application. This RFC
defines what a plugin states about them in its contract, so the host and the build act on each
declaration as data, the way they act on routes and slots (RFC-0010).

## Detailed design

### Operations in a contract package

A plugin defines its operations in its contract package, beside its contract. `sdk-core` exports
`defineQuery`, `defineMutation` and `defineSubscription`, and the `Operation` type they return is
structurally the one `provider-data` defines. A contract package does not depend on a data library
for them, and a web package passes the same values to `provider-data`'s functions. `provider-router`
takes a search validator the same way: it depends on Standard Schema's types alone, and on no
validation library (`foundations/providers/router/src/declaration.ts:30-37`).

```ts
import { defineMutation, defineQuery } from "@stealthscale/sdk-core";

export const requestsQuery = defineQuery<RequestsData, { readonly status?: string | undefined }>(
  "time-off~4~7f3a11",
);

export const approveMutation = defineMutation<ApproveData, { readonly id: string }>(
  "time-off~4~41b0d2",
);
```

### Declaring queries and mutations

```ts
/**
 * Describes where a query's data states the person's actions on its records.
 */
export interface DecisionSelector {
  /**
   * Dotted path of the records in the data. The data itself where left out.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that is true where the person may take the action.
   */
  readonly field: string;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * The scoped permission the member decides. Its resource kind is the records' kind.
   */
  readonly permission: PermissionReference<string, true>;
}

/**
 * Describes where a query's data contains records of one declared resource kind.
 */
export interface RecordSelector {
  /**
   * Dotted path of the records in the data. The data itself where left out.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * True where the records form a list that a created record of the kind may join.
   */
  readonly list?: true | undefined;

  /**
   * The records' resource kind.
   */
  readonly type: ResourceReference;
}

/**
 * Describes a query a plugin runs.
 */
export interface QueryOptions<Data, Variables extends object> extends MarkerOptions {
  /**
   * Where the data states the person's actions on its records.
   */
  readonly decisions?: readonly DecisionSelector[] | undefined;

  /**
   * The operation the query runs.
   */
  readonly operation: Operation<Data, Variables, "query">;

  /**
   * Where the data contains records.
   */
  readonly records?: readonly RecordSelector[] | undefined;

  /**
   * The data tests and the standalone host serve, and the variables their pages run the query with.
   */
  readonly sample: { readonly data: NoInfer<Data>; readonly variables: NoInfer<Variables> };

  /**
   * Milliseconds the data is fresh. The client's 30 s where left out.
   */
  readonly staleTime?: number | undefined;
}

/**
 * Marks a query.
 */
export function query<const Data, const Variables extends object>(
  options: QueryOptions<Data, Variables>,
): QueryMarker<Data, Variables>;

/**
 * Describes which records a mutation changes.
 */
export interface ChangeSelector {
  /**
   * Whether the records are created, deleted or updated.
   */
  readonly action: "created" | "deleted" | "updated";

  /**
   * Name of the variable that contains the record's id. Absent for `created`.
   */
  readonly id?: string | undefined;

  /**
   * The records' resource kind.
   */
  readonly type: ResourceReference;
}

/**
 * Describes a mutation a plugin runs.
 */
export interface MutationOptions<Data, Variables extends object> extends MarkerOptions {
  /**
   * The records the mutation changes, invalidated once it settles.
   */
  readonly changes?: readonly ChangeSelector[] | undefined;

  /**
   * The operation the mutation runs.
   */
  readonly operation: Operation<Data, Variables, "mutation">;

  /**
   * The data tests and the standalone host serve, and the variables they run the mutation with.
   */
  readonly sample: { readonly data: NoInfer<Data>; readonly variables: NoInfer<Variables> };
}

/**
 * Marks a mutation.
 */
export function mutation<const Data, const Variables extends object>(
  options: MutationOptions<Data, Variables>,
): MutationMarker<Data, Variables>;
```

A contract lists them under `queries` and `mutations`. RFC-0010's `ReferenceKind` gains `query` and
`mutation`, and `self` gains `self.query(name)` and `self.mutation(name)`.

```ts
export const timeOffContract = defineContract("time-off", (self) => ({
  mutations: {
    approve: mutation({
      changes: [{ action: "updated", id: "id", type: self.resource("request") }],
      operation: approveMutation,
      sample: { data: { approved: true }, variables: { id: "7" } },
    }),
  },
  queries: {
    requests: query({
      decisions: [
        {
          at: "requests.items",
          field: "viewerCanApprove",
          id: "id",
          permission: self.permission("request.approve"),
        },
      ],
      operation: requestsQuery,
      records: [{ at: "requests.items", id: "id", list: true, type: self.resource("request") }],
      sample: { data: SAMPLE_REQUESTS, variables: {} },
    }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  routes: {
    overview: route({
      data: [{ query: self.query("requests"), variables: ["status"] }],
      navigation: { label: "navigation.overview", order: 30 },
      path: "time-off",
      search: z.object({ status: z.enum(["open", "approved"]).optional() }),
    }),
  },
}));
```

- Every query and mutation states a sample. The type requires it, because the plugin's tests and the
  standalone host run on it.
- A query's record and decision selectors use the resource kinds and the scoped permissions the
  contract declares, so a kind or a permission that does not exist fails to compile.
- A mutation's changes are data: the kind, and the variable that contains the id. `useChange` turns
  them into the foundation's `Change` values for each run, and the data client invalidates those
  once the run settles:
  - An updated or deleted record takes its id from the variable the declaration names. `useChange`
    skips the declaration for a run whose variable is not a string or a number.
  - A created record has an empty id, so the change refetches every list of its kind.

### The data a page needs

A route marker states the queries its page reads:

```ts
/**
 * Describes one query a page reads, and the names its variables take from the route.
 */
export interface RouteData<Name extends string = string> {
  /**
   * The query.
   */
  readonly query: Reference<"query">;

  /**
   * Variables the query takes from the route, each read from the parameters, then from the search.
   */
  readonly variables?: readonly Name[] | undefined;
}
```

- `RouteOptions` gains `data`, whose names are the parameters of the route's path and the members of
  its search (RFC-0010).
- The host compiles each plugin route with `loader: loadNeeds(needs)` of `provider-data`, one need
  per entry with the query's operation, its record selectors and the variable names (RFC-0005).
- The route's chunk and its data load together when the router preloads it on intent. A page that
  reads its data with `useData` then renders from the cache.
- The type checker refuses a variable name that is neither a parameter of the route's path nor a
  member of its search.
- The build checks a variable against the parameters of the route's path and its parents' paths,
  where neither the route nor a parent states a search, because the router merges a parent's
  parameters and search into its children's. A Standard Schema states no member names at run time,
  so a route under a search is the type checker's to check.

### Reading and changing data

`sdk-plugin` reads a declared query and runs a declared mutation with their declarations applied:

```ts
/**
 * Reads a declared query's data, suspending until it arrives, and renders again when it changes.
 *
 * @throws {@link Error} When no installed plugin declares the query.
 */
export function useData<Q extends QueryReference>(
  query: Q,
  variables: QueryVariables<Q>,
): QueryData<Q>;

/**
 * Runs a declared mutation. Once a run settles, the data client invalidates the records its
 * declared changes name.
 *
 * @throws {@link Error} When no installed plugin declares the mutation.
 */
export function useChange<M extends MutationReference>(
  mutation: M,
  options?: ChangeOptions<M>,
): OperationMutationResult<MutationData<M>, MutationVariables<M>>;

/**
 * Lists what a component states when it runs a declared mutation.
 */
export interface ChangeOptions<M extends MutationReference> {
  /**
   * The patches to apply at once to every query whose data contains a patched record.
   */
  readonly optimistic?: ((variables: MutationVariables<M>) => readonly RecordPatch[]) | undefined;

  /**
   * Scope whose mutations run one at a time, in the order they started, such as a record's id.
   */
  readonly scope?: string | undefined;
}
```

```tsx
export function Overview(): ReactNode {
  const { status } = useRouteSearch(timeOffContract.routes.overview);
  const { requests } = useData(timeOffContract.queries.requests, { status });
  const approve = useChange(timeOffContract.mutations.approve);

  return <RequestTable onApprove={(id) => approve.mutate({ id })} rows={requests.items} />;
}
```

- `useData` builds the query's options with `operationQuery`, with the declared record selectors and
  freshness, and reads them with the library's `useSuspenseQuery`. The same query and variables
  share one cache entry with the page's loader.
- `useChange` runs the mutation through `useOperationMutation`, with the declared changes. An
  optimistic patch is code, so the component states it. A scope is one string per hook, so a list
  that changes many records renders one `useChange` per record, with the record's id as its scope
  (RFC-0005).
- A plugin reads another plugin's query by reference, as it links to another plugin's page. Where
  the other plugin is optional, the component checks `useWhen({ plugin: inventoryContract })` first,
  because `useData` and `useChange` throw where no installed plugin declares the operation.
- A command reads and changes data through `HostApi.data`, which runs declared queries and mutations
  through the same client (RFC-0016).

### The host

The product passes the transport and the changes stream to `createHost` (RFC-0012):

```ts
const host = createHost({
  data: {
    changes: changesSubscription,
    transport: gatewayTransport({ token: identity.token, url: gatewayUrl }),
  },
  product,
  session: identitySession,
  store: localStore(),
});
```

| The host                                | Does                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creates the data client                 | With `createDataClient`, per page, or per request on a server                                                                                                       |
| Guards the transport                    | Refuses an operation no installed plugin declares, and every subscription but the product's changes stream, with `No installed plugin declares the operation <id>.` |
| Renders `DataProvider`                  | In `HostProvider`, around the router                                                                                                                                |
| Puts the client in the router's context | `HostRouterContext` gains `data`, the foundation's `DataContext`                                                                                                    |
| Primes decisions                        | Its `onData` finds the declared queries by operation id and primes the access store with one decision per record they state                                         |
| Resets the data                         | Calls `resetData` when the session's subject changes, beside moving the settings (RFC-0014)                                                                         |
| Sends the person to sign in             | `onUnauthenticated` reads the session again and invalidates the router, so the sign-in redirect applies                                                             |
| Announces changes                       | Emits `host/recordsChanged` with the changes of each declared mutation that succeeds, and with each batch of the changes stream                                     |

- `onData` runs for data a fetch returns and for data the page hydrates from a server render
  (RFC-0005), so a server-rendered list primes the decisions for its rows in the browser.
- Where more than one plugin declares an operation, each applies its own decision selectors to the
  operation's data.
- A primed decision is keyed by the permission's resource kind and the record's id, the key
  `useAccess` reads. A page that lists requests then sends no check for their Approve buttons
  (RFC-0014).
- The guarded transport announces the changes, because it sees both sources: a mutation's run and
  the stream's events.
- A declared mutation that succeeds announces the changes its declarations name for its variables. A
  refused one announces nothing, and the data client still invalidates its records once it settles.
- Each batch of the changes stream is announced after the data client receives it.
- `host/recordsChanged` is not sticky. A plugin that acts on a change, such as a toast for a request
  someone else approved, subscribes with `useEvent` (RFC-0016).

### Conditions on the record a slot renders

A slot that renders with one record states the record's kind, and an extension's condition may read
the record:

```ts
slots: {
  "item-actions": slot({ ...props<{ readonly record: Item }>(), record: self.resource("item") }),
},
```

```ts
extensions: {
  reorder: extension({
    position: "after",
    target: inventoryContract.slots["item-actions"],
    when: { field: { equals: 0, path: "stock" } },
  }),
},
```

```ts
/**
 * Describes a value the record a slot renders with must have.
 */
export interface FieldCondition {
  /**
   * Value the record's value must equal, compared strictly.
   */
  readonly equals?: boolean | number | string | null | undefined;

  /**
   * True where the value must be present, and false where it must be absent. Present means
   * neither undefined, null nor an empty array.
   */
  readonly exists?: boolean | undefined;

  /**
   * Dotted path of the value in the record.
   */
  readonly path: string;
}
```

- `When` gains `field`, a `FieldCondition` (RFC-0010). It is true where the value at `path` in the
  slot's `record` prop meets `equals` and `exists`, each where stated.
- `ConditionContext` gains `field?: (path: string) => unknown`. A slot with a record provides it
  when it evaluates its extensions' conditions (RFC-0013), and every other evaluation leaves it out.
- The build refuses a `field` member anywhere but in the condition of an extension whose target slot
  states `record`.
- A keyed slot selects an extension by the record's type (RFC-0013). A field condition selects it by
  the record's state.

### The build

`resolveProduct` checks the data declarations with the rest (RFC-0011):

| Check                                                                                                                                     | Result  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Two installed plugins declare one operation id under different kinds                                                                      | problem |
| Two installed plugins declare one operation id                                                                                            | warning |
| A route's data names a variable that is no parameter of its path or its parents' paths, where neither the route nor a parent has a search | problem |
| A decision's permission is not scoped, or its kind is not among the query's record kinds                                                  | problem |
| A record, decision or change selector names a resource kind no installed plugin declares                                                  | problem |
| A `field` condition is on anything but an extension of a slot that states `record`                                                        | problem |

The build writes a third catalogue beside the access and flag catalogues:

```ts
/**
 * Describes one query or mutation an installed plugin declares.
 */
export interface CataloguedOperation {
  /**
   * The id the gateway runs the operation under.
   */
  readonly id: string;

  /**
   * `"query"` for an operation that reads records, `"mutation"` for one that changes them.
   */
  readonly kind: "mutation" | "query";

  /**
   * Name of the declaration in its contract.
   */
  readonly name: string;

  /**
   * Id of the plugin that declares the operation.
   */
  readonly plugin: string;
}

/**
 * Describes every query and mutation a product's installed plugins declare, for the gateway's
 * publishing step.
 */
export interface OperationCatalogue {
  /**
   * Each declaration, in the order of the installed plugins.
   */
  readonly operations: readonly CataloguedOperation[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;
}
```

- The build writes it to `dist/.product/operations.json`. `CatalogueProduct` is the access
  catalogue's (RFC-0014).
- The deployment publishes the documents these ids name before the product goes live, so the gateway
  runs every operation the plugins need and refuses every other.
- The product's own operations, such as its changes subscription, are published with the product's
  own documents (RFC-0005).

### Tests and the standalone host

`checks()` gains these cases (RFC-0019):

| Case, after "checks that"                 | Passes when                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| query `<id>` finds records in its sample  | Each record and decision selector finds at least one record in the sample's data          |
| mutation `<id>` runs with its sample      | The mutation resolves with its sample, and its changes name variables its sample contains |
| route `<id>` loads its data at its sample | The route's loader resolves at its sample parameters on the sampled transport             |

- Every render case runs on a sampled transport built from the samples of the plugin and of the
  contracts in `beside`, so a page renders with data and no service.
- `renderPlugin` takes `samples`, which replace the contracts' samples per operation, including a
  refusal of any kind to render an error state.
- The standalone host's panel adds one control per declared operation. The control serves the
  sample, serves it after 2 seconds, or refuses as `network`, `not-found`, `forbidden`, `invalid` or
  `conflict`. The author sees each loading and error state without a service.

## Failure handling

| Failure                                                      | Detected by                | Outcome                                                                |
| ------------------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| A plugin runs an operation no installed plugin declares      | The host's transport guard | The operation fails, naming its id                                     |
| A plugin reads an optional plugin's query that is absent     | `useData`                  | Throws, naming the query                                               |
| A plugin runs an optional plugin's mutation that is absent   | `useChange`                | Throws, naming the mutation                                            |
| A selector finds no record in its sample                     | `checks()`                 | The case fails, naming the query and the selector                      |
| A decision member in a query's data is not a boolean         | The host                   | No decision is primed for that record, and `useAccess` asks the source |
| A route's data variable is absent from the route at run time | The gateway                | The query runs without it. A required variable is refused              |
| The person or the tenant changes                             | The host                   | `resetData`, then the new subject's decisions and data                 |

## Bounds

- A page's declared data costs one request per query and variables, sent with the page's chunk on
  intent.
- Priming decisions reads the decision selectors of a query's data once per arrival.
- The operation catalogue lists each declared query and mutation once.

## Alternatives considered

### Fragments composed into the owner's query

An extension declares the fields it needs of the slot's record as a document fragment, and the host
composes every fragment into the query of the plugin that renders the slot.

**Why not:** every plugin's document would depend on every extension installed, so the query a
plugin publishes would change with the product. An extension that needs data declares a query of its
own. Extensions that read one record share one cache entry through its key, and the gateway composes
fields across services.

### A data layer per plugin

Each plugin creates its own client and transport.

**Why not:** each plugin would keep its own cache, its own token handling and its own error model,
and one plugin's change would never invalidate another plugin's data.

### Operations the web package defines

A component defines and runs any operation it needs.

**Why not:** the build could not list the operations a product runs, so the gateway could not refuse
the rest, and the host could not load a page's data before its code runs.

### Decisions read by each component

Each component reads the person's actions off the records it renders.

**Why not:** a component would read the record's member and `useAccess` separately, and the two
could disagree. Priming the access store from the data gives every reader one decision, which the
access store already keeps for the session (RFC-0014).

## Drawbacks

- A contract lists its queries and mutations, so a new operation is a change to the contract package
  and a release of it.
- A sample is required for every operation, and a sample that drifts from the gateway's responses
  passes the plugin's checks.
- The type checker checks a route's data variables against its search, and the build cannot, because
  a Standard Schema states no member names at run time.
- An extension that needs data costs a request of its own where the owner's data does not contain
  it.

## Unresolved and future work

- Batching the operations one task sends into one request to the gateway.
- Samples generated from the gateway's schema, once codegen exists (RFC-0005).
- Subscriptions a plugin declares for live data beyond invalidation.

## References

| What                                 | Where                                                   |
| ------------------------------------ | ------------------------------------------------------- |
| The data foundation                  | `docs/rfc/0005-data.md`                                 |
| Contracts, markers and conditions    | `docs/rfc/0010-plugin-contracts.md`                     |
| Access and decisions on one resource | `docs/rfc/0014-plugin-access.md`                        |
| A validator typed by Standard Schema | `foundations/providers/router/src/declaration.ts:30-37` |
