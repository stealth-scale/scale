import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  APPROVED,
  approving,
  hookIn,
  pending,
  REQUEST_KEY,
  served,
  tick,
  UNDECLARED_MUTATION,
  UNDECLARED_QUERY,
} from "#data/data.fixtures.tsx";
import { useChange, useData } from "#data/data.ts";
import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { APPROVE, OPEN, timeOffContract } from "#host/product.fixtures.ts";

describe("data", () => {
  it("returns a declared query's data", async () => {
    const { result } = await hookIn(
      () => useData(timeOffContract.queries.request, { id: "7" }),
      served(),
    );

    expect(result.current).toStrictEqual(OPEN);
  });

  it("caches the query with the records its declaration names", async () => {
    const serving = served();

    await hookIn(() => useData(timeOffContract.queries.request, { id: "7" }), serving);

    expect(serving.client.getQueryCache().find({ queryKey: REQUEST_KEY })?.meta).toStrictEqual({
      resources: serving.host.runtime.product.queries.find(
        ({ id }) => id === timeOffContract.queries.request.id,
      )?.records,
    });
  });

  it("keeps the data fresh for the time its declaration states", async () => {
    const serving = served();

    await hookIn(() => useData(timeOffContract.queries.request, { id: "7" }), serving);

    const query = serving.client.getQueryCache().find({ queryKey: REQUEST_KEY });

    expect(query?.observers[0]?.options.staleTime).toBe(5000);
  });

  it("throws for a query no installed plugin declares", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      renderHook(() => useData(UNDECLARED_QUERY, {}), { wrapper: wrapperOf(fixtureHost()) }),
    ).toThrow("useData() found no installed plugin that declares the query payroll/runs.");
  });

  it("runs a declared mutation with its variables", async () => {
    expect.hasAssertions();

    const { result } = await hookIn(() => useChange(timeOffContract.mutations.approve), served());

    await act(async () => {
      await expect(result.current.mutateAsync({ requestId: "7" })).resolves.toStrictEqual(APPROVED);
    });
  });

  it("refetches the queries its declared changes name once it settles", async () => {
    const serving = served();
    const { result } = await hookIn(
      () => ({
        change: useChange(timeOffContract.mutations.approve),
        data: useData(timeOffContract.queries.request, { id: "7" }),
      }),
      serving,
    );

    await act(async () => {
      await result.current.change.mutateAsync({ requestId: "7" });
    });

    expect(serving.request).toHaveBeenCalledTimes(2);
  });

  it("patches the cached records at once with an optimistic patch", async () => {
    const { result } = await hookIn(
      () => ({
        change: useChange(timeOffContract.mutations.approve, { optimistic: approving }),
        data: useData(timeOffContract.queries.request, { id: "7" }),
      }),
      served(pending),
    );

    await act(async () => {
      result.current.change.mutate({ requestId: "7" });
      await tick();
    });

    expect(result.current.data).toStrictEqual(APPROVED);
  });

  it("runs the mutations of one scope one at a time", async () => {
    const serving = served(pending);
    const { result } = await hookIn(
      () => useChange(timeOffContract.mutations.approve, { scope: "7" }),
      serving,
    );

    await act(async () => {
      result.current.mutate({ requestId: "7" });
      result.current.mutate({ requestId: "7" });
      await tick();
    });

    expect(serving.runs.filter((id) => id === APPROVE.id)).toHaveLength(1);
  });

  it("runs the mutations of no scope at once", async () => {
    const serving = served(pending);
    const { result } = await hookIn(() => useChange(timeOffContract.mutations.approve), serving);

    await act(async () => {
      result.current.mutate({ requestId: "7" });
      result.current.mutate({ requestId: "7" });
      await tick();
    });

    expect(serving.runs.filter((id) => id === APPROVE.id)).toHaveLength(2);
  });

  it("throws for a mutation no installed plugin declares", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      renderHook(() => useChange(UNDECLARED_MUTATION), { wrapper: wrapperOf(fixtureHost()) }),
    ).toThrow("useChange() found no installed plugin that declares the mutation payroll/close.");
  });
});
