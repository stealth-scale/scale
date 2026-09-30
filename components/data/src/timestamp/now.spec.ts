import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useNow } from "#timestamp/now.ts";
import { clocked } from "#timestamp/timestamp.fixtures.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

describe("useNow", () => {
  it("returns the stated instant", () => {
    const { result } = renderHook(() => useNow(NOW.getTime()));

    expect(result.current.toISOString()).toBe(NOW.toISOString());
  });

  it("returns the clock read at mount when no instant is stated", () => {
    const read = clocked(NOW, () => renderHook(() => useNow()).result.current);

    expect(read.toISOString()).toBe(NOW.toISOString());
  });

  it("reads the clock again every interval", () => {
    const read = clocked(NOW, () => {
      const { result } = renderHook(() => useNow(undefined, 1000));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      return result.current;
    });

    expect(read.getTime()).toBe(NOW.getTime() + 1000);
  });

  it("keeps the mount reading when no interval is given", () => {
    const read = clocked(NOW, () => {
      const { result } = renderHook(() => useNow());

      act(() => {
        vi.advanceTimersByTime(60_000);
      });

      return result.current;
    });

    expect(read.getTime()).toBe(NOW.getTime());
  });

  it("starts no timer while an instant is stated", () => {
    const timers = clocked(NOW, () => {
      renderHook(() => useNow(NOW, 1000));

      return vi.getTimerCount();
    });

    expect(timers).toBe(0);
  });

  it("stops reading the clock on unmount", () => {
    const timers = clocked(NOW, () => {
      const { unmount } = renderHook(() => useNow(undefined, 1000));

      unmount();

      return vi.getTimerCount();
    });

    expect(timers).toBe(0);
  });
});
