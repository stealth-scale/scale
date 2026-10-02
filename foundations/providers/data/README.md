# @stealthscale/provider-data

`@stealthscale/provider-data` reads and changes an application's data through the operations its
GraphQL gateway publishes. It builds on TanStack Query and adds the operation, the transport, the
error model, invalidation by record, the changes stream and the reset on a change of person.

## Install

```bash
pnpm add @stealthscale/provider-data @tanstack/react-query
```

The package peers on `@tanstack/react-query` and `react`. Its `./router` entry also peers on
`@stealthscale/provider-router` and `@tanstack/react-router-ssr-query`. It re-exports the hooks a
component reads data with: `useQuery`, `useSuspenseQuery`, `useQueries`, `useSuspenseQueries`,
`useInfiniteQuery`, `useSuspenseInfiniteQuery`, `useMutation`, `useMutationState`, `useIsFetching`,
`useIsMutating`, `useQueryClient`, `queryOptions`, `infiniteQueryOptions`, `skipToken`,
`keepPreviousData`, `onlineManager` and the `QueryClient` type.

## Define operations

Define one operation per published document. The id is the one the gateway runs the document under,
and the types state its data and its variables.

```ts
import { defineMutation, defineQuery } from "@stealthscale/provider-data";

export const requestById = defineQuery<RequestData, { readonly id: string }>("time-off~4~9c1e7a");

export const approveRequest = defineMutation<ApproveData, ApproveVariables>("time-off~4~41b0d2");
```

## Create the client

Create one client per page, and one per request on a server. Render it with `DataProvider` inside
`Shell`, around the router.

```tsx
import { createDataClient, DataProvider, gatewayTransport } from "@stealthscale/provider-data";

const client = createDataClient({
  changes: recordChanges,
  onUnauthenticated: () => router.navigate({ to: "/sign-in" }),
  transport: gatewayTransport({ token: (renew) => session.token(renew), url: gatewayUrl }),
});

<Shell app="people">
  <DataProvider client={client}>
    <RouterProvider router={router} />
  </DataProvider>
</Shell>;
```

- The gateway transport posts `{ documentId, variables }` with the person's token as a bearer token.
  After a `401` it asks `token(true)` for a renewed token once and sends the request again.
- A request fails as `network` after 30 seconds. Pass `timeout` to change it. A subscription has
  that long to open its stream.
- Queries are fresh for 30 seconds and retry twice for `network` and `server`. Mutations retry once
  for `network`. Pass `defaultOptions`, in the library's form, to change any of these.
- `onData` receives each query's data when it arrives from the gateway, after a fetch or when the
  page hydrates a server render. It does not receive data written with `setQueryData`.

## Read data

Build the library's options with `operationQuery` and read them with the library's hooks.

```tsx
const { data: request } = useSuspenseQuery(
  operationQuery(requestById, { id }, { resources: [REQUEST] }),
);
```

Components that ask for the same operation and variables share one request and one cache entry. Use
`select` for a list the page filters or orders, and put the filter in the variables where the
service applies it.

## Change data

```tsx
const approve = useOperationMutation(approveRequest, {
  changes: ({ id }) => [{ action: "updated", id, type: "time-off/request" }],
  optimistic: ({ id }) => [
    { apply: (request) => ({ ...request, status: "approved" }), id, type: "time-off/request" },
  ],
  scope: id,
});

approve.mutate({ id });
```

- Each call of `mutate` generates an idempotency key, and every retry of that call sends the same
  key as `Idempotency-Key`.
- `optimistic` patches every query whose data contains the record at once, and writes the data back
  when the service refuses the change. A patch that returns undefined removes the record from a
  list.
- Once the mutation settles, the patched records and the stated `changes` are invalidated.
- Mutations with the same `scope` run one at a time, in the order they started.
- The library keys the mutation `["operation", id]`. Filter `useMutationState` by that key to show a
  pending creation, whose `variables` are its `KeyedVariables`.

Run a mutation from code outside a component, such as a command, with `mutateOperation`:

