import { describe, expect, it, vi } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";
import { type HostReport } from "@stealthscale/sdk-plugin";
import { memoryStore } from "@stealthscale/settings";

import { ADA, GRACE, switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";
import { ignored, keyOf, SWITCHED } from "#stores/switches.fixtures.ts";
import { createSwitchStore } from "#stores/switches.ts";

describe("createSwitchStore", () => {
  it("reads a switch the person stored", () => {
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore({ [keyOf("ada@acme", "payroll")]: "off" }),
    });

    expect(store.get()).toStrictEqual({ billing: false, payroll: false });
  });

  it("takes the product's enabled where nothing is stored", () => {
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore(),
    });

    expect(store.get()).toStrictEqual({ billing: false, payroll: true });
  });

  it("reports a value stored for a locked plugin", () => {
    const report = vi.fn<(entry: HostReport) => void>();

    createSwitchStore({
      product: SWITCHED,
      report,
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore({ [keyOf("ada@acme", "time-off")]: "off" }),
    });

    expect(report.mock.lastCall).toStrictEqual([
      {
        key: keyOf("ada@acme", "time-off"),
        kind: "setting-dropped",
        reason: "the plugin is locked",
      },
    ]);
  });

  it("reads the product's enabled for a stored switch that is neither on nor off", () => {
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore({ [keyOf("ada@acme", "payroll")]: "maybe" }),
    });

    expect(store.get()["payroll"]).toBe(true);
  });

  it("reports a stored switch that is neither on nor off", () => {
    const report = vi.fn<(entry: HostReport) => void>();

    createSwitchStore({
      product: SWITCHED,
      report,
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore({ [keyOf("ada@acme", "payroll")]: "maybe" }),
    });

    expect(report.mock.lastCall).toStrictEqual([
      {
        key: keyOf("ada@acme", "payroll"),
        kind: "setting-dropped",
        reason: 'the stored switch is "maybe", neither "on" nor "off"',
      },
    ]);
  });

  it("stores a switch under the subject's key", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: settings,
    });

    store.set("billing", true);

    expect(settings.read(keyOf("ada@acme", "billing"))).toBe("on");
  });

  it("stores a switch under anyone for a session nobody signed in to", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({
        product: SWITCHED,
        report: ignored,
        source: switchable(NOBODY),
      }),
      store: settings,
    });

    store.set("payroll", false);

    expect(settings.read(keyOf("anyone", "payroll"))).toBe("off");
  });

  it("publishes a switch the person sets", () => {
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: memoryStore(),
    });

    store.set("billing", true);

    expect(store.get()["billing"]).toBe(true);
  });

  it("ignores a switch for a locked plugin", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: settings,
    });

    store.set("time-off", false);

    expect(settings.read(keyOf("ada@acme", "time-off"))).toBeNull();
  });

  it("follows a switch another tab writes", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: settings,
    });

    settings.write(keyOf("ada@acme", "payroll"), "off");

    expect(store.get()["payroll"]).toBe(false);
  });

  it("calls no listener when a write changes no switch", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: settings,
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    settings.write(keyOf("ada@acme", "payroll"), "on");

    expect(listener).not.toHaveBeenCalled();
  });

  it("reads the switches of another subject", () => {
    const source = switchable(ADA);
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source }),
      store: memoryStore({ [keyOf("grace@acme", "payroll")]: "off" }),
    });

    source.change(GRACE);

    expect(store.get()["payroll"]).toBe(false);
  });

  it("follows the keys of another subject alone", () => {
    const source = switchable(ADA);
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source }),
      store: settings,
    });

    source.change(GRACE);
    settings.write(keyOf("ada@acme", "payroll"), "off");

    expect(store.get()["payroll"]).toBe(true);
  });

  it("reads nothing again when the session keeps its subject", () => {
    const source = switchable(ADA);
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source }),
      store: memoryStore(),
    });
    const listener = vi.fn<() => void>();

    store.subscribe(listener);
    source.change({ ...ADA, roles: [] });

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops following its keys once disposed", () => {
    const settings = memoryStore();
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source: switchable(ADA) }),
      store: settings,
    });

    store.dispose();
    settings.write(keyOf("ada@acme", "payroll"), "off");

    expect(store.get()["payroll"]).toBe(true);
  });

  it("stops following the session once disposed", () => {
    const source = switchable(ADA);
    const store = createSwitchStore({
      product: SWITCHED,
      report: vi.fn<(entry: HostReport) => void>(),
      session: createSessionStore({ product: SWITCHED, report: ignored, source }),
      store: memoryStore({ [keyOf("grace@acme", "payroll")]: "off" }),
    });

    store.dispose();
    source.change(GRACE);

    expect(store.get()["payroll"]).toBe(true);
  });
});
