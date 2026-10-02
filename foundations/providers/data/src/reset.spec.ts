import { CancelledError, MutationObserver, onlineManager } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { cached } from "#cache.fixtures.ts";
import { ADA, ONE, PERSON, type Person, RENAME } from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";
import { resetData } from "#reset.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";

/**
 * The options of the query every case reads.
 */
const OPTIONS = operationQuery(PERSON, { id: "7" }, { resources: [ONE] });

describe("resetData", () => {
  it("removes every query", async () => {
    const client = createTestDataClient(sampledTransport({}));

    cached(client, OPTIONS, ADA);
    await resetData(client);

    expect(client.getQueryCache().getAll()).toStrictEqual([]);
  });

  it("aborts a fetch in flight", async () => {
    const transport = sampledTransport({});
    const signals: AbortSignal[] = [];
    const client = createTestDataClient(transport);

    vi.spyOn(transport, "run").mockImplementation((_operation, _variables, run) => {
      if (run?.signal !== undefined) signals.push(run.signal);

      return new Promise<never>(() => {});
    });

    const fetching = client.query(OPTIONS);

    await resetData(client);

    await expect(fetching).rejects.toBeInstanceOf(CancelledError);
    expect(signals.map((signal) => signal.aborted)).toStrictEqual([true]);
  });

  it("removes a paused mutation rather than sending it", async () => {
    const transport = sampledTransport({ [RENAME.id]: { data: ADA } });
    const run = vi.spyOn(transport, "run");
    const client = createTestDataClient(transport);

    onlineManager.setOnline(false);

    const mutating = new MutationObserver(client, {
      mutationFn: (): Promise<Person> => transport.run(RENAME, ADA),
    }).mutate();

    await resetData(client);
    onlineManager.setOnline(true);
    await client.resumePausedMutations();

    expect(run).not.toHaveBeenCalled();
    await expect(Promise.race([mutating, Promise.resolve("waiting")])).resolves.toBe("waiting");
  });

  it("leaves a client that fetches again", async () => {
    const client = createTestDataClient(sampledTransport({ [PERSON.id]: { data: ADA } }));

    await client.query(OPTIONS);
    await resetData(client);

    await expect(client.query(OPTIONS)).resolves.toStrictEqual(ADA);
  });
});
