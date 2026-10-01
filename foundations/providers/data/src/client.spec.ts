import { dehydrate, hydrate, MutationObserver, QueryClient } from "@tanstack/react-query";
import { describe, expect, it, type MockInstance, vi } from "vitest";

import { built } from "#cache.fixtures.ts";
import { createDataClient, type OperationData, settingsOf } from "#client.ts";
import { DataError, type DataErrorKind } from "#errors.ts";
import { ADA, CHANGES, ONE, PERSON } from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";
import { sampledTransport } from "#testing.ts";
import { type Transport } from "#transport.ts";

/**
 * The options of the query every case reads.
 */
const OPTIONS = operationQuery(PERSON, { id: "7" }, { resources: [ONE] });

/**
 * Describes a client over a transport the case watches.
 */
interface Served {
  /**
   * The client.
   */
  readonly client: QueryClient;

  /**
   * A spy on the transport's `run`.
   */
  readonly run: MockInstance<Transport["run"]>;
}

/**
 * Builds a refusal of the query of a kind.
 *
 * @param kind - The kind.
 * @returns The refusal.
 */
function refusal(kind: DataErrorKind): DataError {
  return new DataError({ kind, message: kind, operation: PERSON.id });
}

/**
 * Runs a mutation the gateway refuses as unauthenticated.
 *
 * @returns A promise that rejects with the refusal.
 */
function unauthenticated(): Promise<never> {
  return Promise.reject(refusal("unauthenticated"));
}

/**
 * Dehydrates no query, as a stated rule over the foundation's.
 *
 * @returns False for every query.
 */
function dehydratesNothing(): boolean {
  return false;
}

/**
 * Creates a client whose transport serves the query's person.
 *
 * @param onData - Receives each arrival, where the case reads them.
 * @returns The client, and a spy on the transport's `run`.
 */
function served(onData?: (arrival: OperationData) => void): Served {
  const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
  const run = vi.spyOn(transport, "run");

  return { client: createDataClient({ onData, transport }), run };
}

