import { describe, expect, it, vi } from "vitest";

import { DataError } from "#errors.ts";
import { ADA, MOVES, PERSON, type Person } from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";

/**
 * A refusal a sample serves.
 */
const PRIVATE = new DataError({ kind: "forbidden", message: "private", operation: PERSON.id });

/**
 * Serves Ada under the id a run asks for.
 *
 * @param variables - The run's variables.
 * @returns The person.
 */
function respond(variables: Readonly<Record<string, unknown>>): Person {
  return { id: String(variables["id"]), name: "Ada" };
}

describe("testing", () => {
  it("serves an operation's data", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });

    await expect(transport.run(PERSON, { id: "7" })).resolves.toStrictEqual(ADA);
  });

  it("serves the data a sample's respond returns for the variables", async () => {
    const transport = sampledTransport({ [PERSON.id]: { respond } });

    await expect(transport.run(PERSON, { id: "9" })).resolves.toStrictEqual({
      id: "9",
      name: "Ada",
    });
  });

  it("refuses with a sample's error", async () => {
    const transport = sampledTransport({ [PERSON.id]: { error: PRIVATE } });

    await expect(transport.run(PERSON, { id: "7" })).rejects.toBe(PRIVATE);
  });

  it("refuses an operation without a sample by its id", async () => {
    await expect(sampledTransport({}).run(PERSON, { id: "7" })).rejects.toThrow(
      "The sampled transport has no sample for people~1~9c1e7a.",
    );
  });

  it("streams nothing until the signal aborts", async () => {
    const controller = new AbortController();
    const next = vi.fn<(data: number) => void>();
    const subscribing = sampledTransport({}).subscribe(MOVES, {}, next, controller.signal);

    controller.abort();

    await expect(subscribing).resolves.toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it("ends a stream at once for a signal that aborted", async () => {
    const next = vi.fn<(data: number) => void>();
    const subscribing = sampledTransport({}).subscribe(MOVES, {}, next, AbortSignal.abort());

    await expect(subscribing).resolves.toBeUndefined();
  });

  it("creates a client that runs queries through the transport", async () => {
    const client = createTestDataClient(sampledTransport({ [PERSON.id]: { data: ADA } }));

    await expect(client.query(operationQuery(PERSON, { id: "7" }))).resolves.toStrictEqual(ADA);
  });

  it("creates a client that never retries a query", async () => {
    const offline = new DataError({ kind: "network", message: "offline", operation: PERSON.id });
    const transport = sampledTransport({ [PERSON.id]: { error: offline } });
    const run = vi.spyOn(transport, "run");
    const client = createTestDataClient(transport);

    await expect(client.query(operationQuery(PERSON, { id: "7" }))).rejects.toBe(offline);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("creates a client that keeps data without a reader", () => {
    const client = createTestDataClient(sampledTransport({}));

    expect(client.getDefaultOptions().queries?.gcTime).toBe(Infinity);
  });
});
