import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  APPROVE,
  CHECK,
  decided,
  READER,
  sessionWith,
  undecided,
  UNDECLARED,
} from "#access/access.fixtures.ts";
import { decisionKey, decisionOf, useAccess, useAccessActions } from "#access/decisions.ts";
import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";

describe("decisions", () => {
  it("returns distinct keys for fields that join to the same text", () => {
    expect(decisionKey({ permission: "p", resource: { id: "b/c", type: "a" } })).not.toBe(
      decisionKey({ permission: "p", resource: { id: "c", type: "a/b" } }),
    );
  });

  it("returns a decision the store knows before the session's permissions", () => {
    expect(decisionOf(decided(true), sessionWith([]), CHECK)).toBe("allowed");
  });

  it("returns denied for a check whose permission the session lacks", () => {
    expect(decisionOf(undecided(true), sessionWith([]), CHECK)).toBe("denied");
  });

  it("returns allowed for a check the host has no access source for", () => {
    expect(decisionOf(undecided(false), sessionWith([APPROVE.id]), CHECK)).toBe("allowed");
  });

  it("returns pending for a check the access source has not decided", () => {
    expect(decisionOf(undecided(true), sessionWith([APPROVE.id]), CHECK)).toBe("pending");
  });

  it("returns allowed for a decision the store knows", () => {
    const host = fixtureHost();

    host.access.set(decided(true));

    const { result } = renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    expect(result.current).toBe("allowed");
  });

  it("returns denied for a refusal the store knows", () => {
    const host = fixtureHost();

    host.access.set(decided(false));

    const { result } = renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    expect(result.current).toBe("denied");
  });

  it("returns denied when the session lacks the permission", () => {
    const host = fixtureHost({ session: READER });
    const { result } = renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    expect(result.current).toBe("denied");
    expect(host.recorded.requested).toStrictEqual([]);
  });

  it("returns allowed without an access source", () => {
    const { result } = renderHook(() => useAccess(APPROVE, "7"), {
      wrapper: wrapperOf(fixtureHost({ source: false })),
    });

    expect(result.current).toBe("allowed");
  });

  it("returns pending while the source decides", () => {
    const { result } = renderHook(() => useAccess(APPROVE, "7"), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current).toBe("pending");
  });

  it("requests the check after the render commits", () => {
    const host = fixtureHost();

    renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    expect(host.recorded.requested).toStrictEqual([CHECK]);
  });

  it("requests nothing for a decision the store knows", () => {
    const host = fixtureHost();

    host.access.set(decided(true));
    renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    expect(host.recorded.requested).toStrictEqual([]);
  });

  it("returns the decision that arrives", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    act(() => {
      host.access.set(decided(true));
    });

    expect(result.current).toBe("allowed");
  });

  it("requests the check again after the store drops its decision", () => {
    const host = fixtureHost();

    host.access.set(decided(true));
    renderHook(() => useAccess(APPROVE, "7"), { wrapper: wrapperOf(host) });

    act(() => {
      host.access.set({ decisions: new Map(), source: true });
    });

    expect(host.recorded.requested).toStrictEqual([CHECK]);
  });

  it("returns denied for a permission no installed plugin declares", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useAccess(UNDECLARED, "7"), {
      wrapper: wrapperOf(host),
    });

    expect(result.current).toBe("denied");
    expect(host.recorded.requested).toStrictEqual([]);
  });

  it("refuses a tenant permission", () => {
    const { result } = renderHook(
      // @ts-expect-error -- a permission for the whole tenant is read with usePermission.
      () => useAccess(timeOffContract.permissions["request.read"], "7"),
      { wrapper: wrapperOf(fixtureHost()) },
    );

    expect(result.current).toBe("denied");
  });

  it("forgets the decisions on a resource", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useAccessActions(), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.forget(CHECK.resource);
    });

    expect(host.recorded.forgotten).toStrictEqual([CHECK.resource]);
  });

  it("primes the decisions a service returned", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useAccessActions(), { wrapper: wrapperOf(host) });

    act(() => {
      result.current.prime([{ ...CHECK, allowed: true }]);
    });

    expect(host.recorded.primed).toStrictEqual([{ ...CHECK, allowed: true }]);
  });
});
