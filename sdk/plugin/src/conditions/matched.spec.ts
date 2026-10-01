import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useMatched } from "#conditions/matched.ts";
import { fixtureHost } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";
import { routedWrapper } from "#host/routed.fixtures.tsx";

describe("useMatched", () => {
  it("returns the qualified id of every matched route outermost first", async () => {
    const { result } = renderHook(() => useMatched(), {
      wrapper: await routedWrapper(fixtureHost()),
    });

    expect([...result.current]).toStrictEqual([
      timeOffContract.routes.overview.id,
      timeOffContract.routes.request.id,
    ]);
  });

  it("leaves out a route the page is not under", async () => {
    const { result } = renderHook(() => useMatched(), {
      wrapper: await routedWrapper(fixtureHost(), "/time-off"),
    });

    expect([...result.current]).toStrictEqual([timeOffContract.routes.overview.id]);
  });
});
