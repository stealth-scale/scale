import { act, renderHook } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { BARE, BETA, CALENDAR, LAYOUT } from "#flags/flags.fixtures.ts";
import { useFeatureFlag, useFlagActions, useFlagStatuses } from "#flags/flags.ts";
import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";

describe("flags", () => {
  it("returns a boolean flag's value for the session", () => {
    const { result } = renderHook(() => useFeatureFlag(CALENDAR), {
      wrapper: wrapperOf(fixtureHost({ products: { [CALENDAR.id]: true } })),
    });

    expect(result.current).toBe(true);
  });

  it("returns the variant an experiment serves", () => {
    const { result } = renderHook(() => useFeatureFlag(LAYOUT), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current).toBe("list");

    expectTypeOf(result.current).toEqualTypeOf<"board" | "list">();
  });

  it("returns the reference's default for a flag no installed plugin declares", () => {
    const { result } = renderHook(() => useFeatureFlag(BETA), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current).toBe(true);
  });

  it("returns false for a bare reference no installed plugin declares", () => {
    const { result } = renderHook(() => useFeatureFlag(BARE), {
      wrapper: wrapperOf(fixtureHost()),
    });

    expect(result.current).toBe(false);
  });

  it("returns the value an override sets", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useFeatureFlag(CALENDAR), { wrapper: wrapperOf(host) });

    act(() => {
      host.runtime.stores.flags.override(CALENDAR.id, true);
    });

    expect(result.current).toBe(true);
  });

  it("overrides a flag in this tab", () => {
    const { result } = renderHook(() => useFlagActions(), { wrapper: wrapperOf(fixtureHost()) });

    act(() => {
      result.current.override(LAYOUT, "board");
    });

    expect(result.current.overrides).toStrictEqual({ [LAYOUT.id]: "board" });
  });

  it("removes an override where no value is given", () => {
    const { result } = renderHook(() => useFlagActions(), { wrapper: wrapperOf(fixtureHost()) });

    act(() => {
      result.current.override(LAYOUT, "board");
    });
    act(() => {
      result.current.override(LAYOUT);
    });

    expect(result.current.overrides).toStrictEqual({});
  });

  it("refuses a variant the experiment does not declare", () => {
    const { result } = renderHook(() => useFlagActions(), { wrapper: wrapperOf(fixtureHost()) });

    act(() => {
      // @ts-expect-error -- the experiment's variants are list and board.
      result.current.override(LAYOUT, "grid");
    });

    expect(result.current.overrides).toStrictEqual({ [LAYOUT.id]: "grid" });
  });

  it("lists one status per declared flag in the product's order", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useFlagStatuses(), { wrapper: wrapperOf(host) });

    expect(result.current.map(({ flag }) => flag)).toStrictEqual(host.runtime.product.flags);
  });

  it("leaves a flag the page has not read without a reading", () => {
    const { result } = renderHook(() => useFlagStatuses(), { wrapper: wrapperOf(fixtureHost()) });

    expect(result.current.find(({ flag }) => flag.id === CALENDAR.id)?.reading).toBeUndefined();
  });

  it("reports the reading of a flag the page read", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useFlagStatuses(), { wrapper: wrapperOf(host) });

    act(() => {
      host.flags.set({
        overrides: {},
        readings: new Map([[CALENDAR.id, { origin: "source", value: true }]]),
      });
    });

    expect(result.current.find(({ flag }) => flag.id === CALENDAR.id)?.reading).toStrictEqual({
      origin: "source",
      value: true,
    });
  });

  it("reports an override as the reading", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useFlagStatuses(), { wrapper: wrapperOf(host) });

    act(() => {
      host.flags.set({ overrides: { [LAYOUT.id]: "board" }, readings: new Map() });
    });

    expect(result.current.find(({ flag }) => flag.id === LAYOUT.id)?.reading).toStrictEqual({
      origin: "override",
      value: "board",
    });
  });
});
