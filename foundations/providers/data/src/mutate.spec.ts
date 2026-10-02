import { describe, expect, it } from "vitest";

import { cached } from "#cache.fixtures.ts";
import { mutating, retrying } from "#mutate.fixtures.ts";
import { mutateOperation } from "#mutate.ts";
import { AUGUSTA, ONE_PERSON, PRIVATE } from "#mutation.fixtures.ts";
import { ADA, PERSON_KIND, RENAME } from "#operation.fixtures.ts";

describe("mutateOperation", () => {
  it("resolves with the mutation's data", async () => {
    const { client } = mutating();

    await expect(mutateOperation(client, RENAME, AUGUSTA)).resolves.toStrictEqual(AUGUSTA);
  });

  it("runs the mutation's operation with the variables", async () => {
    const { client, run } = mutating();

    await mutateOperation(client, RENAME, AUGUSTA);

    expect(run.mock.lastCall?.slice(0, 2)).toStrictEqual([RENAME, AUGUSTA]);
  });

  it("sends a fresh idempotency key on each run", async () => {
    const { client, run } = mutating();

    await mutateOperation(client, RENAME, AUGUSTA);
    await mutateOperation(client, RENAME, AUGUSTA);

    const keys = run.mock.calls.map(([, , options]) => options?.idempotencyKey);

    expect(new Set(keys).size).toBe(2);
  });

  it("sends the same idempotency key on a retry", async () => {
    const { client, run } = retrying();

    await mutateOperation(client, RENAME, AUGUSTA);

    const keys = run.mock.calls.map(([, , options]) => options?.idempotencyKey);

    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
  });

  it("invalidates the changes the run states once it settles", async () => {
    const { client } = mutating();
    const query = cached(client, ONE_PERSON, ADA);

    await mutateOperation(client, RENAME, AUGUSTA, {
      changes: (variables) => [{ action: "updated", id: variables.id, type: PERSON_KIND }],
    });

    expect(query.state.isInvalidated).toBe(true);
  });

  it("invalidates the changes the run states after a refusal", async () => {
    const { client, run } = mutating();
    const query = cached(client, ONE_PERSON, ADA);

    run.mockRejectedValueOnce(PRIVATE);

    await mutateOperation(client, RENAME, AUGUSTA, {
      changes: (variables) => [{ action: "updated", id: variables.id, type: PERSON_KIND }],
    }).catch(() => null);

    expect(query.state.isInvalidated).toBe(true);
  });

  it("rejects with the refusal", async () => {
    const { client, run } = mutating();

    run.mockRejectedValueOnce(PRIVATE);

    await expect(mutateOperation(client, RENAME, AUGUSTA)).rejects.toBe(PRIVATE);
  });

  it("keys the mutation by its operation", async () => {
    const { client } = mutating();

    await mutateOperation(client, RENAME, AUGUSTA);

    expect(client.getMutationCache().getAll()[0]?.options.mutationKey).toStrictEqual([
      "operation",
      RENAME.id,
    ]);
  });
});
