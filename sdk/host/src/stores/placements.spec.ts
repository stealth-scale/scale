import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";
import { memoryStore } from "@stealthscale/settings";

import { PRODUCT } from "#host/product.fixtures.ts";
import { ADA_KEY, GRACE_KEY, parsedOf, sessionOf, storedOf } from "#stores/placements.fixtures.ts";
import { createPlacementStore } from "#stores/placements.ts";
import { ADA, GRACE, switchable } from "#stores/session.fixtures.ts";

describe("createPlacementStore", () => {
  it("reads the placements the person stored", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: storedOf({ "host/aside": { add: ["billing/total"] } }) }),
    });

    expect(store.get()).toStrictEqual({ "host/aside": { add: ["billing/total"] } });
  });

  it("reads no placements where nothing is stored", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore(),
    });

    expect(store.get()).toStrictEqual({});
  });

  it.each([
    {
      label: "a slot no installed plugin declares",
      reason: "host/nowhere is not a slot an installed plugin declares",
      slots: { "host/nowhere": { order: ["billing/total"] } },
    },
    {
      label: "a placement that is not an object",
      reason: "host/aside is not a placement",
      slots: { "host/aside": 3 },
    },
    {
      label: "an add to a slot that is not a region",
      reason: "time-off/request-sidebar.add places extensions in a slot that is not a region",
      slots: { "time-off/request-sidebar": { add: ["billing/total"] } },
    },
    {
      label: "a member that is not a list",
      reason: "host/aside.order is not a list",
      slots: { "host/aside": { order: "billing/total" } },
    },
  ])("reports $label", ({ reason, slots }) => {
    const report = vi.fn<(entry: HostReport) => void>();

    createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: storedOf(slots) }),
    });

    expect(report.mock.lastCall).toStrictEqual([{ key: ADA_KEY, kind: "setting-dropped", reason }]);
  });

  it("keeps the ids of a list that installed plugins declare", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore({
        [ADA_KEY]: storedOf({ "host/aside": { order: ["billing/gone", "billing/total"] } }),
      }),
    });

    expect(store.get()).toStrictEqual({ "host/aside": { order: ["billing/total"] } });
  });

  it("reports an id no installed plugin declares", () => {
    const report = vi.fn<(entry: HostReport) => void>();

    createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: storedOf({ "host/aside": { remove: ["billing/gone"] } }) }),
    });

    expect(report.mock.lastCall).toStrictEqual([
      {
        key: ADA_KEY,
        kind: "setting-dropped",
        reason: 'host/aside.remove lists "billing/gone", which no installed plugin declares',
      },
    ]);
  });

  it("keeps the other members of a placement whose add it drops", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore({
        [ADA_KEY]: storedOf({ "time-off/request-sidebar": { add: ["billing/total"], order: [] } }),
      }),
    });

    expect(store.get()).toStrictEqual({ "time-off/request-sidebar": { order: [] } });
  });

  it.each([
    { label: "is not JSON", reason: "the stored value is not JSON", stored: "{" },
    { label: "has no slots", reason: "the stored value has no slots", stored: "{}" },
    {
      label: "is an earlier version",
      reason: "the stored value is not version 1",
      stored: storedOf({}, 0),
    },
    {
      label: "states its version as text",
      reason: "the stored value is not version 1",
      stored: storedOf({}, "1"),
    },
  ])("reports a stored value that $label", ({ reason, stored }) => {
    const report = vi.fn<(entry: HostReport) => void>();

    createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: stored }),
    });

    expect(report.mock.lastCall).toStrictEqual([{ key: ADA_KEY, kind: "setting-dropped", reason }]);
  });

  it("reads no placements from a stored value of a later version", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: storedOf({ "host/aside": {} }, 2) }),
    });

    expect(store.get()).toStrictEqual({});
  });

  it("reports nothing for a stored value of a later version", () => {
    const report = vi.fn<(entry: HostReport) => void>();

    createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: memoryStore({ [ADA_KEY]: storedOf({ "host/aside": {} }, 2) }),
    });

    expect(report).not.toHaveBeenCalled();
  });

  it("reports a stored value once per text", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const stored = storedOf({ "host/nowhere": {} });
    const settings = memoryStore({ [ADA_KEY]: stored });

    createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: settings,
    });
    settings.write(ADA_KEY, stored);

    expect(report).toHaveBeenCalledTimes(1);
  });

  it("writes a change over the placements of the slots it does not name", () => {
    const settings = memoryStore({ [ADA_KEY]: storedOf({ "host/footer": { order: [] } }) });
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: settings,
    });

    store.update({ "host/aside": { add: ["billing/total"] } });

    expect(parsedOf(settings.read(ADA_KEY))).toStrictEqual({
      slots: { "host/aside": { add: ["billing/total"] }, "host/footer": { order: [] } },
      version: 1,
    });
  });

  it("publishes a change it writes", () => {
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: memoryStore(),
    });

    store.update({ "host/aside": { add: ["billing/total"] } });

    expect(store.get()).toStrictEqual({ "host/aside": { add: ["billing/total"] } });
  });

  it("reports a part of a change it drops", () => {
    const report = vi.fn<(entry: HostReport) => void>();
    const store = createPlacementStore({
      product: PRODUCT,
      report,
      session: sessionOf(switchable(ADA)),
      store: memoryStore(),
    });

    store.update({ "host/nowhere": { order: [] } });

    expect(report.mock.lastCall).toStrictEqual([
      {
        key: ADA_KEY,
        kind: "setting-dropped",
        reason: "host/nowhere is not a slot an installed plugin declares",
      },
    ]);
  });

  it("writes a change without the parts it drops", () => {
    const settings = memoryStore();
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: settings,
    });

    store.update({ "host/aside": { order: ["billing/total"] }, "host/nowhere": { order: [] } });

    expect(parsedOf(settings.read(ADA_KEY))).toStrictEqual({
      slots: { "host/aside": { order: ["billing/total"] } },
      version: 1,
    });
  });

  it("removes every placement on reset", () => {
    const settings = memoryStore({ [ADA_KEY]: storedOf({ "host/footer": { order: [] } }) });
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: settings,
    });

    store.reset();

    expect([store.get(), settings.read(ADA_KEY)]).toStrictEqual([{}, null]);
  });

  it("follows a change another tab writes", () => {
    const settings = memoryStore();
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(switchable(ADA)),
      store: settings,
    });

    settings.write(ADA_KEY, storedOf({ "host/footer": { order: [] } }));

    expect(store.get()).toStrictEqual({ "host/footer": { order: [] } });
  });

  it("reads the placements of another subject", () => {
    const source = switchable(ADA);
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(source),
      store: memoryStore({ [GRACE_KEY]: storedOf({ "host/footer": { order: [] } }) }),
    });

    source.change(GRACE);

    expect(store.get()).toStrictEqual({ "host/footer": { order: [] } });
  });

  it("follows the key of another subject alone", () => {
    const source = switchable(ADA);
    const settings = memoryStore();
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(source),
      store: settings,
    });

    source.change(GRACE);
    settings.write(ADA_KEY, storedOf({ "host/footer": { order: [] } }));

    expect(store.get()).toStrictEqual({});
  });

  it("reads nothing again when the session keeps its subject", () => {
    const source = switchable(ADA);
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(source),
      store: memoryStore(),
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    source.change({ ...ADA, roles: [] });

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops following once disposed", () => {
    const source = switchable(ADA);
    const settings = memoryStore();
    const store = createPlacementStore({
      product: PRODUCT,
      report: vi.fn<(entry: HostReport) => void>(),
      session: sessionOf(source),
      store: settings,
    });

    store.dispose();
    settings.write(ADA_KEY, storedOf({ "host/footer": { order: [] } }));
    source.change(GRACE);

    expect(store.get()).toStrictEqual({});
  });
});
