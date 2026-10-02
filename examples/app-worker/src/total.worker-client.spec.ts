/**
 * Checks the client against a stand-in worker, with no worker runtime present.
 *
 * @remarks
 *   A real worker would put a thread and a module graph behind every assertion, for arithmetic
 *   these cases do not measure. The stand-in replies in the same turn as `postMessage`, the timing
 *   most likely to lose a reply.
 */

import { describe, expect, it } from "vitest";

import { type Amount } from "@stealthscale/example-lib-core";

import { type Reply, type Request, totalled, type Totaller } from "#total.worker-client.ts";

/**
 * Records what a stand-in worker received, and exposes the controls a case drives it with.
 */
interface Standing {
  /**
   * Dispatches an error event, as a throw inside the worker would.
   */
  readonly fail: (message: string) => void;

  /**
   * Counts the listeners registered at this moment, by event.
   */
  readonly listening: () => Record<string, number>;

  /**
   * Dispatches a reply for one request id.
   */
  readonly reply: (id: number, total: Amount | undefined) => void;

  /**
   * Every request `postMessage` received, in order.
   */
  readonly sent: Request[];

  /**
   * The stand-in worker a case passes to `totalled`.
   */
  readonly worker: Totaller;
}

/**
 * Returns a stand-in worker that records every request and replies as the case directs.
 *
 * @remarks
 *   Given an answer, `postMessage` dispatches the reply under the request's id before it returns,
 *   so a client that registered its listener after posting would miss it. Without an answer the
 *   worker stays silent until the case replies or fails it.
 * @param answer - The total to reply with immediately. Absent, the worker stays silent.
 */
function standing(answer?: { total: Amount | undefined }): Standing {
  const sent: Request[] = [];
  const listeners = {
    error: new Set<(event: ErrorEvent) => void>(),
    message: new Set<(event: MessageEvent<Reply>) => void>(),
  };
  const reply = (id: number, total: Amount | undefined): void => {
    for (const held of listeners.message) held({ data: { id, total } } as MessageEvent<Reply>);
  };

  return {
    fail: (message) => {
      for (const held of listeners.error) held({ message } as ErrorEvent);
    },
    listening: () => ({ error: listeners.error.size, message: listeners.message.size }),
    reply,
    sent,
    worker: {
      addEventListener: (of, held) => {
        // The stand-in keeps one set per event, and the client's listener is typed for that event.
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
        (listeners[of] as Set<unknown>).add(held);
      },
      postMessage: (request) => {
        sent.push(request);
        if (answer !== undefined) reply(request.id, answer.total);
      },
      removeEventListener: (of, held) => {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
        (listeners[of] as Set<unknown>).delete(held);
      },
    },
  };
}

describe("total.worker-client", () => {
  it("resolves with the total the worker replied", async () => {
    const held = standing({ total: { cents: 425, currency: "EUR" } });

    await expect(totalled(held.worker, [{ cents: 425, currency: "EUR" }])).resolves.toStrictEqual({
      cents: 425,
      currency: "EUR",
    });
  });

  it("posts the amounts of each run under a distinct id", async () => {
    const held = standing({ total: undefined });

    await totalled(held.worker, [{ cents: 1, currency: "EUR" }]);
    await totalled(held.worker, [{ cents: 2, currency: "EUR" }]);

    expect(held.sent.map((one) => one.amounts)).toStrictEqual([
      [{ cents: 1, currency: "EUR" }],
      [{ cents: 2, currency: "EUR" }],
    ]);
    expect(held.sent[0]?.id).not.toBe(held.sent[1]?.id);
  });

  it("resolves with undefined when the worker replies with no total", async () => {
    const held = standing({ total: undefined });

    await expect(totalled(held.worker, [])).resolves.toBeUndefined();
  });

  it("resolves each request in flight with the reply naming its id", async () => {
    const held = standing();
    const first = totalled(held.worker, [{ cents: 1, currency: "EUR" }]);
    const second = totalled(held.worker, [{ cents: 2, currency: "EUR" }]);
    const [one, two] = held.sent;

    held.reply(two?.id ?? 0, { cents: 2, currency: "EUR" });
    held.reply(one?.id ?? 0, { cents: 1, currency: "EUR" });

    await expect(first).resolves.toStrictEqual({ cents: 1, currency: "EUR" });
    await expect(second).resolves.toStrictEqual({ cents: 2, currency: "EUR" });
  });

  it("removes both listeners once the promise resolves", async () => {
    const held = standing({ total: undefined });

    await totalled(held.worker, []);

    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });

  it("rejects with the message the error event reported", async () => {
    const held = standing();
    const answer = totalled(held.worker, [{ cents: 1, currency: "EUR" }]);

    held.fail("mixed currencies");

    await expect(answer).rejects.toThrow("the worker failed: mixed currencies");
    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });

  it("rejects when the worker sends no reply before the timeout", async () => {
    const held = standing();

    await expect(totalled(held.worker, [{ cents: 1, currency: "EUR" }], 1)).rejects.toThrow(
      "answered nothing within 1 ms",
    );
    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });
});
