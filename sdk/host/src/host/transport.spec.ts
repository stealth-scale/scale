import { describe, expect, it, vi } from "vitest";

import { type Change, type ChangeBatch, defineQuery } from "@stealthscale/provider-data";
import { sampledTransport } from "@stealthscale/provider-data/testing";

import { APPROVABLE, APPROVED, CHANGES, serving, streaming } from "#host/host.fixtures.ts";
import { APPROVE, OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { guardedTransport } from "#host/transport.ts";

describe("guardedTransport", () => {
  it("serves a declared query from its sample by default", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      product: PRODUCT,
    });

    await expect(transport.run(REQUEST, { id: "7" })).resolves.toStrictEqual(OPEN);
  });

  it("serves a declared mutation from its sample by default", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      product: PRODUCT,
    });

    await expect(transport.run(APPROVE, { requestId: "7" })).resolves.toStrictEqual(OPEN);
  });

  it("runs the product's transport where one is given", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      product: PRODUCT,
      transport: serving(APPROVABLE),
    });

    await expect(transport.run(REQUEST, { id: "7" })).resolves.toStrictEqual(APPROVABLE);
  });

  it("refuses an operation no installed plugin declares", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      product: PRODUCT,
    });

    await expect(transport.run(defineQuery("elsewhere~1~0000"), {})).rejects.toThrow(
      "No installed plugin declares the operation elsewhere~1~0000.",
    );
  });

  it("announces the changes of a declared mutation that resolves", async () => {
    const changed = vi.fn<(changes: readonly Change[]) => void>();

    await guardedTransport({ changed, product: PRODUCT }).run(APPROVE, { requestId: "7" });

    expect(changed.mock.lastCall).toStrictEqual([APPROVED.changes]);
  });

  it("announces nothing for a mutation the transport refuses", async () => {
    const changed = vi.fn<(changes: readonly Change[]) => void>();
    const transport = guardedTransport({
      changed,
      product: PRODUCT,
      transport: sampledTransport({}),
    });

    await transport.run(APPROVE, { requestId: "7" }).catch(() => null);

    expect(changed).not.toHaveBeenCalled();
  });

  it("announces nothing for a query", async () => {
    const changed = vi.fn<(changes: readonly Change[]) => void>();

    await guardedTransport({ changed, product: PRODUCT }).run(REQUEST, { id: "7" });

    expect(changed).not.toHaveBeenCalled();
  });

  it("refuses a subscription other than the changes stream", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      product: PRODUCT,
    });
    const next = vi.fn<(batch: ChangeBatch) => void>();

    await expect(
      transport.subscribe(CHANGES, {}, next, new AbortController().signal),
    ).rejects.toThrow("No installed plugin declares the operation people~1~changes.");
  });

  it("passes each batch of the changes stream on", async () => {
    const transport = guardedTransport({
      changed: vi.fn<(changes: readonly Change[]) => void>(),
      changes: CHANGES,
      product: PRODUCT,
      transport: streaming([APPROVED]),
    });
    const next = vi.fn<(batch: ChangeBatch) => void>();

    await transport.subscribe(CHANGES, {}, next, new AbortController().signal);

    expect(next.mock.calls).toStrictEqual([[APPROVED]]);
  });

  it("announces the changes of each batch", async () => {
    const changed = vi.fn<(changes: readonly Change[]) => void>();
    const transport = guardedTransport({
      changed,
      changes: CHANGES,
      product: PRODUCT,
      transport: streaming([APPROVED]),
    });

    await transport.subscribe(
      CHANGES,
      {},
      vi.fn<(batch: ChangeBatch) => void>(),
      new AbortController().signal,
    );

    expect(changed.mock.calls).toStrictEqual([[APPROVED.changes]]);
  });

  it("announces nothing for an event that is not a batch", async () => {
    const changed = vi.fn<(changes: readonly Change[]) => void>();
    const transport = guardedTransport({
      changed,
      changes: CHANGES,
      product: PRODUCT,
      transport: streaming([{ changed: true }]),
    });

    await transport.subscribe(
      CHANGES,
      {},
      vi.fn<(batch: ChangeBatch) => void>(),
      new AbortController().signal,
    );

    expect(changed).not.toHaveBeenCalled();
  });
});
