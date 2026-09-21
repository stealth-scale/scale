/**
 * Checks the client against a stand-in worker, with no worker runtime present.
 *
 * @remarks
 *   A real worker would make each assertion wait on a thread and a module graph for arithmetic
 *   these tests are not measuring. The stand-in answers in the same turn, which is also the timing
 *   most likely to lose a reply.
 */

import { describe, expect, it } from "vitest";

import { type Amount } from "@stealthscale/example-lib-core";

import { type Reply, type Request, totalled, type Totaller } from "#total.worker-client.ts";

/**
 * What a stand-in worker records and lets a case drive.
 */
interface Standing {
  /**
   * Fails the worker, as a thrown error inside it would.
   */
  readonly fail: (message: string) => void;

  /**
   * The listeners on at this moment, by event.
   */
  readonly listening: () => Record<string, number>;

  /**
   * Answers one request by its number.
   */
  readonly reply: (id: number, total: Amount | undefined) => void;

  /**
   * Every request the worker received.
   */
  readonly sent: Request[];

  /**
   * The stand-in itself.
   */
  readonly worker: Totaller;
}

/**
 * Builds a worker that records what it was sent and replies the way a case tells it to.
 *
 * @remarks
 *   With an answer given, the reply is delivered from inside postMessage, before it returns, and
 *   carries the request's own number. A client that registered its listener after sending would
 *   miss it, so this timing is what makes the ordering in the client observable. Without an
 *   answer the worker stays quiet until the case replies or fails it.
 * @param answer - The total to reply with at once. Leaving it out keeps the worker quiet.
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
  it("answers with what the worker replied", async () => {
    const held = standing({ total: { cents: 425, currency: "EUR" } });

    await expect(totalled(held.worker, [{ cents: 425, currency: "EUR" }])).resolves.toStrictEqual({
      cents: 425,
      currency: "EUR",
    });
  });

  it("sends the worker exactly what it was given under a number of its own", async () => {
    const held = standing({ total: undefined });

    await totalled(held.worker, [{ cents: 1, currency: "EUR" }]);
    await totalled(held.worker, [{ cents: 2, currency: "EUR" }]);

    expect(held.sent.map((one) => one.amounts)).toStrictEqual([
      [{ cents: 1, currency: "EUR" }],
      [{ cents: 2, currency: "EUR" }],
    ]);
    expect(held.sent[0]?.id).not.toBe(held.sent[1]?.id);
  });

  it("answers nothing where the worker had nothing to total", async () => {
    const held = standing({ total: undefined });

    await expect(totalled(held.worker, [])).resolves.toBeUndefined();
  });

  it("settles each of two runs in flight with its own total", async () => {
    const held = standing();
    const first = totalled(held.worker, [{ cents: 1, currency: "EUR" }]);
    const second = totalled(held.worker, [{ cents: 2, currency: "EUR" }]);
    const [one, two] = held.sent;

    held.reply(two?.id ?? 0, { cents: 2, currency: "EUR" });
    held.reply(one?.id ?? 0, { cents: 1, currency: "EUR" });

    await expect(first).resolves.toStrictEqual({ cents: 1, currency: "EUR" });
    await expect(second).resolves.toStrictEqual({ cents: 2, currency: "EUR" });
  });

  it("takes its listeners off once the total is in", async () => {
    const held = standing({ total: undefined });

    await totalled(held.worker, []);

    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });

  it("rejects with what the worker reported when it fails", async () => {
    const held = standing();
    const answer = totalled(held.worker, [{ cents: 1, currency: "EUR" }]);

    held.fail("mixed currencies");

    await expect(answer).rejects.toThrow("the worker failed: mixed currencies");
    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });

  it("rejects when the worker answers nothing within the patience", async () => {
    const held = standing();

    await expect(totalled(held.worker, [{ cents: 1, currency: "EUR" }], 1)).rejects.toThrow(
      "answered nothing within 1 ms",
    );
    expect(held.listening()).toStrictEqual({ error: 0, message: 0 });
  });
});
