import { renderHook } from "@testing-library/react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";
import { useConfig } from "#scope/use-config.ts";

describe("useConfig", () => {
  it("returns the product's values over the schema's defaults", () => {
    const { result } = renderHook(() => useConfig(timeOffContract.config), {
      wrapper: wrapperOf(fixtureHost(), "time-off"),
    });

    expect(result.current).toStrictEqual({ approvers: 3, region: "eu" });

    expectTypeOf(result.current.approvers).toEqualTypeOf<number>();
  });

  it("throws for the schema of another plugin", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      renderHook(() => useConfig(timeOffContract.config), {
        wrapper: wrapperOf(fixtureHost(), "billing"),
      }),
    ).toThrow("useConfig() takes the schema of its own plugin, billing.");
  });
});
