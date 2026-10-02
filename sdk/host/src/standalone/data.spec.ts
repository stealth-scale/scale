import { describe, expect, it, vi } from "vitest";

import { DataError } from "@stealthscale/provider-data";

import { CHANGES } from "#host/host.fixtures.ts";
import { OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { DELAY, operationModes, standaloneTransport } from "#standalone/data.ts";

describe("standaloneTransport", () => {
  it("starts every operation at its sample", () => {
    expect(operationModes().get()).toStrictEqual({});
  });

  it("returns the mode the panel set for an operation", () => {
    const modes = operationModes();

    modes.set(REQUEST.id, "forbidden");

    expect(modes.get()).toStrictEqual({ [REQUEST.id]: "forbidden" });
  });

  it("calls each listener after a change", () => {
    const modes = operationModes();
    const listener = vi.fn<() => void>();

    modes.subscribe(listener);
    modes.set(REQUEST.id, "delayed");

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("stops calling a listener once its stop function runs", () => {
    const modes = operationModes();
    const listener = vi.fn<() => void>();

    modes.subscribe(listener)();
    modes.set(REQUEST.id, "delayed");

    expect(listener).not.toHaveBeenCalled();
  });

  it("serves an operation's sample", async () => {
    const transport = standaloneTransport(PRODUCT, operationModes());

    await expect(transport.run(REQUEST, { id: "7" })).resolves.toStrictEqual(OPEN);
  });

  it("serves a delayed operation's sample once the delay passed", async () => {
    vi.useFakeTimers();

    const modes = operationModes();

    modes.set(REQUEST.id, "delayed");

    const served = standaloneTransport(PRODUCT, modes).run(REQUEST, { id: "7" });

    await vi.advanceTimersByTimeAsync(DELAY);

    await expect(served).resolves.toStrictEqual(OPEN);

    vi.useRealTimers();
  });

  it("rejects a refused operation with a data error of the mode's kind", async () => {
    const modes = operationModes();

    modes.set(REQUEST.id, "not-found");

    const refused = standaloneTransport(PRODUCT, modes).run(REQUEST, { id: "7" });

    await expect(refused).rejects.toBeInstanceOf(DataError);
    await expect(refused).rejects.toMatchObject({ kind: "not-found", operation: REQUEST.id });
  });

  it("streams nothing for a subscription", async () => {
    const signal = AbortSignal.abort();
    const next = vi.fn<(data: unknown) => void>();
    const transport = standaloneTransport(PRODUCT, operationModes());

    await expect(transport.subscribe(CHANGES, {}, next, signal)).resolves.toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });
});
