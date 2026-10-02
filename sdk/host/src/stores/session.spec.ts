import { describe, expect, it, vi } from "vitest";

import { constantSession, NOBODY, type Session, type SessionSource } from "@stealthscale/sdk-core";
import { type HostReport } from "@stealthscale/sdk-plugin";

import { PRODUCT } from "#host/product.fixtures.ts";
import { ADA, GRACE, switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";

describe("createSessionStore", () => {
  it("keeps the session the source reads", () => {
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: constantSession(ADA),
    });

    expect(store.get().session).toBe(ADA);
  });

  it("keeps the declared permissions alone", () => {
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: constantSession(ADA),
    });

    expect([...store.get().permissions]).toStrictEqual([
      "time-off/request.approve",
      "time-off/request.read",
    ]);
  });

  it("keeps the declared entitlements alone", () => {
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source: constantSession(ADA),
    });

    expect([...store.get().entitlements]).toStrictEqual(["time-off/module"]);
  });

  it("reads the session again when the source notifies", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });

    source.change(GRACE);

    expect([...store.get().permissions]).toStrictEqual(["billing/invoice.read"]);
  });

  it("reads the session again on refresh", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });

    source.replace(GRACE);
    store.refresh();

    expect(store.get().session).toBe(GRACE);
  });

  it("calls its listeners when the session changes", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    source.change(GRACE);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("calls no listener when the source returns the same session", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    source.change(ADA);

    expect(listener).not.toHaveBeenCalled();
  });

  it("keeps the last session when a read throws", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });

    source.fail(new Error("expired"));

    expect(store.get().session).toBe(ADA);
  });

  it("reports session-failed when a read throws", () => {
    const source = switchable(ADA);
    const report = vi.fn<(entry: HostReport) => void>();
    const failure = new Error("expired");

    createSessionStore({ product: PRODUCT, report, source });
    source.fail(failure);

    expect(report.mock.lastCall).toStrictEqual([{ error: failure, kind: "session-failed" }]);
  });

  it("starts from nobody when the first read throws", () => {
    const failure = new Error("expired");
    const source: SessionSource = {
      read: (): Session => {
        throw failure;
      },
      subscribe: () => () => {},
    };
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });

    expect(store.get().session).toBe(NOBODY);
  });

  it("stops listening to the source once disposed", () => {
    const source = switchable(ADA);
    const store = createSessionStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      source,
    });

    store.dispose();

    expect(source.listeners()).toBe(0);
  });
});
