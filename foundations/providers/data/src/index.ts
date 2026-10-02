/**
 * Reads and changes an application's data through the operations its gateway publishes, over
 * TanStack Query: the transport, the query client, invalidation by record and the changes stream.
 *
 * The package re-exports the library's hooks by name, so a component reads data with them over the
 * options this package builds.
 *
 * @packageDocumentation
 */

export { type Change, type ChangeBatch, invalidateChanges } from "#changes.ts";
export { createDataClient, type DataClientOptions, type OperationData } from "#client.ts";
export {
  DataError,
  type DataErrorKind,
  type DataErrorOptions,
  type DataIssue,
  type FieldErrors,
  fieldErrorsOf,
} from "#errors.ts";
export { type GatewayOptions, gatewayTransport } from "#gateway.ts";
export { mutateOperation } from "#mutate.ts";
export {
  type KeyedVariables,
  type OperationMutateOptions,
  type OperationMutationOptions,
  type OperationMutationResult,
  useOperationMutation,
} from "#mutation.ts";
export { type Network, useNetwork } from "#network.ts";
export {
  defineMutation,
  defineQuery,
  defineSubscription,
  type NoVariables,
  type Operation,
  type OperationKind,
} from "#operation.ts";
export { DataProvider, type DataProviderProps } from "#provider.tsx";
export {
  type OperationKey,
  operationKey,
  type OperationQuery,
  operationQuery,
  type OperationQueryOptions,
} from "#queries.ts";
export { resetData } from "#reset.ts";
export {
  findRecords,
  type FoundRecord,
  type RecordPatch,
  type ResourceRef,
  type ResourceSelector,
} from "#resources.ts";
export * from "#tanstack.ts";
export { type RunOptions, type Transport } from "#transport.ts";
