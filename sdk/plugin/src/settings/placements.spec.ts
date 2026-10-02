import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { usePlacements } from "#settings/placements.ts";

describe("usePlacements", () => {
  it("returns the person's placements by slot", () => {
    const host = fixtureHost();

    host.placements.set({ "host/aside": { remove: ["billing/total"] } });

    const { result } = renderHook(() => usePlacements(), { wrapper: wrapperOf(host) });

    expect(result.current.slots).toStrictEqual({ "host/aside": { remove: ["billing/total"] } });
  });

  it("writes a change through the host", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => usePlacements(), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.update({ "host/aside": { order: ["billing/total"] } });
    });

    expect(result.current.slots).toStrictEqual({ "host/aside": { order: ["billing/total"] } });
  });

  it("removes every placement on reset", () => {
    const host = fixtureHost();

    host.placements.set({ "host/aside": { remove: ["billing/total"] } });

    const { result } = renderHook(() => usePlacements(), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.reset();
    });

    expect(result.current.slots).toStrictEqual({});
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => usePlacements())).toThrow(
      "usePlacements() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
