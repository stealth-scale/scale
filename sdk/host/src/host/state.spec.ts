import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import {
  busOf,
  optionsOf,
  received,
  refusedStorage,
  storedOverride,
  withoutWindow,
} from "#host/host.fixtures.ts";
import { createState } from "#host/state.ts";
import { deciding } from "#stores/access.fixtures.ts";
import { CALENDAR, flagging } from "#stores/flags.fixtures.ts";
import { ADA, switchable } from "#stores/session.fixtures.ts";

describe("createState", () => {
  it("emits host/pluginChanged for a plugin a switch turns off", () => {
    const bus = busOf();
    const changes = received(bus, "host/pluginChanged");
    const state = createState({
      events: bus,
      options: optionsOf(),
      report: vi.fn<(entry: HostReport) => void>(),
    });

    state.switches.set("payroll", false);

    expect(changes).toStrictEqual([{ on: false, pluginId: "payroll", reason: "off" }]);
  });

  it("reads the tab's overrides outside a production build", () => {
    const remove = storedOverride();

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf(),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(true);
    } finally {
      remove();
    }
  });

  it("reads no override in a production build", () => {
    const remove = storedOverride();

    vi.stubEnv("NODE_ENV", "production");

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf(),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(false);
    } finally {
      remove();
    }
  });

  it("reads the tab's overrides in a production build that turns them on", () => {
    const remove = storedOverride();

    vi.stubEnv("NODE_ENV", "production");

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf({ overrides: true }),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(true);
    } finally {
      remove();
    }
  });

  it("reads no override where the product turns them off", () => {
    const remove = storedOverride();

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf({ overrides: false }),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(false);
    } finally {
      remove();
    }
  });

  it("reads no override on a server", () => {
    const remove = storedOverride();

    withoutWindow();

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf(),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(false);
    } finally {
      vi.unstubAllGlobals();
      remove();
    }
  });

  it("reads no override where the browser refuses the storage", () => {
    const remove = storedOverride();
    const restore = refusedStorage();

    try {
      const { flags } = createState({
        events: busOf(),
        options: optionsOf(),
        report: vi.fn<(entry: HostReport) => void>(),
      }).stores;

      expect(flags.read(CALENDAR)).toBe(false);
    } finally {
      restore();
      remove();
    }
  });

  it("stops every subscription once disposed", () => {
    const session = switchable(ADA);
    const flags = flagging();
    const access = deciding();
    const state = createState({
      events: busOf(),
      options: optionsOf({ access: access.source, flags: flags.source, session }),
      report: vi.fn<(entry: HostReport) => void>(),
    });

    state.dispose();

    expect([session.listeners(), flags.listeners(), access.listeners()]).toStrictEqual([0, 0, 0]);
  });
});
