import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useEmit, useEvent } from "#events/events.ts";
import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { type Approval, timeOffContract } from "#host/product.fixtures.ts";

describe("events", () => {
  it("calls the handler with each payload", () => {
    const host = fixtureHost();
    const handler = vi.fn<(payload: Approval) => void>();

    renderHook(
      () => {
        useEvent(timeOffContract.events.approved, handler);
      },
      { wrapper: wrapperOf(host, "billing") },
    );

    act(() => {
      host.runtime.events.emit("time-off", timeOffContract.events.approved.id, { requestId: "7" });
    });

    expect(handler).toHaveBeenCalledExactlyOnceWith({ requestId: "7" });
  });

  it("calls the latest handler without subscribing again", () => {
    const host = fixtureHost();
    const subscribe = vi.spyOn(host.runtime.events, "subscribe");
    const first = vi.fn<(payload: Approval) => void>();
    const second = vi.fn<(payload: Approval) => void>();
    const { rerender } = renderHook(
      ({ handler }) => {
        useEvent(timeOffContract.events.approved, handler);
      },
      { initialProps: { handler: first }, wrapper: wrapperOf(host, "billing") },
    );

    rerender({ handler: second });
    act(() => {
      host.runtime.events.emit("time-off", timeOffContract.events.approved.id, { requestId: "7" });
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledExactlyOnceWith({ requestId: "7" });
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it("subscribes as the component's plugin", () => {
    const host = fixtureHost();
    const subscribe = vi.spyOn(host.runtime.events, "subscribe");

    renderHook(
      () => {
        useEvent(timeOffContract.events.approved, vi.fn<(payload: Approval) => void>());
      },
      { wrapper: wrapperOf(host, "billing") },
    );

    expect(subscribe.mock.lastCall?.[0]).toBe("billing");
  });

  it("stops calling the handler after unmount", () => {
    const host = fixtureHost();
    const handler = vi.fn<(payload: Approval) => void>();
    const { unmount } = renderHook(
      () => {
        useEvent(timeOffContract.events.approved, handler);
      },
      { wrapper: wrapperOf(host, "billing") },
    );

    unmount();
    act(() => {
      host.runtime.events.emit("time-off", timeOffContract.events.approved.id, { requestId: "7" });
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("emits as the component's plugin", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useEmit(timeOffContract.events.approved), {
      wrapper: wrapperOf(host, "time-off"),
    });

    act(() => {
      result.current({ requestId: "7" });
    });

    expect(host.recorded.emitted).toStrictEqual([
      ["time-off", timeOffContract.events.approved.id, { requestId: "7" }],
    ]);
  });

  it("emits as the product outside every plugin's scope", () => {
    const host = fixtureHost();
    const { result } = renderHook(() => useEmit(timeOffContract.events.opened), {
      wrapper: wrapperOf(host),
    });

    act(() => {
      result.current({ id: "7" });
    });

    expect(host.recorded.emitted).toStrictEqual([
      [undefined, timeOffContract.events.opened.id, { id: "7" }],
    ]);
  });
});
