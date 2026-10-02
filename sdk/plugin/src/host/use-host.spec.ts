import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { useHost } from "#host/use-host.ts";

describe("useHost", () => {
  it("returns the runtime of the host above", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useHost("useSlot"), { wrapper: wrapperOf(host) });

    expect(result.current).toBe(host.runtime);
  });

  it("throws naming the hook outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useHost("useSlot"))).toThrow(
      "useSlot() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });
});
