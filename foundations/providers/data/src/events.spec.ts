import { describe, expect, it } from "vitest";

import { streamOf } from "#events.fixtures.ts";
import { eventsOf, type StreamEvent } from "#events.ts";

/**
 * Reads every event of a body.
 *
 * @param body - The body.
 * @returns The events, in order.
 */
async function collected(body: ReadableStream<Uint8Array<ArrayBuffer>>): Promise<StreamEvent[]> {
  const events: StreamEvent[] = [];

  for await (const event of eventsOf(body)) events.push(event);

  return events;
}

describe("eventsOf", () => {
  it("reads each event a blank line ends", async () => {
    await expect(
      collected(streamOf("event: next\ndata: {}\n\nevent: complete\ndata:\n\n")),
    ).resolves.toStrictEqual([
      { data: "{}", event: "next" },
      { data: "", event: "complete" },
    ]);
  });

  it("joins the data lines of one event with line feeds", async () => {
    await expect(collected(streamOf("data: one\ndata: two\n\n"))).resolves.toStrictEqual([
      { data: "one\ntwo", event: "message" },
    ]);
  });

  it("skips a comment", async () => {
    await expect(collected(streamOf(": keep alive\ndata: one\n\n"))).resolves.toStrictEqual([
      { data: "one", event: "message" },
    ]);
  });

  it("drops one space after the colon", async () => {
    await expect(collected(streamOf("data:  two spaces\n\n"))).resolves.toStrictEqual([
      { data: " two spaces", event: "message" },
    ]);
  });

  it("reads a field without a colon as an empty value", async () => {
    await expect(collected(streamOf("data\n\n"))).resolves.toStrictEqual([
      { data: "", event: "message" },
    ]);
  });

  it("ignores a field it does not read", async () => {
    await expect(collected(streamOf("id: 7\nretry: 100\ndata: one\n\n"))).resolves.toStrictEqual([
      { data: "one", event: "message" },
    ]);
  });

  it("reads a line that arrives in two chunks", async () => {
    await expect(collected(streamOf("event: ne", "xt\ndata: {}\n", "\n"))).resolves.toStrictEqual([
      { data: "{}", event: "next" },
    ]);
  });

  it("drops the carriage return before a line feed", async () => {
    await expect(collected(streamOf("event: next\r\ndata: {}\r\n\r\n"))).resolves.toStrictEqual([
      { data: "{}", event: "next" },
    ]);
  });

  it("dispatches nothing for a blank line after no data", async () => {
    await expect(collected(streamOf("event: next\n\ndata: one\n\n"))).resolves.toStrictEqual([
      { data: "one", event: "message" },
    ]);
  });

  it("dispatches nothing for an event the stream did not finish", async () => {
    await expect(collected(streamOf("data: one\n\ndata: two\n"))).resolves.toStrictEqual([
      { data: "one", event: "message" },
    ]);
  });

  it("cancels the body when the caller stops reading", async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array<ArrayBuffer>>({
      cancel(): void {
        cancelled = true;
      },
      start(controller): void {
        controller.enqueue(new TextEncoder().encode("data: one\n\n"));
      },
    });

    for await (const event of eventsOf(body)) if (event.data === "one") break;

    expect(cancelled).toBe(true);
  });
});
