import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { storeOf } from "#host/host.fixtures.tsx";
import { type Store } from "#host/stores.ts";
import { useSelector } from "#host/use-selector.ts";

describe("useSelector", () => {
  it("returns what the selector reads", () => {
    const store = storeOf(1);
    const { result } = renderHook(() => useSelector([store], () => store.get() * 2));

    expect(result.current).toBe(2);
  });

  it("renders again when a store it reads changes", () => {
    const first = storeOf(1);
    const second = storeOf(10);
    const { result } = renderHook(() =>
      useSelector([first, second], () => first.get() + second.get()),
    );

    act(() => {
      second.set(20);
    });

    expect(result.current).toBe(21);
  });

  it("renders nothing more while the selected value is unchanged", () => {
    const store = storeOf(1);
    let renders = 0;

    renderHook(() => {
      renders += 1;

      return useSelector([store], () => store.get() > 0);
    });

    act(() => {
      store.set(2);
    });

    expect(renders).toBe(1);
  });

  it("unsubscribes from every store on unmount", () => {
    const stop = vi.fn<() => void>();
    const store: Store<number> = { get: () => 1, subscribe: () => stop };
    const { unmount } = renderHook(() => useSelector([store, store], () => store.get()));

    unmount();

    expect(stop).toHaveBeenCalledTimes(2);
  });
});
