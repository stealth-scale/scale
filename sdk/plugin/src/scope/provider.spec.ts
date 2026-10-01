import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { usePlugin } from "#scope/context.ts";

describe("PluginProvider", () => {
  it("renders its children in the plugin's scope", () => {
    const { result } = renderHook(() => usePlugin().pluginId, {
      wrapper: wrapperOf(fixtureHost(), "billing"),
    });

    expect(result.current).toBe("billing");
  });
});
