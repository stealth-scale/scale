import { describe, expect, it, vi } from "vitest";

import { PRODUCT } from "#host/product.fixtures.ts";
import {
  builtOf,
  LICENSED,
  LOCKED,
  NAMING,
  pluginOf,
  storesOf,
} from "#stores/availability.fixtures.ts";
import { GRACE } from "#stores/session.fixtures.ts";

describe("createAvailabilityStore", () => {
  it("turns on a plugin that passes every test", () => {
    expect(storesOf(PRODUCT).availability.get()["billing"]).toStrictEqual({ on: true });
  });

  it("turns off a plugin whose kill switch is off", () => {
    const stores = storesOf(PRODUCT);

    stores.flags.override("host/plugin.billing", false);

    expect(stores.availability.get()["billing"]).toStrictEqual({
      on: false,
      reason: "unavailable",
    });
  });

  it("turns off a plugin the person switched off", () => {
    expect(storesOf(PRODUCT, { billing: false }).availability.get()["billing"]).toStrictEqual({
      on: false,
      reason: "off",
    });
  });

  it("keeps a locked plugin on whatever its switch", () => {
    expect(storesOf(LOCKED, { billing: false }).availability.get()["billing"]).toStrictEqual({
      on: true,
    });
  });

  it("turns off a plugin whose condition is false", () => {
    expect(storesOf(LICENSED, {}, GRACE).availability.get()["billing"]).toStrictEqual({
      on: false,
      reason: "condition",
    });
  });

  it("turns off a plugin whose required plugin is off", () => {
    expect(storesOf(PRODUCT, { "time-off": false }).availability.get()["payroll"]).toStrictEqual({
      on: false,
      reason: "requirement",
    });
  });

  it("keeps a plugin on whose optional requirement is off", () => {
    const product = builtOf([
      pluginOf("audit", [{ optional: true, pluginId: "identity", range: "^1.0.0" }]),
      pluginOf("identity"),
    ]);

    expect(storesOf(product, { identity: false }).availability.get()["audit"]).toStrictEqual({
      on: true,
    });
  });

  it("turns off a plugin whose required plugin is not installed", () => {
    const product = builtOf([pluginOf("audit", [{ pluginId: "identity", range: "^1.0.0" }])]);

    expect(storesOf(product).availability.get()["audit"]).toStrictEqual({
      on: false,
      reason: "requirement",
    });
  });

  it("computes a plugin its condition names first", () => {
    expect(storesOf(NAMING).availability.get()["billing"]).toStrictEqual({ on: true });
  });

  it("reads a plugin on a ring as off", () => {
    const product = builtOf([
      pluginOf("alpha", [{ pluginId: "beta", range: "^1.0.0" }]),
      pluginOf("beta", [{ pluginId: "alpha", range: "^1.0.0" }]),
    ]);

    expect(storesOf(product).availability.get()["alpha"]).toStrictEqual({
      on: false,
      reason: "requirement",
    });
  });

  it("gives the reason of the first test that fails", () => {
    const stores = storesOf(PRODUCT, { billing: false });

    stores.flags.override("host/plugin.billing", false);

    expect(stores.availability.get()["billing"]).toStrictEqual({
      on: false,
      reason: "unavailable",
    });
  });

  it("computes again when a switch changes", () => {
    const stores = storesOf(PRODUCT);

    stores.switches.set({ billing: false });

    expect(stores.availability.get()["billing"]).toStrictEqual({ on: false, reason: "off" });
  });

  it("computes again when the session changes", () => {
    const stores = storesOf(LICENSED);

    stores.source.change(GRACE);

    expect(stores.availability.get()["billing"]).toStrictEqual({
      on: false,
      reason: "condition",
    });
  });

  it("passes no plugin to changed at start", () => {
    expect(storesOf(PRODUCT, { billing: false }).changed).not.toHaveBeenCalled();
  });

  it("passes a plugin that turns off to changed", () => {
    const stores = storesOf(PRODUCT);

    stores.switches.set({ billing: false });

    expect(stores.changed.mock.calls).toStrictEqual([
      [{ on: false, pluginId: "billing", reason: "off" }],
    ]);
  });

  it("passes a plugin that turns on to changed", () => {
    const stores = storesOf(PRODUCT, { billing: false });

    stores.switches.set({});

    expect(stores.changed.mock.calls).toStrictEqual([[{ on: true, pluginId: "billing" }]]);
  });

  it("passes a plugin that turns off with its requirement to changed", () => {
    const stores = storesOf(PRODUCT);

    stores.switches.set({ "time-off": false });

    expect(stores.changed.mock.calls).toStrictEqual([
      [{ on: false, pluginId: "time-off", reason: "off" }],
      [{ on: false, pluginId: "payroll", reason: "requirement" }],
    ]);
  });

  it("publishes a change of reason without passing it to changed", () => {
    const stores = storesOf(PRODUCT, { billing: false });

    stores.flags.override("host/plugin.billing", false);

    expect([stores.availability.get()["billing"], stores.changed.mock.calls]).toStrictEqual([
      { on: false, reason: "unavailable" },
      [],
    ]);
  });

  it("calls no listener when a computation changes nothing", () => {
    const stores = storesOf(PRODUCT, { billing: false });
    const listener = vi.fn<() => void>();

    stores.availability.subscribe(listener);
    stores.switches.set({ billing: false });

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops computing once disposed", () => {
    const stores = storesOf(PRODUCT);

    stores.availability.dispose();
    stores.switches.set({ billing: false });

    expect(stores.availability.get()["billing"]).toStrictEqual({ on: true });
  });
});
