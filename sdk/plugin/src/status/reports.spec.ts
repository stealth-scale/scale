import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { useHostReports } from "#status/reports.ts";
import { FULL, WARNED } from "#status/status.fixtures.ts";

describe("useHostReports", () => {
  it("returns the build's warnings", () => {
    const { result } = renderHook(() => useHostReports(), {
      wrapper: wrapperOf(fixtureHost({ product: WARNED })),
    });

    expect(result.current.warnings).toStrictEqual(WARNED.warnings);
  });

  it("returns the runtime entries the host reported", () => {
    const host = fixtureHost();

    host.reports.set([FULL]);

    const { result } = renderHook(() => useHostReports(), { wrapper: wrapperOf(host) });

    expect(result.current.entries).toStrictEqual([FULL]);
  });

  it("renders again when the host reports an entry", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useHostReports(), { wrapper: wrapperOf(host) });

    act(() => {
      host.reports.set([FULL]);
    });

    expect(result.current.entries).toStrictEqual([FULL]);
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useHostReports())).toThrow(
      "useHostReports() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
