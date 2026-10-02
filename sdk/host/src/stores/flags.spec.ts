import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { PRODUCT } from "#host/product.fixtures.ts";
import { settled } from "#stores/access.fixtures.ts";
import {
  CALENDAR,
  FLAGGED,
  flagging,
  KEY,
  LAYOUT,
  MISSTATED,
  SERVED,
  SYNC,
  tab,
} from "#stores/flags.fixtures.ts";
import { createFlagStore } from "#stores/flags.ts";
import { ADA, GRACE } from "#stores/session.fixtures.ts";

describe("createFlagStore", () => {
  it("returns the contract's default without a source", () => {
    const store = createFlagStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("returns undefined for a flag no installed plugin declares", () => {
    const store = createFlagStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.read("payroll/beta")).toBeUndefined();
  });

  it("returns the product's value over the contract's default", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("returns the source's value over the product's", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: false }, false).source,
    });

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("returns the product's value until the source identified the session", () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    void store.identify(ADA);

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("returns the source's value once the source identified the session", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    flags.finish();
    await identified;

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("passes the session to the source's identify", () => {
    const flags = flagging();
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    void store.identify(ADA);

    expect(flags.identified()).toStrictEqual([ADA]);
  });

  it("evaluates a flag on its first read alone", () => {
    const flags = flagging({}, false);
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    store.read(CALENDAR);
    store.read(CALENDAR);

    expect(flags.evaluated()).toStrictEqual([CALENDAR]);
  });

  it("publishes a first reading at the end of the task", async () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.read(CALENDAR);

    const during = store.get().readings.has(CALENDAR);

    await settled();

    expect([during, store.get().readings.get(CALENDAR)]).toStrictEqual([
      false,
      { origin: "product", value: true },
    ]);
  });

  it("calls no listener inside a first read", async () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    store.read(CALENDAR);

    const during = listener.mock.calls.length;

    await settled();

    expect([during, listener.mock.calls.length]).toStrictEqual([0, 1]);
  });

  it("publishes the first readings of one task in one change", async () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    store.read(CALENDAR);
    store.read(SYNC);
    await settled();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("ignores a source value of the wrong type", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: "yes" }, false).source,
    });

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("reports flag-ignored for a source value of the wrong type", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({
      product: FLAGGED,
      report,
      source: flagging({ [CALENDAR]: "yes" }, false).source,
    });

    store.read(CALENDAR);
    await settled();

    expect(report.mock.lastCall).toStrictEqual([
      { flag: CALENDAR, kind: "flag-ignored", source: "source", value: "yes" },
    ]);
  });

  it("ignores a variant the experiment does not declare", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [LAYOUT]: "grid" }, false).source,
    });

    expect(store.read(LAYOUT)).toBe("board");
  });

  it("ignores a product value of the wrong type", () => {
    const store = createFlagStore({
      product: { flags: MISSTATED, productId: "people" },
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("reports flag-ignored for a product value of the wrong type", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: { flags: MISSTATED, productId: "people" }, report });

    store.read(CALENDAR);
    await settled();

    expect(report.mock.lastCall).toStrictEqual([
      { flag: CALENDAR, kind: "flag-ignored", source: "product", value: "on" },
    ]);
  });

  it("ignores every variant of an experiment that lists none", () => {
    const store = createFlagStore({
      product: { flags: MISSTATED, productId: "people" },
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [LAYOUT]: "board" }, false).source,
    });

    expect(store.read(LAYOUT)).toBe("list");
  });

  it("returns the next value when the source throws for a flag", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: new Error("offline") }, false).source,
    });

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("reports flags-failed when the source throws for a flag", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const failure = new Error("offline");
    const store = createFlagStore({
      product: FLAGGED,
      report,
      source: flagging({ [CALENDAR]: failure }, false).source,
    });

    store.read(CALENDAR);
    await settled();

    expect(report.mock.lastCall).toStrictEqual([{ error: failure, kind: "flags-failed" }]);
  });

  it("reports flag-exposed on an experiment's first read", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    store.read(LAYOUT);
    await settled();

    expect(report.mock.calls).toStrictEqual([
      [{ flag: LAYOUT, kind: "flag-exposed", variant: "board" }],
    ]);
  });

  it("reports no exposure for a boolean flag", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    store.read(SYNC);
    await settled();

    expect(report).not.toHaveBeenCalled();
  });

  it("reports each variant the subject is served once", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const flags = flagging({ [LAYOUT]: "board" }, false);
    const store = createFlagStore({ product: FLAGGED, report, source: flags.source });

    store.read(LAYOUT);
    await settled();
    flags.change(LAYOUT, "board");

    expect(report).toHaveBeenCalledTimes(1);
  });

  it("reports an exposure for another variant the source serves", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const flags = flagging({ [LAYOUT]: "board" }, false);
    const store = createFlagStore({ product: FLAGGED, report, source: flags.source });

    store.read(LAYOUT);
    await settled();
    flags.change(LAYOUT, "list");

    expect(report.mock.lastCall).toStrictEqual([
      { flag: LAYOUT, kind: "flag-exposed", variant: "list" },
    ]);
  });

  it("reports the exposures again for another subject", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    await store.identify(ADA);
    store.read(LAYOUT);
    await settled();
    await store.identify(GRACE);

    expect(report).toHaveBeenCalledTimes(2);
  });

  it("reports no exposure again for the same subject", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    await store.identify(ADA);
    store.read(LAYOUT);
    await settled();
    await store.identify({ ...ADA, roles: [] });

    expect(report).toHaveBeenCalledTimes(1);
  });

  it("evaluates the read flags again when the source notifies", () => {
    const flags = flagging({ [CALENDAR]: false }, false);
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    store.read(CALENDAR);
    flags.change(CALENDAR, true);

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("calls its listeners when a notification changes a value", async () => {
    const flags = flagging({ [CALENDAR]: false }, false);
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const listener = vi.fn<() => void>();

    store.read(CALENDAR);
    await settled();
    store.subscribe(listener);
    flags.change(CALENDAR, true);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("calls no listener when a notification changes no value", async () => {
    const flags = flagging({ [CALENDAR]: false }, false);
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const listener = vi.fn<() => void>();

    store.read(CALENDAR);
    await settled();
    store.subscribe(listener);
    flags.change(CALENDAR, false);

    expect(listener).not.toHaveBeenCalled();
  });

  it("keeps the readings when the source notifies during an identify", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const first = store.identify(ADA);

    flags.finish();
    await first;
    store.read(CALENDAR);
    void store.identify(GRACE);
    flags.change(CALENDAR, true);

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("evaluates the read flags again once identify resolves", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    store.read(CALENDAR);
    flags.finish();
    await identified;

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("reports flags-failed when identify rejects", async () => {
    const flags = flagging();
    const report = vi.fn<(entry: HostReport) => void>();
    const failure = new Error("unreachable");
    const store = createFlagStore({ product: FLAGGED, report, source: flags.source });
    const identified = store.identify(ADA);

    flags.fail(failure);
    await identified;

    expect(report.mock.lastCall).toStrictEqual([{ error: failure, kind: "flags-failed" }]);
  });

  it("keeps the product's values when identify rejects", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    flags.fail(new Error("unreachable"));
    await identified;

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("ignores an identify that a later one overtook", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const first = store.identify(ADA);

    void store.identify(GRACE);
    flags.finish();
    await first;

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("reports nothing for a rejected identify that a later one overtook", async () => {
    const flags = flagging();
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report, source: flags.source });
    const first = store.identify(ADA);

    void store.identify(GRACE);
    flags.fail(new Error("unreachable"));
    await first;

    expect(report).not.toHaveBeenCalled();
  });

  it("returns an override over every other value", () => {
    const store = createFlagStore({
      overrides: tab().storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: true }, false).source,
    });

    store.override(CALENDAR, false);

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("lists an override in its state", () => {
    const store = createFlagStore({
      overrides: tab().storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(LAYOUT, "list");

    expect(store.get().overrides).toStrictEqual({ [LAYOUT]: "list" });
  });

  it("keeps the overrides in the tab's storage under the product's key", () => {
    const stored = tab();
    const store = createFlagStore({
      overrides: stored.storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(CALENDAR, false);

    expect(stored.storage.getItem(KEY)).toBe(JSON.stringify({ [CALENDAR]: false }));
  });

  it("removes an override where no value is given", () => {
    const store = createFlagStore({
      overrides: tab().storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(CALENDAR, false);
    store.override(CALENDAR);

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("removes the storage key once no override is left", () => {
    const stored = tab();
    const store = createFlagStore({
      overrides: stored.storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(CALENDAR, false);
    store.override(CALENDAR);

    expect(stored.text()).toBeNull();
  });

  it("ignores an override for a flag no installed plugin declares", () => {
    const store = createFlagStore({
      overrides: tab().storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override("payroll/beta", true);

    expect(store.get().overrides).toStrictEqual({});
  });

  it("ignores every override without the tab's storage", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(CALENDAR, false);

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("reports flag-ignored for an override of the wrong type", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ overrides: tab().storage, product: FLAGGED, report });

    store.override(LAYOUT, "grid");

    expect(report.mock.lastCall).toStrictEqual([
      { flag: LAYOUT, kind: "flag-ignored", source: "override", value: "grid" },
    ]);
  });

  it("keeps an override the storage refuses", () => {
    const store = createFlagStore({
      overrides: tab(undefined, true).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.override(CALENDAR, false);

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("reads the overrides the tab's storage keeps", () => {
    const store = createFlagStore({
      overrides: tab(JSON.stringify({ [CALENDAR]: false })).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("drops a stored override for a flag no installed plugin declares", () => {
    const store = createFlagStore({
      overrides: tab(JSON.stringify({ "payroll/beta": true })).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.get().overrides).toStrictEqual({});
  });

  it("reports flag-ignored for a stored override of the wrong type", () => {
    const report = vi.fn<(entry: HostReport) => void>();

    createFlagStore({
      overrides: tab(JSON.stringify({ [LAYOUT]: "grid" })).storage,
      product: FLAGGED,
      report,
    });

    expect(report.mock.lastCall).toStrictEqual([
      { flag: LAYOUT, kind: "flag-ignored", source: "override", value: "grid" },
    ]);
  });

  it.each([
    { label: "text that is not JSON", stored: "{" },
    { label: "a number", stored: "3" },
    { label: "null", stored: "null" },
  ])("reads no override from $label", ({ stored }) => {
    const store = createFlagStore({
      overrides: tab(stored).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    expect(store.get().overrides).toStrictEqual({});
  });

  it("evaluates a flag again once its override is removed", () => {
    const flags = flagging({ [CALENDAR]: false }, false);
    const store = createFlagStore({
      overrides: tab().storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    store.read(CALENDAR);
    store.override(CALENDAR, true);
    store.override(CALENDAR);
    store.read(CALENDAR);

    expect(flags.evaluated()).toStrictEqual([CALENDAR, CALENDAR]);
  });

  it("counts no exposure for an overridden experiment", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ overrides: tab().storage, product: FLAGGED, report });

    store.override(LAYOUT, "list");
    store.read(LAYOUT);
    await settled();

    expect(report).not.toHaveBeenCalled();
  });

  it("stops listening to the source once disposed", () => {
    const flags = flagging();
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    store.dispose();

    expect(flags.listeners()).toBe(0);
  });

  it("ignores an identify that resolves after dispose", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    store.dispose();
    flags.finish();
    await identified;

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("reads a hydrated reading over the source's value", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: false }, false).source,
    });

    store.hydrate([[CALENDAR, SERVED]]);

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("sets the tab's overrides aside while hydrated", () => {
    const store = createFlagStore({
      overrides: tab(JSON.stringify({ [CALENDAR]: false })).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([[CALENDAR, SERVED]]);

    expect([store.read(CALENDAR), store.get().overrides]).toStrictEqual([true, {}]);
  });

  it("keeps a hydrated reading when the source notifies", () => {
    const flags = flagging({ [CALENDAR]: true }, false);
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });

    store.hydrate([[CALENDAR, { origin: "source", value: false }]]);
    flags.change(CALENDAR, true);

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("keeps a hydrated reading when identify resolves", async () => {
    const flags = flagging({ [CALENDAR]: false });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    store.hydrate([[CALENDAR, SERVED]]);
    flags.finish();
    await identified;

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("applies the tab's overrides once settled", () => {
    const store = createFlagStore({
      overrides: tab(JSON.stringify({ [CALENDAR]: false })).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([[CALENDAR, SERVED]]);
    store.settle();

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("evaluates a hydrated flag through an identified source once settled", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: false }, false).source,
    });

    store.hydrate([[CALENDAR, SERVED]]);
    store.settle();

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("evaluates a hydrated flag without a source once settled", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([[CALENDAR, { origin: "source", value: false }]]);
    store.settle();

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("keeps a hydrated reading at settle while identify is pending", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flagging({ [CALENDAR]: true }).source,
    });

    void store.identify(ADA);
    store.hydrate([[CALENDAR, { origin: "source", value: false }]]);
    store.settle();

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("evaluates a hydrated flag once identify resolves after settle", async () => {
    const flags = flagging({ [CALENDAR]: true });
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
      source: flags.source,
    });
    const identified = store.identify(ADA);

    store.hydrate([[CALENDAR, { origin: "source", value: false }]]);
    store.settle();
    flags.finish();
    await identified;

    expect(store.read(CALENDAR)).toBe(true);
  });

  it("leaves out a hydrated reading for a flag no installed plugin declares", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([["payroll/beta", SERVED]]);

    expect(store.get().readings.has("payroll/beta")).toBe(false);
  });

  it("leaves out a hydrated reading whose value does not fit the flag", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.hydrate([[LAYOUT, { origin: "source", value: "grid" }]]);

    expect(store.read(LAYOUT)).toBe("board");
  });

  it("reports no exposure for a variant the server served the same subject", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    await store.identify(ADA);
    store.hydrate([[LAYOUT, { origin: "product", value: "board" }]], "ada@acme");
    store.settle();
    await settled();

    expect(report).not.toHaveBeenCalled();
  });

  it("reports an exposure for a variant the server served another subject", async () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createFlagStore({ product: FLAGGED, report });

    await store.identify(GRACE);
    store.hydrate([[LAYOUT, { origin: "product", value: "board" }]], "ada@acme");
    store.settle();
    await settled();

    expect(report).toHaveBeenCalledExactlyOnceWith({
      flag: LAYOUT,
      kind: "flag-exposed",
      variant: "board",
    });
  });

  it("keeps the tab's overrides at settle outside a hydration", () => {
    const store = createFlagStore({
      overrides: tab(JSON.stringify({ [CALENDAR]: false })).storage,
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.settle();

    expect(store.read(CALENDAR)).toBe(false);
  });

  it("returns a first reading in its snapshot before the reading is published", () => {
    const store = createFlagStore({
      product: FLAGGED,
      report: vi.fn<(entry: HostReport) => void>(),
    });

    store.read(CALENDAR);

    expect(store.snapshot()).toStrictEqual([[CALENDAR, { origin: "product", value: true }]]);
  });
});
