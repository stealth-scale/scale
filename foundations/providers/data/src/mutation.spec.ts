import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { cached } from "#cache.fixtures.ts";
import { deferred } from "#client.fixtures.tsx";
import {
  AUGUSTA,
  EVERYONE,
  ONE_PERSON,
  PRIVATE,
  renamed,
  renaming,
  retried,
} from "#mutation.fixtures.ts";
import { type OperationMutationOptions } from "#mutation.ts";
import { ADA, GRACE, type Person, PERSON_KIND, RENAME } from "#operation.fixtures.ts";

describe("useOperationMutation", () => {
  it("runs the mutation's operation with the caller's variables", async () => {
    const { result, run } = renamed();

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    expect(run.mock.lastCall?.slice(0, 2)).toStrictEqual([RENAME, AUGUSTA]);
  });

  it("resolves with the mutation's data", async () => {
    const { result } = renamed();
    let data: Person | undefined;

    await act(async () => {
      data = await result.current.mutateAsync(AUGUSTA);
    });

    expect(data).toStrictEqual(AUGUSTA);
  });

  it("sends a fresh idempotency key on each call", async () => {
    const { result, run } = renamed();

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
      await result.current.mutateAsync(AUGUSTA);
    });

    const keys = run.mock.calls.map(([, , options]) => options?.idempotencyKey);

    expect(new Set(keys).size).toBe(2);
  });

  it("sends the same idempotency key on a retry", async () => {
    const { result, run } = retried();

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    const keys = run.mock.calls.map(([, , options]) => options?.idempotencyKey);

    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
  });

  it("runs a call of mutate without waiting for it", async () => {
    expect.hasAssertions();

    const { result } = renamed();

    act(() => {
      result.current.mutate(AUGUSTA);
    });

    await waitFor(() => {
      expect(result.current.data).toStrictEqual(AUGUSTA);
    });
  });

  it("patches every query whose data contains the record at once", async () => {
    expect.hasAssertions();

    const { client, result, run } = renamed({ optimistic: renaming });
    const reply = deferred<Person>();

    cached(client, ONE_PERSON, ADA);
    cached(client, EVERYONE, { items: [ADA, GRACE] });
    run.mockReturnValueOnce(reply.promise);

    act(() => {
      result.current.mutate(AUGUSTA);
    });

    await waitFor(() => {
      expect(client.getQueryData(ONE_PERSON.queryKey)).toStrictEqual(AUGUSTA);
    });

    expect(client.getQueryData(EVERYONE.queryKey)).toStrictEqual({ items: [AUGUSTA, GRACE] });

    reply.release(AUGUSTA);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("writes the data back when the service refuses the change", async () => {
    const { client, result, run } = renamed({ optimistic: renaming });

    cached(client, ONE_PERSON, ADA);
    run.mockRejectedValueOnce(PRIVATE);

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA).catch(() => null);
    });

    expect(client.getQueryData(ONE_PERSON.queryKey)).toStrictEqual(ADA);
  });

  it("cancels a fetch of a query it patches", async () => {
    const { client, result, run } = renamed({ optimistic: renaming });
    const signals: AbortSignal[] = [];

    cached(client, ONE_PERSON, ADA);
    run.mockImplementationOnce((_operation, _variables, options) => {
      if (options?.signal !== undefined) signals.push(options.signal);

      return new Promise<never>(() => {});
    });

    const refetching = client.refetchQueries();

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });
    await refetching;

    expect(signals.map((signal) => signal.aborted)).toStrictEqual([true]);
  });

  it("invalidates the patched records once the mutation settles", async () => {
    const { client, result } = renamed({ optimistic: renaming });
    const query = cached(client, ONE_PERSON, ADA);

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    expect(query.state.isInvalidated).toBe(true);
  });

  it("invalidates the changes the mutation states for its variables and data", async () => {
    const changes = vi.fn<NonNullable<OperationMutationOptions<Person, Person>["changes"]>>(
      (variables) => [{ action: "updated", id: variables.id, type: PERSON_KIND }],
    );
    const { client, result } = renamed({ changes });
    const query = cached(client, ONE_PERSON, ADA);

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    expect(changes.mock.lastCall).toStrictEqual([AUGUSTA, AUGUSTA]);
    expect(query.state.isInvalidated).toBe(true);
  });

  it("rejects with the refusal where the mutation states no patch", async () => {
    const { result, run } = renamed();
    let refusal: unknown;

    run.mockRejectedValueOnce(PRIVATE);

    await act(async () => {
      refusal = await result.current.mutateAsync(AUGUSTA).catch((error: unknown) => error);
    });

    expect(refusal).toBe(PRIVATE);
  });

  it("runs the mutation in the stated scope", async () => {
    const { client, result } = renamed({ scope: "7" });

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    expect(client.getMutationCache().getAll()[0]?.options.scope).toStrictEqual({ id: "7" });
  });

  it("keys the mutation by its operation", async () => {
    const { client, result } = renamed();

    await act(async () => {
      await result.current.mutateAsync(AUGUSTA);
    });

    expect(client.getMutationCache().getAll()[0]?.options.mutationKey).toStrictEqual([
      "operation",
      RENAME.id,
    ]);
  });
});
