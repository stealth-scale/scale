/**
 * Runs an operation's mutation from code outside a component, such as a command.
 */

import { MutationObserver, type QueryClient } from "@tanstack/react-query";

import { invalidateChanges } from "#changes.ts";
import { type DataError } from "#errors.ts";
import { type KeyedVariables, type OperationMutationOptions, runnerOf } from "#mutation.ts";
import { type Operation } from "#operation.ts";
import { OPERATION } from "#queries.ts";

/**
 * Runs an operation's mutation outside a component, and resolves with its data.
 *
 * @remarks
 *   A run takes what a call of `useOperationMutation`'s `mutate` takes: a fresh idempotency key
 *   that every retry repeats, the client's retry and its pause while offline, and the key
 *   `["operation", id]` that `useMutationState` filters by. Once the run settles either way, the
 *   changes it states are invalidated.
 * @param client - The data client.
 * @param operation - The mutation operation.
 * @param variables - The variables the mutation runs with.
 * @param options - The changes the mutation states, where it states any.
 * @returns A promise of the mutation's data, which rejects with its error.
 */
export function mutateOperation<Data, Variables extends object>(
  client: QueryClient,
  operation: Operation<Data, Variables, "mutation">,
  variables: Variables,
  options: Pick<OperationMutationOptions<Data, Variables>, "changes"> = {},
): Promise<Data> {
  const { changes } = options;
  const observer = new MutationObserver<Data, DataError, KeyedVariables<Variables>>(client, {
    mutationFn: runnerOf(client, operation),
    mutationKey: [OPERATION, operation.id],
    onSettled: (data, _error, keyed): Promise<void> =>
      invalidateChanges(client, changes?.(keyed.variables, data) ?? []),
  });

  return observer.mutate({ idempotencyKey: crypto.randomUUID(), variables });
}
