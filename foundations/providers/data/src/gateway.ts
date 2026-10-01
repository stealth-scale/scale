/**
 * Sends operations to the GraphQL gateway that publishes them, by id.
 */

import { DataError, type DataIssue, kindOf } from "#errors.ts";
import { eventsOf } from "#events.ts";
import { type Operation } from "#operation.ts";
import { isRecord } from "#record.ts";
import { type RunOptions, type Transport } from "#transport.ts";

/**
 * Describes the options a gateway transport is created with.
 */
export interface GatewayOptions {
  /**
   * Function the transport sends requests with, the global `fetch` by default.
   */
  readonly fetch?: typeof fetch | undefined;

  /**
   * Milliseconds before a request fails as `network`, 30,000 by default.
   *
   * @remarks
   *   A query or a mutation has that long to complete. A subscription has that long to open its
   *   stream, which then runs until its signal aborts.
   */
  readonly timeout?: number | undefined;

  /**
   * Returns the signed-in person's token, or undefined where nobody is signed in. The transport
   * passes `renew` as true after the gateway refused the token it sent.
   */
  readonly token: (renew: boolean) => Promise<string | undefined>;

  /**
   * URL of the gateway's GraphQL endpoint.
   */
  readonly url: string;
}

/**
 * Milliseconds before a request fails where the options state no timeout.
 */
const TIMEOUT = 30_000;

/**
 * The HTTP status a gateway refuses a missing or expired token with.
 */
const UNAUTHORIZED = 401;

/**
 * Media types a query or a mutation accepts, the GraphQL response type first.
 */
const RESPONSE = "application/graphql-response+json, application/json";

/**
 * Media type a subscription accepts.
 */
const STREAM = "text/event-stream";

/**
 * Describes the operation a request runs, with its variables.
 */
interface Asked {
  /**
   * Id of the operation, which the body and every error name.
   */
  readonly operation: string;

  /**
   * The variables, sent as JSON.
   */
  readonly variables: object;
}

/**
 * Describes one request the transport sends.
 */
interface Sent {
  /**
   * The media types the request accepts.
   */
  readonly accept: string;

  /**
   * The JSON body, which contains the operation's id and its variables.
   */
  readonly body: string;

  /**
   * Key the gateway applies a mutation once for.
   */
  readonly idempotencyKey?: string | undefined;

  /**
   * Id of the operation, which every error names.
   */
  readonly operation: string;

  /**
   * Signal that aborts the request, on the timeout or at the caller's request.
   */
  readonly signal: AbortSignal;

  /**
   * Signal that aborts when the request exceeds the timeout.
   */
  readonly timeout: AbortSignal;
}

/**
 * Describes the part of a GraphQL response the transport reads.
 */
interface Result {
  /**
   * The operation's data.
   */
  readonly data: unknown;

  /**
   * The first error, where the response lists one.
   */
  readonly error?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Describes a subscription's stream once the gateway opened it.
 */
interface Opened {
  /**
   * The stream of events.
   */
  readonly body: ReadableStream<Uint8Array<ArrayBuffer>>;

