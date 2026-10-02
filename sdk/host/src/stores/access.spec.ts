import { describe, expect, it, vi } from "vitest";

import { decisionKey, type HostReport } from "@stealthscale/sdk-plugin";

import { PRODUCT } from "#host/product.fixtures.ts";
import { deciding, EIGHT, ELSEWHERE, settled, SEVEN } from "#stores/access.fixtures.ts";
import { createAccessStore, DENIED_FOR } from "#stores/access.ts";

describe("createAccessStore", () => {
  it("reports no source in its state where none is given", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.get().source).toBe(false);
  });

  it("reports a source in its state where one is given", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: deciding().source,
    });

    expect(store.get().source).toBe(true);
  });

  it("queues nothing without a source", async () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.request(SEVEN);
    await settled();

    expect(store.get().decisions.size).toBe(0);
  });

  it("sends every check one task requests in one call", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    store.request(EIGHT);
    await settled();

    expect(access.batches).toStrictEqual([[SEVEN, EIGHT]]);
  });

  it("sends a check once when one task requests it twice", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    store.request(SEVEN);
    await settled();

    expect(access.batches).toStrictEqual([[SEVEN]]);
  });

  it("writes the decisions the source returns", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    store.request(EIGHT);
    await settled();
    access.resolve([true, false]);
    await settled();

    expect([...store.get().decisions]).toStrictEqual([
      [decisionKey(SEVEN), true],
      [decisionKey(EIGHT), false],
    ]);
  });

  it("skips a check whose decision is known", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    access.resolve([true]);
    await settled();
    store.request(SEVEN);
    await settled();

    expect(access.batches).toHaveLength(1);
  });

  it("skips a check that is in flight", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    store.request(SEVEN);
    await settled();

    expect(access.batches).toHaveLength(1);
  });

  it("denies the checks of a batch the source rejects", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    access.reject(new Error("offline"));
    await settled();

    expect(store.get().decisions.get(decisionKey(SEVEN))).toBe(false);
  });

  it("reports access-failed for a batch the source rejects", async () => {
    const access = deciding();
    const report = vi.fn<(entry: HostReport) => void>();
    const failure = new Error("offline");
    const store = createAccessStore({ product: PRODUCT, report, source: access.source });

    store.request(SEVEN);
    await settled();
    access.reject(failure);
    await settled();

    expect(report.mock.lastCall).toStrictEqual([{ error: failure, kind: "access-failed" }]);
  });

  it("denies the checks of a batch whose result has another length", async () => {
    const access = deciding();
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createAccessStore({ product: PRODUCT, report, source: access.source });

    store.request(SEVEN);
    store.request(EIGHT);
    await settled();
    access.resolve([true]);
    await settled();

    expect([
      store.get().decisions.get(decisionKey(SEVEN)),
      store.get().decisions.get(decisionKey(EIGHT)),
    ]).toStrictEqual([false, false]);
  });

  it("asks again 30 seconds after a failed batch", async () => {
    vi.useFakeTimers();

    try {
      const access = deciding();
      const store = createAccessStore({
        product: PRODUCT,
        report: vi.fn<(entry: HostReport) => void>(),
        source: access.source,
      });

      store.request(SEVEN);
      await vi.advanceTimersByTimeAsync(0);
      access.reject(new Error("offline"));
      await vi.advanceTimersByTimeAsync(DENIED_FOR);

      expect(store.get().decisions.has(decisionKey(SEVEN))).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps a decision primed while a failed batch denies it", async () => {
    vi.useFakeTimers();

    try {
      const access = deciding();
      const store = createAccessStore({
        product: PRODUCT,
        report: vi.fn<(entry: HostReport) => void>(),
        source: access.source,
      });

      store.request(SEVEN);
      await vi.advanceTimersByTimeAsync(0);
      access.reject(new Error("offline"));
      await vi.advanceTimersByTimeAsync(0);
      store.prime([{ ...SEVEN, allowed: true }]);
      await vi.advanceTimersByTimeAsync(DENIED_FOR);

      expect(store.get().decisions.get(decisionKey(SEVEN))).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("primes the decisions of declared permissions", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.prime([{ ...SEVEN, allowed: true }]);

    expect(store.get().decisions.get(decisionKey(SEVEN))).toBe(true);
  });

  it("ignores a primed decision for a permission no installed plugin declares", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.prime([{ ...ELSEWHERE, allowed: true }]);

    expect(store.get().decisions.size).toBe(0);
  });

  it("forgets the decisions on one resource", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.prime([
      { ...SEVEN, allowed: true },
      { ...EIGHT, allowed: true },
    ]);
    store.forget(SEVEN.resource);

    expect([...store.get().decisions.keys()]).toStrictEqual([decisionKey(EIGHT)]);
  });

  it("forgets every decision where no resource is given", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.prime([
      { ...SEVEN, allowed: true },
      { ...EIGHT, allowed: true },
    ]);
    store.forget();

    expect(store.get().decisions.size).toBe(0);
  });

  it("drops every decision once cleared", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.prime([{ ...SEVEN, allowed: true }]);
    store.clear();

    expect(store.get().decisions.size).toBe(0);
  });

  it("writes nothing from a batch a clear overtook", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    store.clear();
    access.resolve([true]);
    await settled();

    expect(store.get().decisions.size).toBe(0);
  });

  it("reports nothing for a batch a clear overtook", async () => {
    const access = deciding();
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createAccessStore({ product: PRODUCT, report, source: access.source });

    store.request(SEVEN);
    await settled();
    store.clear();
    access.reject(new Error("offline"));
    await settled();

    expect(report).not.toHaveBeenCalled();
  });

  it("sends a check in flight to the source again once cleared", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    store.clear();
    await settled();

    expect(access.batches).toStrictEqual([[SEVEN], [SEVEN]]);
  });

  it("writes the decision the source returns for a check it was sent again", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    await settled();
    store.clear();
    await settled();
    access.resolve([false]);
    access.resolve([true]);
    await settled();

    expect(store.get().decisions.get(decisionKey(SEVEN))).toBe(true);
  });

  it("sends a check queued in the task of a clear once", async () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.request(SEVEN);
    store.clear();
    await settled();

    expect(access.batches).toStrictEqual([[SEVEN]]);
  });

  it("drops every decision when the source notifies", () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.prime([{ ...SEVEN, allowed: true }]);
    access.notify();

    expect(store.get().decisions.size).toBe(0);
  });

  it("stops listening to the source once disposed", () => {
    const access = deciding();
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: access.source,
    });

    store.dispose();

    expect(access.listeners()).toBe(0);
  });

  it("keeps a failed batch denied once disposed", async () => {
    vi.useFakeTimers();

    try {
      const access = deciding();
      const store = createAccessStore({
        product: PRODUCT,
        report: vi.fn<(entry: HostReport) => void>(),
        source: access.source,
      });

      store.request(SEVEN);
      await vi.advanceTimersByTimeAsync(0);
      access.reject(new Error("offline"));
      await vi.advanceTimersByTimeAsync(0);
      store.dispose();
      await vi.advanceTimersByTimeAsync(DENIED_FOR);

      expect(store.get().decisions.get(decisionKey(SEVEN))).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("writes the decisions a server render knew over the known ones", () => {
    const store = createAccessStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([[decisionKey(SEVEN), true]]);

    expect(store.get().decisions).toStrictEqual(new Map([[decisionKey(SEVEN), true]]));
  });
});
