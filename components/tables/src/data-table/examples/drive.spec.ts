import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { contentsOf, ROOT, useDrive, withItems } from "#data-table/examples/drive.ts";
import { DELAY } from "#data-table/examples/server.ts";

describe("drive", () => {
  it("returns the items of the folder at a path", () => {
    expect(contentsOf("/receipts").map((item) => item.path)).toStrictEqual([
      "/receipts/travel",
      "/receipts/meals",
    ]);
  });

  it("returns no items for a path without a folder", () => {
    expect(contentsOf("/readme")).toStrictEqual([]);
  });

  it.each(["/contracts", "/contracts/archive", "/invoices", "/receipts", "/receipts/travel"])(
    "sizes the folder %s as everything under it",
    (path) => {
      const sizes = contentsOf(path).reduce((sum, item) => sum + item.size, 0);
      const folder = [...ROOT, ...contentsOf("/contracts"), ...contentsOf("/receipts")].find(
        (item) => item.path === path,
      );

      expect(folder?.size).toBe(sizes);
    },
  );

  it("puts a folder's items in place under its parent", () => {
    const opened = withItems(ROOT, "/contracts", contentsOf("/contracts"));
    const nested = withItems(opened, "/contracts/archive", contentsOf("/contracts/archive"));

    expect(nested[0]?.items?.[0]?.items?.map((item) => item.name)).toStrictEqual(["q1", "q2"]);
  });

  it("keeps an item off the path to the folder as it was", () => {
    expect(withItems(ROOT, "/contracts", [])[1]).toBe(ROOT[1]);
  });

  it("starts with the drive's top and every folder closed", () => {
    const { result } = renderHook(() => useDrive());

    expect([result.current.items, result.current.expanded]).toStrictEqual([ROOT, {}]);
  });

  it("opens a folder at once and returns its items after the delay", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDrive());

    act(() => {
      result.current.onExpandedChange({ "/invoices": true });
    });
    const before = result.current.items[1]?.items;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DELAY);
    });
    vi.useRealTimers();

    expect([before, result.current.items[1]?.items?.length]).toStrictEqual([undefined, 2]);
  });

  it("applies an updater to the open folders", () => {
    const { result } = renderHook(() => useDrive());

    act(() => {
      result.current.onExpandedChange((old) => ({
        ...(old === true ? {} : old),
        "/receipts": true,
      }));
    });

    expect(result.current.expanded).toStrictEqual({ "/receipts": true });
  });

  it("asks the server for a folder's items once", async () => {
    vi.useFakeTimers();
    const timers = vi.spyOn(globalThis, "setTimeout");
    const { result } = renderHook(() => useDrive());

    act(() => {
      result.current.onExpandedChange({ "/invoices": true });
    });
    act(() => {
      result.current.onExpandedChange({ "/invoices": true, "/receipts": true });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DELAY);
    });
    vi.useRealTimers();

    expect(timers.mock.calls.filter(([, delay]) => delay === DELAY)).toHaveLength(2);
  });
});
