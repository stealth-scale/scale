/**
 * Builds the fetches and the responses the gateway's specification sends and reads.
 */

import { type Mock, vi } from "vitest";

import { streamOf } from "#events.fixtures.ts";
import { type GatewayOptions, gatewayTransport } from "#gateway.ts";
import { type Transport } from "#transport.ts";

/**
 * URL of the gateway the specification sends requests to.
 */
export const GATEWAY = "https://gateway.test/graphql";

/**
 * Media type of a response that streams events.
 */
const STREAM = { "Content-Type": "text/event-stream" };

/**
 * Types the fake fetch a specification passes to the transport.
 */
export type FakeFetch = Mock<typeof fetch>;

/**
 * Creates a fetch that resolves with each response in turn.
 *
 * @param responses - The response of each request, in order.
 * @returns The fetch.
 */
export function fetchOf(...responses: readonly Response[]): FakeFetch {
  const fake = vi.fn<typeof fetch>();

  for (const response of responses) fake.mockResolvedValueOnce(response);

  return fake;
}

/**
 * Creates a token function that resolves with one token, or with none.
 *
 * @param token - The token, or nothing for a page where nobody is signed in.
 * @returns The token function.
 */
export function tokenOf(token?: string): () => Promise<string | undefined> {
  return () => Promise.resolve(token);
}

/**
 * Creates a gateway transport over a fake fetch, with a token and the specification's URL.
 *
 * @param fake - The fetch.
 * @param options - Options over the specification's.
 * @returns The transport.
 */
export function gatewayOf(fake: FakeFetch, options: Partial<GatewayOptions> = {}): Transport {
  return gatewayTransport({ fetch: fake, token: tokenOf("t0ken"), url: GATEWAY, ...options });
}

/**
 * Returns the options of one request a fake fetch received.
 *
 * @param fake - The fetch.
 * @param index - Position of the request, the first by default.
 * @returns The request's options.
 */
export function sentOf(fake: FakeFetch, index = 0): RequestInit | undefined {
  return fake.mock.calls[index]?.[1];
}

/**
 * Builds a response whose body is a value as JSON.
 *
 * @param body - The value.
 * @param status - The HTTP status, 200 by default.
 * @returns The response.
 */
export function responseOf(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/graphql-response+json" },
    status,
  });
}

/**
 * Builds a 401 response without a body.
 *
 * @returns The response.
 */
export function refused(): Response {
  return new Response(null, { status: 401 });
}

/**
 * Builds a 401 response whose body reports when the reader cancels it.
 *
 * @param cancel - Called when the reader cancels the body.
 * @returns The response.
 */
export function refusedWith(cancel: (reason: unknown) => void): Response {
  return new Response(
    new ReadableStream<Uint8Array<ArrayBuffer>>({
      cancel,
      start(controller) {
        controller.enqueue(new TextEncoder().encode("expired"));
      },
    }),
    { status: 401 },
  );
}

/**
 * Waits until the request's signal aborts, then rejects with its reason, as a fetch does whose
 * gateway never responds. A signal that aborted before the call rejects at once, as in a browser.
 *
 * @param _input - The URL, which the fake ignores.
 * @param init - The request's options.
 * @returns A promise that rejects once the signal aborts.
 */
export function unanswered(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const signal = init?.signal;

  return new Promise((_resolve, reject) => {
    const fail = (): void => {
      // eslint-disable-next-line typescript/prefer-promise-reject-errors -- a fetch rejects with the signal's reason, whatever its type
      reject(signal?.reason);
    };

    if (signal?.aborted === true) fail();

    signal?.addEventListener("abort", fail);
  });
}

/**
 * Builds an event stream that sends each chunk and ends.
 *
 * @param chunks - The text of each chunk.
 * @returns The response.
 */
export function closedStream(...chunks: readonly string[]): Response {
  return new Response(streamOf(...chunks), { headers: STREAM });
}

/**
 * Builds a response whose body sends each chunk and runs until the request's signal aborts,
 * then fails with the signal's reason, as a browser's fetch does.
 *
 * @param init - The request's options.
 * @param chunks - The text of each chunk.
 * @returns The response.
 */
export function openStream(init: RequestInit | undefined, ...chunks: readonly string[]): Response {
  const encoder = new TextEncoder();
  const signal = init?.signal;

  return new Response(
    new ReadableStream<Uint8Array<ArrayBuffer>>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));

        signal?.addEventListener("abort", () => {
          controller.error(signal.reason);
        });
      },
    }),
    { headers: STREAM },
  );
}

/**
 * Builds an event stream that sends its chunks after a delay and ends, and fails when the request's
 * signal aborts first.
 *
 * @param init - The request's options.
 * @param delay - Milliseconds before the chunks.
 * @param chunks - The text of each chunk.
 * @returns The response.
 */
export function lateStream(
  init: RequestInit | undefined,
  delay: number,
  ...chunks: readonly string[]
): Response {
  const encoder = new TextEncoder();
  const signal = init?.signal;

  return new Response(
    new ReadableStream<Uint8Array<ArrayBuffer>>({
      start(controller) {
        signal?.addEventListener("abort", () => {
          controller.error(signal.reason);
        });
        setTimeout(() => {
          if (signal?.aborted === true) return;

          for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));

          controller.close();
        }, delay);
      },
    }),
    { headers: STREAM },
  );
}
