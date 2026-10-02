import { use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { HostContext } from "#host/runtime.ts";

describe("HostContext", () => {
  it("defaults to undefined outside a host", () => {
    const { result } = renderHook(() => use(HostContext));

    expect(result.current).toBeUndefined();
  });

  it("returns the runtime the host provides", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => use(HostContext), { wrapper: wrapperOf(host) });

    expect(result.current).toBe(host.runtime);
  });
});
