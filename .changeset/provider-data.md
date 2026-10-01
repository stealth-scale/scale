---
"@stealthscale/provider-data": minor
---

- Add the package.
- Add `defineQuery`, `defineMutation` and `defineSubscription`.
- Add `gatewayTransport`, which posts each operation by id with a bearer token and renews the token
  once after a `401`.
- Add `DataError`, its kinds, and `fieldErrorsOf`.
- Add `createDataClient` and `DataProvider`, which runs the changes stream while mounted.
- Add `operationQuery` and `operationKey`.
- Add `useOperationMutation`, with an idempotency key per call, optimistic patches and a scope.
- Add `invalidateChanges` and the resource selectors it reads.
- Add `useNetwork` and `resetData`.
- Add `loadNeeds` and `setupDataIntegration` in `./router`.
- Add `sampledTransport` and `createTestDataClient` in `./testing`.
- Peer on `@tanstack/react-query` 5.104, and optionally on `@stealthscale/provider-router` and
  `@tanstack/react-router-ssr-query` 1.167.