  /**
   * The response's HTTP status, which an event's error reports.
   */
  readonly status: number;
}

/**
 * Writes the JSON body of a request: the operation's id as `documentId`, and its variables.
 *
 * @param asked - The operation and its variables.
 * @returns The body.
 */
function payloadOf(asked: Asked): string {
  return JSON.stringify({ documentId: asked.operation, variables: asked.variables });
}

/**
 * Reads the data and the first error of a GraphQL response body.
 *
 * @param body - The parsed body, whatever its shape.
 * @returns The data and the first error, or undefined where the body is not a GraphQL response.
 */
function resultOf(body: unknown): Result | undefined {
  if (!isRecord(body)) return undefined;

  const errors: unknown = body["errors"];

  if (Array.isArray(errors) && errors.length > 0) {
    const first: unknown = errors[0];

    return { data: body["data"], error: isRecord(first) ? first : {} };
  }

  return "data" in body ? { data: body["data"] } : undefined;
}

/**
 * Returns true for a path segment: a member's name or an index.
 */
function isSegment(value: unknown): value is number | string {
  return typeof value === "number" || typeof value === "string";
}

/**
 * Returns true for a value that has the shape of a refused value's issue.
 */
function isIssue(value: unknown): value is DataIssue {
  return (
    isRecord(value) &&
    typeof value["keyword"] === "string" &&
    typeof value["message"] === "string" &&
    Array.isArray(value["path"]) &&
    value["path"].every((segment: unknown) => isSegment(segment)) &&
    isRecord(value["values"])
  );
}

/**
 * Builds the data error for the first GraphQL error of a response.
 *
 * @remarks
 *   The error's `extensions.code` decides the kind, and the status decides it where the error
 *   states no code. An issue whose shape differs from a refused value's is left out.
 * @param operation - Id of the operation the error refuses.
 * @param error - The first error the response lists.
 * @param status - The response's HTTP status.
 * @returns The error, with the issues of an `invalid` refusal.
 */
function refusalOf(
  operation: string,
  error: Readonly<Record<string, unknown>>,
  status: number,
): DataError {
  const extensions = isRecord(error["extensions"]) ? error["extensions"] : {};
  const code = typeof extensions["code"] === "string" ? extensions["code"] : undefined;
  const issues = Array.isArray(extensions["issues"])
    ? extensions["issues"].filter((issue: unknown) => isIssue(issue))
    : [];
  const message =
    typeof error["message"] === "string" ? error["message"] : `The gateway refused ${operation}.`;

  return new DataError({ issues, kind: kindOf(code, status), message, operation, status });
}

/**
 * Returns what a request that did not complete rejects with.
 *
 * @param sent - The request.
 * @param cause - Why the request did not complete.
 * @returns A `network` error for a timeout or an unreachable gateway, or the cause itself where
 *   the caller aborted the request.
 */
function interruption(sent: Sent, cause: unknown): unknown {
  const { operation } = sent;

  if (sent.timeout.aborted) {
    return new DataError({
      cause,
      kind: "network",
      message: `The request for ${operation} timed out.`,
      operation,
    });
  }

  if (sent.signal.aborted) return cause;

  return new DataError({
    cause,
    kind: "network",
    message: `The request for ${operation} could not reach the gateway.`,
    operation,
  });
}

/**
 * Sends a request with a token.
 *
 * @param options - The gateway's options.
 * @param sent - The request.
 * @param token - The person's token, or undefined for a request without one.
 * @returns The response, whatever its status.
 * @throws {@link DataError} A `network` error where no response arrives.
 */
async function fetched(
  options: GatewayOptions,
  sent: Sent,
  token: string | undefined,
): Promise<Response> {
  const headers = {
    Accept: sent.accept,
    "Content-Type": "application/json",
    ...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
    ...(sent.idempotencyKey === undefined ? {} : { "Idempotency-Key": sent.idempotencyKey }),
  };

  try {
    return await (options.fetch ?? fetch)(options.url, {
      body: sent.body,
      headers,
      method: "POST",
      signal: sent.signal,
    });
  } catch (error: unknown) {
    throw interruption(sent, error);
  }
}

/**
 * Sends a request with the person's token, and once more with a renewed token where the gateway
 * refuses the first.
 *
 * @param options - The gateway's options.
 * @param sent - The request.
 * @param renew - True where the gateway refused the token of the previous attempt.
 * @returns The first response that is not a refusal of the token.
 * @throws {@link DataError} An `unauthenticated` error where the gateway refuses the renewed token.
 */
async function authorized(options: GatewayOptions, sent: Sent, renew: boolean): Promise<Response> {
  const response = await fetched(options, sent, await options.token(renew));

  if (response.status !== UNAUTHORIZED) return response;

  await response.body?.cancel();

  if (!renew) return authorized(options, sent, true);

  throw new DataError({
    kind: "unauthenticated",
    message: `The gateway refused the renewed token for ${sent.operation}.`,
    operation: sent.operation,
    status: UNAUTHORIZED,
  });
}

/**
 * Reads a response's body as JSON.
 *
 * @param response - The gateway's reply, whose body the request's signal can abort.
 * @param sent - The request.
 * @returns The parsed body, or undefined where the body is not JSON.
 * @throws {@link DataError} A `network` error where the request times out while the body arrives.
 */
async function bodyOf(response: Response, sent: Sent): Promise<unknown> {
  try {
    return await response.json();
  } catch (error: unknown) {
    if (sent.signal.aborted) throw interruption(sent, error);

    return undefined;
  }
}

/**
 * Builds the data error for a failed response: from the first GraphQL error it lists, else from
 * its status.
 *
 * @param sent - The request.
 * @param response - The gateway's reply, whose status the error reports.
 * @param result - The body as a GraphQL response, or undefined where it is not one.
 * @returns The error.
 */
function failureOf(sent: Sent, response: Response, result: Result | undefined): DataError {
  const { operation } = sent;
  const { status } = response;

  if (result?.error !== undefined) return refusalOf(operation, result.error, status);

  const message = response.ok
    ? `The gateway's response to ${operation} is not a GraphQL response.`
    : `The gateway returned ${String(status)} for ${operation}.`;

  return new DataError({ kind: kindOf(undefined, status), message, operation, status });
}

/**
 * Runs a query or a mutation and resolves with its data.
 *
 * @param options - The gateway's options.
 * @param asked - The operation and its variables.
 * @param run - The signal and the idempotency key of this run.
 * @returns The data.
 * @throws {@link DataError} When the request fails or the gateway refuses it.
 */
async function ran<Data>(
  options: GatewayOptions,
  asked: Asked,
  run: RunOptions | undefined,
): Promise<Data> {
  const timeout = AbortSignal.timeout(options.timeout ?? TIMEOUT);
  const sent: Sent = {
    accept: RESPONSE,
    body: payloadOf(asked),
    idempotencyKey: run?.idempotencyKey,
    operation: asked.operation,
    signal: run?.signal === undefined ? timeout : AbortSignal.any([timeout, run.signal]),
    timeout,
  };
  const response = await authorized(options, sent, false);
  const result = resultOf(await bodyOf(response, sent));

  if (!response.ok || result === undefined || result.error !== undefined) {
    throw failureOf(sent, response, result);
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the gateway's schema types the data, and the foundation does not validate it
  return result.data as Data;
}

/**
 * Parses an event's data as JSON.
 *
 * @param text - The event's data.
 * @returns The parsed value, or undefined where the text is not JSON.
 */
function parsedOf(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Reads a subscription's events and passes the data of each `next` event to `next`.
 *
 * @param operation - Id of the subscription.
 * @param opened - The open stream.
 * @param next - Receives the data of each event.
 * @returns Nothing. It resolves at the `complete` event or where the stream ends.
 * @throws {@link DataError} When an event contains an error or is not a GraphQL response.
 */
async function streamed(
  operation: string,
  opened: Opened,
  next: (data: unknown) => void,
): Promise<void> {
  for await (const event of eventsOf(opened.body)) {
    if (event.event === "complete") return;

    if (event.event === "next") {
      const result = resultOf(parsedOf(event.data));

      if (result === undefined) {
        throw new DataError({
          kind: "server",
          message: `An event of ${operation} is not a GraphQL response.`,
          operation,
        });
      }

      if (result.error !== undefined) throw refusalOf(operation, result.error, opened.status);

      next(result.data);
    }
  }
}

/**
 * Opens a subscription's stream before the timeout.
 *
 * @param options - The gateway's options.
 * @param sent - The request.
 * @param connecting - Controller the timeout aborts.
 * @returns The open stream.
 * @throws {@link DataError} When the gateway does not open the stream in time or refuses it.
 */
async function connected(
  options: GatewayOptions,
  sent: Sent,
  connecting: AbortController,
): Promise<Opened> {
  const timer = setTimeout(() => {
    connecting.abort();
  }, options.timeout ?? TIMEOUT);

  try {
    const response = await authorized(options, sent, false);

    if (response.ok && response.body !== null) {
      return { body: response.body, status: response.status };
    }

    throw failureOf(sent, response, resultOf(await bodyOf(response, sent)));
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Runs a subscription until the gateway ends its stream or the signal aborts.
 *
 * @param options - The gateway's options.
 * @param asked - The subscription and its variables.
 * @param next - Receives the data of each event.
 * @param signal - Aborts the subscription.
 * @returns Nothing. It resolves when the stream ends or the signal aborts.
 * @throws {@link DataError} When the stream does not open or ends with an error.
 */
async function subscribed(
  options: GatewayOptions,
  asked: Asked,
  next: (data: unknown) => void,
  signal: AbortSignal,
): Promise<void> {
  const connecting = new AbortController();
  const sent: Sent = {
    accept: STREAM,
    body: payloadOf(asked),
    operation: asked.operation,
    signal: AbortSignal.any([connecting.signal, signal]),
    timeout: connecting.signal,
  };

  try {
    await streamed(sent.operation, await connected(options, sent, connecting), next);
  } catch (error: unknown) {
    if (!signal.aborted) throw error;
  }
}

/**
 * Creates the transport that sends operations to the gateway by their ids.
 *
 * @remarks
 *   After a `401` the transport asks for a renewed token once and sends the request again. A
 *   mutation's idempotency key travels as the `Idempotency-Key` header. A subscription reads its
 *   events through `fetch`, because `EventSource` cannot send the `Authorization` header.
 * @param options - The gateway's URL and token, and the fetch and the timeout where stated.
 * @returns A transport whose every request goes to `options.url`.
 */
export function gatewayTransport(options: GatewayOptions): Transport {
  return {
    run: <Data, Variables extends object>(
      operation: Operation<Data, Variables, "mutation" | "query">,
      variables: Variables,
      run?: RunOptions,
    ): Promise<Data> => ran<Data>(options, { operation: operation.id, variables }, run),
    subscribe: <Data, Variables extends object>(
      operation: Operation<Data, Variables, "subscription">,
      variables: Variables,
      next: (data: Data) => void,
      signal: AbortSignal,
    ): Promise<void> =>
      subscribed(
        options,
        { operation: operation.id, variables },
        (data) => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the gateway's schema types each event's data, and the foundation does not validate it
          next(data as Data);
        },
        signal,
      ),
  };
}
