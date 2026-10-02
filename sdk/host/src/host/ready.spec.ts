import { describe, expect, it, vi } from "vitest";

import { isPending } from "#host/host.fixtures.ts";
import { eagerTimeOff, failing, gate, lazyTimeOff, loading } from "#host/ready.fixtures.ts";
import { importEager, readied, within } from "#host/ready.ts";

describe("ready", () => {
  it("imports every module an eager plugin's manifest lists", async () => {
    const load = loading();

    await importEager(eagerTimeOff(load));

    expect(load).toHaveBeenCalledTimes(7);
  });

  it("imports no module of a plugin that is not eager", async () => {
    const load = loading();

    await importEager(lazyTimeOff(load));

    expect(load).not.toHaveBeenCalled();
  });

  it("resolves once an import fails", async () => {
    await expect(importEager(eagerTimeOff(failing()))).resolves.toBeUndefined();
  });

  it("resolves once the promise it waits for resolves", async () => {
    await expect(within(Promise.resolve(), 60_000)).resolves.toBeUndefined();
  });

  it("resolves once the promise it waits for rejects", async () => {
    await expect(within(Promise.reject(new Error("refused")), 60_000)).resolves.toBeUndefined();
  });

  it("resolves once the milliseconds pass", async () => {
    vi.useFakeTimers();

    try {
      const waited = within(gate().promise, 1000);

      await vi.advanceTimersByTimeAsync(1000);

      await expect(waited).resolves.toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("waits for the eager imports before it is ready", async () => {
    const imports = gate();
    const ready = readied(imports.promise, Promise.resolve(), 1000);

    await expect(isPending(ready)).resolves.toBe(true);

    imports.open();

    await expect(ready).resolves.toBeUndefined();
  });

  it("waits for the identification before it is ready", async () => {
    const identified = gate();
    const ready = readied(Promise.resolve(), identified.promise, 60_000);

    await expect(isPending(ready)).resolves.toBe(true);

    identified.open();

    await expect(ready).resolves.toBeUndefined();
  });
});
