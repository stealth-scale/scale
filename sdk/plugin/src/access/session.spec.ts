import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import { READER } from "#access/access.fixtures.ts";
import { useEntitlement, usePermission, useSession } from "#access/session.ts";
import { fixtureHost, sessionStateOf, wrapperOf } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";

describe("session", () => {
  it("returns the session the host keeps", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useSession(), { wrapper: wrapperOf(host) });

    expect(result.current).toBe(host.session.get().session);
  });

  it("returns the next session after a sign-out", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useSession(), { wrapper: wrapperOf(host) });

    act(() => {
      host.session.set(sessionStateOf(NOBODY));
    });

    expect(result.current).toBe(NOBODY);
  });

  it("returns true for a permission the session has", () => {
    const { result } = renderHook(
      () => usePermission(timeOffContract.permissions["request.approve"]),
      { wrapper: wrapperOf(fixtureHost()) },
    );

    expect(result.current).toBe(true);
  });

  it("returns false for a permission the session lacks", () => {
    const { result } = renderHook(
      () => usePermission(timeOffContract.permissions["request.approve"]),
      { wrapper: wrapperOf(fixtureHost({ session: READER })) },
    );

    expect(result.current).toBe(false);
  });

  it("returns true for an entitlement the tenant has", () => {
    const { result } = renderHook(() => useEntitlement(timeOffContract.entitlements.module), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current).toBe(true);
  });

  it("returns false for an entitlement the tenant lacks", () => {
    const { result } = renderHook(() => useEntitlement(timeOffContract.entitlements.module), {
      wrapper: wrapperOf(fixtureHost({ session: NOBODY })),
    });

    expect(result.current).toBe(false);
  });
});