```ts
import { mutateOperation } from "@stealthscale/provider-data";

const approved = await mutateOperation(
  client,
  approveRequest,
  { id },
  {
    changes: ({ id }) => [{ action: "updated", id, type: "time-off/request" }],
  },
);
```

- A run takes a fresh idempotency key that every retry repeats, retries by the client's defaults and
  waits while the page is offline.
- Once the run settles, the stated `changes` are invalidated. A run applies no optimistic patch.

## Invalidation by record

State where a query's data contains records, so a change to a record invalidates every query that
shows it.

```ts
const REQUESTS: ResourceSelector = {
  at: "requests.items",
  id: "id",
  list: true,
  type: "time-off/request",
};
```

| Change               | Invalidates                                               |
| -------------------- | --------------------------------------------------------- |
| `updated`, `deleted` | Every query whose selectors find the record's kind and id |
| `created`            | Every query with a `list` selector of the record's kind   |

`findRecords(data, selector)` returns each record a selector finds in a query's data, with its id as
a string. It walks the selector's path as invalidation does, every array on the way included, and
leaves out a record whose id is neither a string nor a number.

Changes arrive from three sources:

1. A mutation's `changes` and its patched records.
2. The changes subscription, which `DataProvider` runs while it is mounted. After the stream drops
   it reconnects after 1 second, doubling up to 30 seconds, and invalidates every query.
3. Your own call of `invalidateChanges(client, changes)`.

## Errors

Every refusal is a `DataError` with a `kind`:

| Kind              | GraphQL code      | Status              |
| ----------------- | ----------------- | ------------------- |
| `network`         | none              | no response         |
| `unauthenticated` | `UNAUTHENTICATED` | 401                 |
| `forbidden`       | `FORBIDDEN`       | 403                 |
| `not-found`       | `NOT_FOUND`       | 404                 |
| `conflict`        | `CONFLICT`        | 409                 |
| `invalid`         | `BAD_USER_INPUT`  | 400, 422            |
| `server`          | any other         | 429, 5xx, any other |

Return `fieldErrorsOf(error)` from a form's submit validator. It keys an `invalid` refusal's issues
by field name, and returns an issue at the root as `form`.

## Offline

`useNetwork()` returns `{ online, paused }`: whether the page is online, and how many mutations wait
to be sent. Render it in `AppShell.Status`.

## A change of person or tenant

Call `resetData(client)` when the signed-in person or the tenant changes. It cancels every fetch and
removes all cached data and every paused mutation, so nothing of the previous subject renders or
runs with the next person's token.

## Route loaders

The `./router` entry builds a route's loader from the queries its page reads. Put the client in the
router's context as `data`.

```ts
import { loadNeeds } from "@stealthscale/provider-data/router";

const loader = loadNeeds([{ operation: requestById, variables: ["id"] }]);
```

- Each variable is read from the route's parameters, then from its search, and left out where
  neither contains it.
- On a navigation the loader waits for each query. On a preload it starts each fetch and returns.
- A `not-found` refusal renders the router's not-found page.

## Server rendering

Create the client before the router's integration, then call `setupDataIntegration`.

```ts
import { setupDataIntegration } from "@stealthscale/provider-data/router";

setupDataIntegration({ client, router });
```

The server writes each query the render read into the page, and streams the ones that settle later.
A query that failed is left out of the page, and the browser fetches it again.

## Tests and development

The `./testing` entry serves operations from samples.

```ts
import { DataError } from "@stealthscale/provider-data";
import { createTestDataClient, sampledTransport } from "@stealthscale/provider-data/testing";

const client = createTestDataClient(
  sampledTransport({
    [requestById.id]: { data: REQUEST },
    [approveRequest.id]: {
      error: new DataError({ kind: "conflict", message: "stale", operation: approveRequest.id }),
    },
  }),
);
```

- An operation without a sample fails with an error whose message contains its id.
- The test client never retries and keeps data until the test ends.
- A sampled subscription does not send events, so a test that changes a record calls
  `invalidateChanges`.
