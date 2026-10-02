import { type QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { cached } from "#cache.fixtures.ts";
import { type ChangeBatch } from "#changes.ts";
import { createDataClient, settingsOf } from "#client.ts";
import { ADA, CHANGES, ONE, PERSON, PERSON_KIND } from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";
import {
  type Connection,
  delivering,
  ended,
  failed,
  type Scripted,
  scripted,
} from "#stream.fixtures.ts";
import { streamChanges, waitBefore } from "#stream.ts";

/**
 * The options of the query every case reads.
 */
const OPTIONS = operationQuery(PERSON, { id: "7" }, { resources: [ONE] });

/**
 * A batch that reports Ada updated.
 */
const UPDATED: ChangeBatch = { changes: [{ action: "updated", id: "7", type: PERSON_KIND }] };

/**
 * Describes a stream a case started over a script.
 */
interface Started {
  /**
   * The client whose stream runs.
   */
  readonly client: QueryClient;

  /**
   * Controller whose abort stops the stream.
   */
  readonly controller: AbortController;

  /**
   * The promise the stream settles.
   */
  readonly streaming: Promise<void>;

  /**
   * The transport, whose subscriptions count the connections.
   */
  readonly transport: Scripted;
}

/**
 * Starts the changes stream of a client whose transport runs a script, with fake timers and each
 * wait at the middle of its variation.
 *
 * @param connections - The script's connections, in order.
 * @returns The running stream.
 */
function started(...connections: readonly Connection[]): Started {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0.5);

  const transport = scripted(...connections);
  const client = createDataClient({ changes: CHANGES, transport });
  const controller = new AbortController();
  const streaming = streamChanges(client, settingsOf(client), controller.signal);

  return { client, controller, streaming, transport };
}

/**
 * Stops a stream and puts the timers back.
 *
 * @param stream - The stream.
 */
async function stopped(stream: Started): Promise<void> {
  stream.controller.abort();
  await stream.streaming;
  vi.useRealTimers();
}

describe("streamChanges", () => {
  it.each([
    { attempt: 1, random: 0.5, want: 1000 },
    { attempt: 2, random: 0.5, want: 2000 },
    { attempt: 6, random: 0.5, want: 30_000 },
    { attempt: 1, random: 0, want: 800 },
    { attempt: 1, random: 1, want: 1200 },
  ])(
    "waits $want ms before attempt $attempt at the random $random",
    ({ attempt, random, want }) => {
      expect(waitBefore(attempt, random)).toBeCloseTo(want);
    },
  );

  it("resolves at once without a changes subscription", async () => {
    const transport = scripted();
    const client = createDataClient({ transport });

    await streamChanges(client, settingsOf(client), new AbortController().signal);

    expect(transport.subscribe).not.toHaveBeenCalled();
  });

  it("invalidates the records a batch reports", async () => {
    const stream = started(delivering(UPDATED));
    const query = cached(stream.client, OPTIONS, ADA);

    await vi.advanceTimersByTimeAsync(0);

    expect(query.state.isInvalidated).toBe(true);

    await stopped(stream);
  });

  it("leaves the queries valid on the first connection", async () => {
    const stream = started();
    const query = cached(stream.client, OPTIONS, ADA);

    await vi.advanceTimersByTimeAsync(0);

    expect(query.state.isInvalidated).toBe(false);

    await stopped(stream);
  });

  it.each([
    { connection: ended, label: "ends" },
    { connection: failed, label: "fails" },
  ])("reconnects after one second where the stream $label", async ({ connection }) => {
    const stream = started(connection);

    await vi.advanceTimersByTimeAsync(999);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(2);

    await stopped(stream);
  });

  it("invalidates every query when it reconnects", async () => {
    const stream = started(ended);
    const query = cached(stream.client, OPTIONS, ADA);

    await vi.advanceTimersByTimeAsync(1000);

    expect(query.state.isInvalidated).toBe(true);

    await stopped(stream);
  });

  it("waits twice as long after a connection that delivered nothing", async () => {
    const stream = started(ended, ended);

    await vi.advanceTimersByTimeAsync(2999);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(3);

    await stopped(stream);
  });

  it("waits one second again after a connection that delivered a batch", async () => {
    const stream = started(ended, delivering(UPDATED));

    await vi.advanceTimersByTimeAsync(2000);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(3);

    await stopped(stream);
  });

  it("stops without connecting again when the signal aborts during a wait", async () => {
    const stream = started(ended);

    await vi.advanceTimersByTimeAsync(0);
    stream.controller.abort();
    await vi.advanceTimersByTimeAsync(5000);

    expect(stream.transport.subscribe).toHaveBeenCalledTimes(1);

    await stopped(stream);
  });

  it("resolves once the signal aborts a quiet connection", async () => {
    const stream = started();

    await vi.advanceTimersByTimeAsync(0);
    stream.controller.abort();

    await expect(stream.streaming).resolves.toBeUndefined();

    vi.useRealTimers();
  });
});
