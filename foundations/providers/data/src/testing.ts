/**
 * Serves operations from samples, for a test and for an application in development without a
 * gateway.
 */

import { type QueryClient } from "@tanstack/react-query";

import { createDataClient } from "#client.ts";
import { type DataError } from "#errors.ts";
import { type Operation } from "#operation.ts";
import { type Transport } from "#transport.ts";

/**
 * Describes a sample that serves an operation's data.
 */
interface SampleData {
  /**
   * The data every run of the operation resolves with.
   */
  readonly data: unknown;
}

/**
 * Describes a sample that refuses an operation.
 */
interface SampleRefusal {
  /**
   * The refusal every run of the operation rejects with.
   */
  readonly error: DataError;
}

/**
 * Describes a sample that serves data computed from a run's variables.
 */
interface SampleResponse {
  /**
   * Returns the data a run resolves with, from the run's variables.
   */
  readonly respond: (variables: Readonly<Record<string, unknown>>) => unknown;
}

/**
 * Serves one operation with data, with a function of its variables, or with a refusal.
 */
export type Sample = SampleData | SampleRefusal | SampleResponse;

/**
 * Creates a transport that serves each operation from its sample, and refuses an operation without
 * one.
 *
 * @remarks
 *   A subscription streams nothing and ends when its signal aborts, so a changes stream runs
 *   without invalidating anything. An operation without a sample fails with an `Error` that names
 *   its id, so a test cannot pass on data it never stated.
 * @param samples - The sample of each operation, by id.
 * @returns A transport that sends no request.
 */
export function sampledTransport(samples: Readonly<Record<string, Sample>>): Transport {
  return {
    run: <Data>(
      operation: Operation<Data, object, "mutation" | "query">,
      variables: object,
    ): Promise<Data> => {
      const sample = samples[operation.id];

      if (sample === undefined) {
        return Promise.reject(
          new Error(`The sampled transport has no sample for ${operation.id}.`),
        );
      }

      if ("error" in sample) return Promise.reject(sample.error);

      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an operation's variables are a JSON object, which its type states member by member
      const stated = variables as Readonly<Record<string, unknown>>;
      const data = "respond" in sample ? sample.respond(stated) : sample.data;

      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a sample states the operation's data, which the test types
      return Promise.resolve(data as Data);
    },
    subscribe: (_operation, _variables, _next, signal) => {
      if (signal.aborted) return Promise.resolve();

      return new Promise((resolve) => {
        signal.addEventListener("abort", () => {
          resolve();
        });
      });
    },
  };
}

/**
 * Creates a client for a test, which never retries or streams changes and keeps data until the
 * test ends.
 *
 * @param transport - The transport, usually a sampled one.
 * @returns A client that runs every operation once.
 */
export function createTestDataClient(transport: Transport): QueryClient {
  return createDataClient({
    defaultOptions: {
      mutations: { gcTime: Infinity, retry: false },
      queries: { gcTime: Infinity, retry: false },
    },
    transport,
  });
}
