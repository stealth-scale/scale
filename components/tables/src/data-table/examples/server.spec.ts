import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DELAY,
  fetchPage,
  pageOf,
  type Request,
  useServerPage,
} from "#data-table/examples/server.ts";

/**
 * Waits for the server's delay under the fake clock.
 */
async function delayed(): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(DELAY);
  });
}

describe("server", () => {
  it("returns the transfers of the page asked for", () => {
    const page = pageOf({ pageIndex: 1, pageSize: 10, search: "" });

    expect(page.rows.map((row) => row.reference).slice(0, 2)).toStrictEqual(["TR-1038", "TR-1037"]);
  });

  it("counts every transfer whose reference contains the search", () => {
    expect(pageOf({ pageIndex: 0, pageSize: 10, search: "tr-103" }).count).toBe(10);
  });

  it("sorts by amount ascending", () => {
    const { rows } = pageOf({
      pageIndex: 0,
      pageSize: 48,
      search: "",
      sort: { desc: false, id: "amount" },
    });

    expect(rows[0]?.amount).toBe(Math.min(...rows.map((row) => row.amount)));
  });

  it("sorts by amount descending", () => {
    const { rows } = pageOf({
      pageIndex: 0,
      pageSize: 48,
      search: "",
      sort: { desc: true, id: "amount" },
    });

    expect(rows[0]?.amount).toBe(Math.max(...rows.map((row) => row.amount)));
  });

  it("keeps the server's order for a sort by another field", () => {
    const { rows } = pageOf({
      pageIndex: 0,
      pageSize: 1,
      search: "",
      sort: { desc: true, id: "reference" },
    });

    expect(rows[0]?.reference).toBe("TR-1048");
  });

  it("resolves a request with its page after the delay", async () => {
    vi.useFakeTimers();
    const request = fetchPage({ pageIndex: 0, pageSize: 5, search: "" });

    await vi.advanceTimersByTimeAsync(DELAY);
    vi.useRealTimers();

    await expect(request).resolves.toMatchObject({ count: 48 });
  });

  it("reports loading until the first page arrives", () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() =>
      useServerPage({ pageIndex: 0, pageSize: 10, search: "" }),
    );
    const { loading } = result.current;

    unmount();
    vi.useRealTimers();

    expect(loading).toBe(true);
  });

  it("returns the requested page once it arrives", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useServerPage({ pageIndex: 0, pageSize: 10, search: "", sort: { desc: true, id: "amount" } }),
    );

    await delayed();
    vi.useRealTimers();

    expect([result.current.loading, result.current.page.rows.length]).toStrictEqual([false, 10]);
  });

  it("drops the page of a request a newer one replaced", async () => {
    vi.useFakeTimers();
    const { rerender, result } = renderHook((request: Request) => useServerPage(request), {
      initialProps: { pageIndex: 0, pageSize: 10, search: "" },
    });

    rerender({ pageIndex: 1, pageSize: 10, search: "" });
    await delayed();
    vi.useRealTimers();

    expect(result.current.page.rows[0]?.reference).toBe("TR-1038");
  });
});
