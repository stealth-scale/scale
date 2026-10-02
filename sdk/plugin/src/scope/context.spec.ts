import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { usePlugin } from "#scope/context.ts";

describe("usePlugin", () => {
  it("returns the scope of the plugin the component renders in", () => {
    const { result } = renderHook(() => usePlugin(), {
      wrapper: wrapperOf(fixtureHost(), "time-off"),
    });

    expect(result.current).toStrictEqual({ pluginId: "time-off" });
  });

  it("throws outside every plugin's scope", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => usePlugin(), { wrapper: wrapperOf(fixtureHost()) })).toThrow(
      "usePlugin() found no plugin. A plugin's code renders in its plugin's scope, which the host and Slot provide.",
    );
  });
});
