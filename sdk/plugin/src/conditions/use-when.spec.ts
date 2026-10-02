import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { flagIs } from "@stealthscale/sdk-core";

import { APPROVE, READER } from "#access/access.fixtures.ts";
import { useWhen } from "#conditions/use-when.ts";
import { LAYOUT } from "#flags/flags.fixtures.ts";
import { fixtureHost } from "#host/host.fixtures.tsx";
import { billingContract, timeOffContract } from "#host/product.fixtures.ts";
import { routedWrapper } from "#host/routed.fixtures.tsx";

describe("useWhen", () => {
  it("returns true where no condition is stated", async () => {
    const { result } = renderHook(() => useWhen(), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current).toBe(true);
  });

  it("returns false for a permission the session lacks", async () => {
    const { result } = renderHook(() => useWhen({ permission: APPROVE }), {
      wrapper: await routedWrapper(fixtureHost({ session: READER })),
    });

    expect(result.current).toBe(false);
  });

  it("returns true on a route the page is nested under", async () => {
    const { result } = renderHook(() => useWhen({ route: timeOffContract.routes.overview }), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect(result.current).toBe(true);
  });

  it("returns false on a route the page is not under", async () => {
    const { result } = renderHook(() => useWhen({ route: timeOffContract.routes.request }), {
      wrapper: await routedWrapper(fixtureHost(), "/time-off"),
    });

    expect(result.current).toBe(false);
  });

  it("returns false after the plugin it names turns off", async () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useWhen({ plugin: billingContract }), {
      wrapper: await routedWrapper(host),
    });

    act(() => {
      host.availability.set({ ...host.availability.get(), billing: { on: false, reason: "off" } });
    });

    expect(result.current).toBe(false);
  });

  it("returns true for the variant an experiment serves", async () => {
    const { result } = renderHook(() => useWhen({ variant: flagIs(LAYOUT, "board") }), {
      wrapper: await routedWrapper(fixtureHost({ products: { [LAYOUT.id]: "board" } })),
    });

    expect(result.current).toBe(true);
  });
});