describe("createDataClient", () => {
  it("runs a query's operation through the transport", async () => {
    const { client, run } = served();

    await expect(client.query(OPTIONS)).resolves.toStrictEqual(ADA);
    expect(run.mock.lastCall?.slice(0, 2)).toStrictEqual([
      { id: PERSON.id, kind: "query" },
      { id: "7" },
    ]);
  });

  it("passes the query's signal to the transport", async () => {
    const { client, run } = served();

    await client.query(OPTIONS);

    expect(run.mock.lastCall?.[2]?.signal).toBeInstanceOf(AbortSignal);
  });

  it("refuses a query whose key names no operation", async () => {
    const { client } = served();

    await expect(client.query({ queryKey: ["people"] })).rejects.toThrow(
      'The query ["people"] states no queryFn, and its key names no operation.',
    );
  });

  it("keeps a query's data fresh for 30 seconds", async () => {
    const { client, run } = served();

    await client.query(OPTIONS);
    await client.query(OPTIONS);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it("applies the stated default options over the foundation's", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
    const run = vi.spyOn(transport, "run");
    const client = createDataClient({ defaultOptions: { queries: { staleTime: 0 } }, transport });

    await client.query(OPTIONS);
    await client.query(OPTIONS);

    expect(run).toHaveBeenCalledTimes(2);
  });

  it.each(["network", "server"] as const)(
    "retries a query twice after a %s refusal",
    async (kind) => {
      const transport = sampledTransport({ [PERSON.id]: { error: refusal(kind) } });
      const run = vi.spyOn(transport, "run");
      const client = createDataClient({ transport });

      await expect(client.query({ ...OPTIONS, retryDelay: 0 })).rejects.toMatchObject({ kind });
      expect(run).toHaveBeenCalledTimes(3);
    },
  );

  it.each(["conflict", "forbidden", "invalid", "not-found", "unauthenticated"] as const)(
    "tries a query once after a %s refusal",
    async (kind) => {
      const transport = sampledTransport({ [PERSON.id]: { error: refusal(kind) } });
      const run = vi.spyOn(transport, "run");
      const client = createDataClient({ transport });

      await expect(client.query({ ...OPTIONS, retryDelay: 0 })).rejects.toMatchObject({ kind });
      expect(run).toHaveBeenCalledTimes(1);
    },
  );

  it("tries a query once after an error that is not a data error", async () => {
    const transport = sampledTransport({});
    const run = vi.spyOn(transport, "run");
    const client = createDataClient({ transport });

    await expect(client.query({ ...OPTIONS, retryDelay: 0 })).rejects.toThrow(PERSON.id);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("retries a mutation once after a network refusal", async () => {
    const mutationFn = vi.fn<() => Promise<never>>(() => Promise.reject(refusal("network")));
    const observer = new MutationObserver(createDataClient({ transport: sampledTransport({}) }), {
      mutationFn,
      retryDelay: 0,
    });

    await expect(observer.mutate()).rejects.toMatchObject({ kind: "network" });
    expect(mutationFn).toHaveBeenCalledTimes(2);
  });

  it("tries a mutation once after a server refusal", async () => {
    const mutationFn = vi.fn<() => Promise<never>>(() => Promise.reject(refusal("server")));
    const observer = new MutationObserver(createDataClient({ transport: sampledTransport({}) }), {
      mutationFn,
      retryDelay: 0,
    });

    await expect(observer.mutate()).rejects.toMatchObject({ kind: "server" });
    expect(mutationFn).toHaveBeenCalledTimes(1);
  });

  it("calls onUnauthenticated when a query is refused as unauthenticated", async () => {
    const onUnauthenticated = vi.fn<() => void>();
    const transport = sampledTransport({ [PERSON.id]: { error: refusal("unauthenticated") } });
    const client = createDataClient({ onUnauthenticated, transport });

    await expect(client.query(OPTIONS)).rejects.toBeInstanceOf(DataError);
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("calls onUnauthenticated when a mutation is refused as unauthenticated", async () => {
    const onUnauthenticated = vi.fn<() => void>();
    const client = createDataClient({ onUnauthenticated, transport: sampledTransport({}) });
    const observer = new MutationObserver(client, { mutationFn: unauthenticated });

    await expect(observer.mutate()).rejects.toBeInstanceOf(DataError);
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("leaves onUnauthenticated uncalled for another refusal", async () => {
    const onUnauthenticated = vi.fn<() => void>();
    const transport = sampledTransport({ [PERSON.id]: { error: refusal("forbidden") } });
    const client = createDataClient({ onUnauthenticated, transport });

    await expect(client.query(OPTIONS)).rejects.toBeInstanceOf(DataError);
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });

  it("refuses as unauthenticated where onUnauthenticated is left out", async () => {
    const transport = sampledTransport({ [PERSON.id]: { error: refusal("unauthenticated") } });

    await expect(createDataClient({ transport }).query(OPTIONS)).rejects.toMatchObject({
      kind: "unauthenticated",
    });
  });

  it("dehydrates a query that succeeded", async () => {
    const { client } = served();

    await client.query(OPTIONS);

    expect(dehydrate(client).queries).toHaveLength(1);
  });

  it("dehydrates a pending query without a failed attempt", () => {
    const { client } = served();

    built(client, OPTIONS);

    expect(dehydrate(client).queries).toHaveLength(1);
  });

  it("leaves a query that failed out of the page", () => {
    const { client } = served();

    built(client, OPTIONS).setState({ error: refusal("server"), status: "error" });

    expect(dehydrate(client).queries).toStrictEqual([]);
  });

  it("leaves a pending query with a failed attempt out of the page", () => {
    const { client } = served();

    built(client, OPTIONS).setState({ fetchFailureCount: 1 });

    expect(dehydrate(client).queries).toStrictEqual([]);
  });

  it("applies a stated dehydrate rule over the foundation's", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
    const client = createDataClient({
      defaultOptions: { dehydrate: { shouldDehydrateQuery: dehydratesNothing } },
      transport,
    });

    await client.query(OPTIONS);

    expect(dehydrate(client).queries).toStrictEqual([]);
  });

  it("reports the data a fetch returns", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();

    await served(onData).client.query(OPTIONS);

    expect(onData.mock.calls).toStrictEqual([
      [{ data: ADA, operation: PERSON.id, resources: [ONE], variables: { id: "7" } }],
    ]);
  });

  it("skips data a caller writes with setQueryData", () => {
    const onData = vi.fn<(arrival: OperationData) => void>();

    served(onData).client.setQueryData(OPTIONS.queryKey, ADA);

    expect(onData).not.toHaveBeenCalled();
  });

  it("reports a query the page hydrates from a server render", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();
    const server = served().client;

    await server.query(OPTIONS);
    hydrate(served(onData).client, dehydrate(server));

    expect(onData.mock.calls).toStrictEqual([
      [{ data: ADA, operation: PERSON.id, resources: [ONE], variables: { id: "7" } }],
    ]);
  });

  it("reports data the page hydrates into a query it built without data", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();
    const server = served().client;
    const browser = served(onData).client;

    await server.query(OPTIONS);
    built(browser, OPTIONS);
    hydrate(browser, dehydrate(server));

    expect(onData.mock.calls.map(([arrival]) => arrival.data)).toStrictEqual([ADA]);
  });

  it("skips the data a cancelled fetch restores", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();
    const { client, run } = served(onData);

    await client.query(OPTIONS);
    run.mockReturnValue(new Promise<never>(() => {}));

    const refetching = client.refetchQueries();

    await client.cancelQueries();
    await refetching;

    expect(onData).toHaveBeenCalledTimes(1);
  });

  it("reports nothing when the cache removes a query", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();
    const { client } = served(onData);

    await client.query(OPTIONS);
    client.removeQueries();

    expect(onData).toHaveBeenCalledTimes(1);
  });

  it("skips a query whose key is not an operation's", async () => {
    const onData = vi.fn<(arrival: OperationData) => void>();

    await served(onData).client.query({ queryFn: () => ADA, queryKey: ["people", "7"] });

    expect(onData).not.toHaveBeenCalled();
  });

  it("skips a query built with initial data", () => {
    const onData = vi.fn<(arrival: OperationData) => void>();
    const { client } = served(onData);

    built(client, { ...OPTIONS, initialData: ADA });

    expect(onData).not.toHaveBeenCalled();
  });

  it("keeps the transport with the changes stream of the client", () => {
    const transport = sampledTransport({});

    expect(settingsOf(createDataClient({ changes: CHANGES, transport }))).toStrictEqual({
      changes: CHANGES,
      transport,
    });
  });

  it("throws for a client that createDataClient did not create", () => {
    expect(() => settingsOf(new QueryClient())).toThrow(
      "The query client was not created by createDataClient",
    );
  });
});
