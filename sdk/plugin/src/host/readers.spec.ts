import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { useHostActions, useResolvedProduct, useToaster } from "#host/readers.ts";

describe("readers", () => {
  it("returns the resolved product without the manifests", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useResolvedProduct(), { wrapper: wrapperOf(host) });

    expect(Object.keys(result.current)).not.toContain("manifests");
    expect(result.current.productId).toBe(host.runtime.product.productId);
  });

  it("returns the product's toaster", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useToaster(), { wrapper: wrapperOf(host) });

    expect(result.current).toBe(host.runtime.toaster);
  });

  it("lifts a target's quarantine through retry", () => {
    const host = fixtureHost();
    const target = "extension:billing/total";

    host.quarantine.set(new Map([[target, { error: new Error("thrown"), target }]]));

    const { result } = renderHook(() => useHostActions(), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.retry(target);
    });

    expect(host.quarantine.get().has(target)).toBe(false);
  });
});
