# @stealthscale/provider-data

## 0.2.0

### Minor Changes

- [#44](https://github.com/stealth-scale/scale/pull/44) [`c2b043d`](https://github.com/stealth-scale/scale/commit/c2b043d8920079147cff49708eded5d946972096) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Add the package.
  - Add `defineQuery`, `defineMutation` and `defineSubscription`.
  - Add `gatewayTransport`, which posts each operation by id with a bearer token and renews the token
    once after a `401`.
  - Add `DataError`, its kinds, and `fieldErrorsOf`.
  - Add `createDataClient` and `DataProvider`, which runs the changes stream while mounted.
  - Add `operationQuery` and `operationKey`.
  - Add `useOperationMutation`, with an idempotency key per call, optimistic patches and a scope.
  - Add `invalidateChanges` and the resource selectors it reads.
  - Add `findRecords` and `FoundRecord`.
  - Add `mutateOperation`, which runs a mutation outside a component.
  - Add `useNetwork` and `resetData`.
  - Add `loadNeeds` and `setupDataIntegration` in `./router`.
  - Add `sampledTransport` and `createTestDataClient` in `./testing`.
  - Peer on `@tanstack/react-query` 5.104, and optionally on `@stealthscale/provider-router` and
    `@tanstack/react-router-ssr-query` 1.167.

### Patch Changes

- Updated dependencies [[`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706)]:
  - @stealthscale/provider-router@0.2.0
