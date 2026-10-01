import { describe, expect, it, vi } from "vitest";

import { DataError } from "#errors.ts";
import {
  closedStream,
  fetchOf,
  GATEWAY,
  gatewayOf,
  lateStream,
  openStream,
  refused,
  refusedWith,
  responseOf,
  sentOf,
  tokenOf,
  unanswered,
} from "#gateway.fixtures.ts";
import { gatewayTransport } from "#gateway.ts";
import { ADA, MOVES, PERSON, RENAME } from "#operation.fixtures.ts";

/**
 * The event whose data is the count 1.
 */
const ONE = 'event: next\ndata: {"data":1}\n\n';

/**
 * The event whose data is the count 2.
 */
const TWO = 'event: next\ndata: {"data":2}\n\n';

/**
 * The event that ends a stream.
 */
const COMPLETE = "event: complete\ndata:\n\n";

/**
 * Returns a signal no case aborts.
 *
 * @returns The signal.
 */
function kept(): AbortSignal {
  return new AbortController().signal;
}

describe("gatewayTransport", () => {
  it("posts the document id with the variables as JSON", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    await gatewayOf(fake).run(PERSON, { id: "7" });

    expect(fake.mock.calls[0]?.[0]).toBe(GATEWAY);
    expect(sentOf(fake)?.method).toBe("POST");
    expect(sentOf(fake)?.body).toBe('{"documentId":"people~1~9c1e7a","variables":{"id":"7"}}');
  });

  it("sends the token as a bearer token", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    await gatewayOf(fake).run(PERSON, { id: "7" });

    expect(sentOf(fake)?.headers).toStrictEqual({
      Accept: "application/graphql-response+json, application/json",
      Authorization: "Bearer t0ken",
      "Content-Type": "application/json",
    });
  });

  it("sends no authorization header without a token", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    await gatewayOf(fake, { token: tokenOf() }).run(PERSON, { id: "7" });

    expect(sentOf(fake)?.headers).not.toHaveProperty("Authorization");
  });

  it("sends the idempotency key of a mutation as a header", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    await gatewayOf(fake).run(RENAME, ADA, { idempotencyKey: "a1b2" });

    expect(sentOf(fake)?.headers).toHaveProperty("Idempotency-Key", "a1b2");
  });

  it("sends requests through the global fetch by default", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    vi.stubGlobal("fetch", fake);

    await gatewayTransport({ token: tokenOf("t0ken"), url: GATEWAY }).run(PERSON, { id: "7" });

    expect(fake).toHaveBeenCalledTimes(1);
  });

  it("resolves with the data of the response", async () => {
    const fake = fetchOf(responseOf({ data: ADA }));

    await expect(gatewayOf(fake).run(PERSON, { id: "7" })).resolves.toStrictEqual(ADA);
  });

  it("renews the token after a 401", async () => {
    const fake = fetchOf(refused(), responseOf({ data: ADA }));
    const token = vi.fn<(renew: boolean) => Promise<string>>((renew) =>
      Promise.resolve(renew ? "renewed" : "expired"),
    );

    await expect(gatewayOf(fake, { token }).run(PERSON, { id: "7" })).resolves.toStrictEqual(ADA);
    expect(token.mock.calls).toStrictEqual([[false], [true]]);
    expect(sentOf(fake, 1)?.headers).toHaveProperty("Authorization", "Bearer renewed");
  });

  it("cancels the body of a 401 response", async () => {
    const cancel = vi.fn<(reason: unknown) => void>();

    await gatewayOf(fetchOf(refusedWith(cancel), responseOf({ data: ADA }))).run(PERSON, {
      id: "7",
    });

    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("rejects as unauthenticated when the gateway refuses the renewed token", async () => {
    const running = gatewayOf(fetchOf(refused(), refused())).run(PERSON, { id: "7" });

    await expect(running).rejects.toBeInstanceOf(DataError);
    await expect(running).rejects.toMatchObject({
      kind: "unauthenticated",
      message: "The gateway refused the renewed token for people~1~9c1e7a.",
      operation: "people~1~9c1e7a",
      status: 401,
    });
  });

  it("rejects with the kind of the first GraphQL error", async () => {
    const errors = [
      { extensions: { code: "FORBIDDEN" }, message: "Ada is private." },
      { extensions: { code: "NOT_FOUND" }, message: "Nothing here." },
    ];
    const running = gatewayOf(fetchOf(responseOf({ data: null, errors }))).run(PERSON, { id: "7" });

    await expect(running).rejects.toBeInstanceOf(DataError);
    await expect(running).rejects.toMatchObject({
      issues: [],
      kind: "forbidden",
      message: "Ada is private.",
      status: 200,
    });
  });

  it("reads the kind from the status when the GraphQL error states no code", async () => {
    const response = responseOf({ errors: [{ message: "Ada is private." }] }, 403);

    await expect(gatewayOf(fetchOf(response)).run(PERSON, { id: "7" })).rejects.toMatchObject({
      kind: "forbidden",
      status: 403,
    });
  });

  it("names the operation when the GraphQL error states no message", async () => {
    const response = responseOf({ errors: ["refused"] }, 500);

    await expect(gatewayOf(fetchOf(response)).run(PERSON, { id: "7" })).rejects.toMatchObject({
      kind: "server",
      message: "The gateway refused people~1~9c1e7a.",
    });
  });

  it("returns the issues of an invalid refusal", async () => {
    const issue = {
      keyword: "minLength",
      message: "Too short.",
      path: ["name"],
      values: { min: 2 },
    };
    const errors = [
      { extensions: { code: "BAD_USER_INPUT", issues: [issue] }, message: "Refused." },
    ];
    const running = gatewayOf(fetchOf(responseOf({ errors }))).run(RENAME, ADA);

    await expect(running).rejects.toMatchObject({ issues: [issue], kind: "invalid" });
  });

  it("drops an issue whose shape differs from a refused value's", async () => {
    const issue = { keyword: "pattern", message: "Letters only.", path: ["lines", 0], values: {} };
    const issues = [
      "name",
      { message: "Too short.", path: [], values: {} },
      { keyword: "minLength", path: [], values: {} },
      { keyword: "minLength", message: "Too short.", path: "name", values: {} },
      { keyword: "minLength", message: "Too short.", path: [{ at: "name" }], values: {} },
      { keyword: "minLength", message: "Too short.", path: [], values: 2 },
      issue,
    ];
    const errors = [{ extensions: { code: "BAD_USER_INPUT", issues } }];
    const running = gatewayOf(fetchOf(responseOf({ errors }))).run(RENAME, ADA);

    await expect(running).rejects.toMatchObject({ issues: [issue] });
  });

  it("derives the kind from the status of a response without a GraphQL error", async () => {
    const response = new Response("Not Found", { status: 404 });

    await expect(gatewayOf(fetchOf(response)).run(PERSON, { id: "7" })).rejects.toMatchObject({
      kind: "not-found",
      message: "The gateway returned 404 for people~1~9c1e7a.",
      status: 404,
    });
  });

  it("rejects as server when a successful response is not JSON", async () => {
    const response = new Response("<html></html>", { status: 200 });

    await expect(gatewayOf(fetchOf(response)).run(PERSON, { id: "7" })).rejects.toMatchObject({
      kind: "server",
      message: "The gateway's response to people~1~9c1e7a is not a GraphQL response.",
      status: 200,
    });
  });

  it("rejects as server when a successful response lists neither data nor errors", async () => {
    const running = gatewayOf(fetchOf(responseOf({ errors: [] }))).run(PERSON, { id: "7" });

    await expect(running).rejects.toMatchObject({ kind: "server", status: 200 });
  });

  it("rejects as network when the gateway is unreachable", async () => {
    const failure = new TypeError("Failed to fetch");
    const fake = vi.fn<typeof fetch>().mockRejectedValueOnce(failure);
    const running = gatewayOf(fake).run(PERSON, { id: "7" });

    await expect(running).rejects.toMatchObject({
      cause: failure,
      kind: "network",
      message: "The request for people~1~9c1e7a could not reach the gateway.",
    });
  });

  it("rejects as network when the request times out", async () => {
    const fake = vi.fn<typeof fetch>(unanswered);
    const running = gatewayOf(fake, { timeout: 10 }).run(PERSON, { id: "7" });

    await expect(running).rejects.toMatchObject({
      kind: "network",
      message: "The request for people~1~9c1e7a timed out.",
    });
  });

  it("rejects as network when the timeout ends the body", async () => {
    const fake = vi.fn<typeof fetch>((_input, init) =>
      Promise.resolve(openStream(init, '{"data":')),
    );
    const running = gatewayOf(fake, { timeout: 10 }).run(PERSON, { id: "7" });

    await expect(running).rejects.toMatchObject({
      kind: "network",
      message: "The request for people~1~9c1e7a timed out.",
    });
  });

  it("rejects with the caller's reason when the caller aborts", async () => {
    const controller = new AbortController();
    const reason = new Error("The page closed.");
    const running = gatewayOf(vi.fn<typeof fetch>(unanswered)).run(
      PERSON,
      { id: "7" },
      { signal: controller.signal },
    );

    controller.abort(reason);

    await expect(running).rejects.toBe(reason);
  });

  it("asks the gateway for an event stream", async () => {
    const fake = fetchOf(closedStream(COMPLETE));

    await gatewayOf(fake).subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    expect(sentOf(fake)?.headers).toHaveProperty("Accept", "text/event-stream");
    expect(sentOf(fake)?.body).toBe('{"documentId":"people~1~77aa01","variables":{}}');
  });

  it("passes the data of each next event to next", async () => {
    const next = vi.fn<(data: number) => void>();

    await gatewayOf(fetchOf(closedStream(ONE, TWO, COMPLETE))).subscribe(MOVES, {}, next, kept());

    expect(next.mock.calls).toStrictEqual([[1], [2]]);
  });

  it("stops reading at the complete event", async () => {
    const next = vi.fn<(data: number) => void>();

    await gatewayOf(fetchOf(closedStream(ONE, COMPLETE, TWO))).subscribe(MOVES, {}, next, kept());

    expect(next.mock.calls).toStrictEqual([[1]]);
  });

  it("resolves when the stream ends without a complete event", async () => {
    const next = vi.fn<(data: number) => void>();
    const subscribing = gatewayOf(fetchOf(closedStream(ONE))).subscribe(MOVES, {}, next, kept());

    await expect(subscribing).resolves.toBeUndefined();
    expect(next.mock.calls).toStrictEqual([[1]]);
  });

  it("skips an event of another name", async () => {
    const next = vi.fn<(data: number) => void>();
    const ping = "event: ping\ndata: {}\n\n";

    await gatewayOf(fetchOf(closedStream(ping, ONE))).subscribe(MOVES, {}, next, kept());

    expect(next.mock.calls).toStrictEqual([[1]]);
  });

  it("rejects with the GraphQL error of an event", async () => {
    const event = 'event: next\ndata: {"errors":[{"extensions":{"code":"FORBIDDEN"}}]}\n\n';
    const gateway = gatewayOf(fetchOf(closedStream(event)));
    const subscribing = gateway.subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    await expect(subscribing).rejects.toMatchObject({ kind: "forbidden", status: 200 });
  });

  it("rejects as server when an event is not JSON", async () => {
    const gateway = gatewayOf(fetchOf(closedStream("event: next\ndata: {oops\n\n")));
    const subscribing = gateway.subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    await expect(subscribing).rejects.toMatchObject({
      kind: "server",
      message: "An event of people~1~77aa01 is not a GraphQL response.",
    });
  });

  it("rejects with the gateway's refusal of the subscription", async () => {
    const errors = [{ extensions: { code: "BAD_USER_INPUT" }, message: "Unknown document." }];
    const gateway = gatewayOf(fetchOf(responseOf({ errors }, 400)));
    const subscribing = gateway.subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    await expect(subscribing).rejects.toMatchObject({ kind: "invalid", status: 400 });
  });

  it("rejects as server when the gateway opens no stream", async () => {
    const gateway = gatewayOf(fetchOf(new Response(null, { status: 204 })));
    const subscribing = gateway.subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    await expect(subscribing).rejects.toMatchObject({ kind: "server", status: 204 });
  });

  it("resolves when the caller aborts the stream", async () => {
    expect.hasAssertions();

    const controller = new AbortController();
    const next = vi.fn<(data: number) => void>();
    const fake = vi.fn<typeof fetch>((_input, init) => Promise.resolve(openStream(init, ONE)));
    const subscribing = gatewayOf(fake).subscribe(MOVES, {}, next, controller.signal);

    await vi.waitFor(() => {
      expect(next.mock.calls).toStrictEqual([[1]]);
    });
    controller.abort();

    await expect(subscribing).resolves.toBeUndefined();
  });

  it("rejects as network when the stream does not open in time", async () => {
    const gateway = gatewayOf(vi.fn<typeof fetch>(unanswered), { timeout: 10 });
    const subscribing = gateway.subscribe(MOVES, {}, vi.fn<(data: number) => void>(), kept());

    await expect(subscribing).rejects.toMatchObject({
      kind: "network",
      message: "The request for people~1~77aa01 timed out.",
    });
  });

  it("keeps the stream open past the timeout", async () => {
    const next = vi.fn<(data: number) => void>();
    const fake = vi.fn<typeof fetch>((_input, init) =>
      Promise.resolve(lateStream(init, 40, ONE, COMPLETE)),
    );
    const subscribing = gatewayOf(fake, { timeout: 10 }).subscribe(MOVES, {}, next, kept());

    await expect(subscribing).resolves.toBeUndefined();
    expect(next.mock.calls).toStrictEqual([[1]]);
  });
});
