import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { usePluginStatuses } from "#status/plugins.ts";
import { BROKEN_TOTAL, LOCKED, QUARANTINE } from "#status/status.fixtures.ts";

describe("usePluginStatuses", () => {
  it("returns one status per installed plugin in install order", () => {
    const { result } = renderHook(() => usePluginStatuses(), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current.map(({ id }) => id)).toStrictEqual(["time-off", "billing"]);
  });

  it("describes a plugin that is on", () => {
    const { result } = renderHook(() => usePluginStatuses(), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current[0]).toStrictEqual({
      id: "time-off",
      on: true,
      quarantined: [],
      reason: undefined,
      switchable: true,
      version: "0.4.0",
    });
  });

  it("returns the reason a plugin is off", () => {
    const host = fixtureHost();

    host.availability.set({ billing: { on: false, reason: "off" }, "time-off": { on: true } });

    const { result } = renderHook(() => usePluginStatuses(), { wrapper: wrapperOf(host) });

    expect([result.current[1]?.on, result.current[1]?.reason]).toStrictEqual([false, "off"]);
  });

  it("lists the quarantined targets of each plugin", () => {
    const host = fixtureHost();

    host.quarantine.set(QUARANTINE);

    const { result } = renderHook(() => usePluginStatuses(), { wrapper: wrapperOf(host) });

    expect(result.current[1]?.quarantined).toStrictEqual([BROKEN_TOTAL]);
  });

  it("returns a plugin the product locked as not switchable", () => {
    const { result } = renderHook(() => usePluginStatuses(), {
      wrapper: wrapperOf(fixtureHost({ product: LOCKED })),
    });

    expect(result.current.map(({ switchable }) => switchable)).toStrictEqual([true, false]);
  });

  it("renders again when a plugin turns off", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => usePluginStatuses(), { wrapper: wrapperOf(host) });

    act(() => {
      host.availability.set({
        billing: { on: true },
        "time-off": { on: false, reason: "condition" },
      });
    });

    expect(result.current[0]?.reason).toBe("condition");
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => usePluginStatuses())).toThrow(
      "usePluginStatuses() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
