import { QueryClient, QueryObserver } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { cached } from "#cache.fixtures.ts";
import { invalidateChanges } from "#changes.ts";
import { ADA, GRACE, LISTED, ONE, PEOPLE, PERSON, PERSON_KIND } from "#operation.fixtures.ts";
import { operationQuery } from "#queries.ts";

/**
 * Returns a client that never fetches on its own.
 *
 * @returns The client.
 */
function idle(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { queryFn: () => new Promise(() => {}) } } });
}

describe("invalidateChanges", () => {
  it("invalidates a query whose data contains an updated record", async () => {
    const client = idle();
    const query = cached(client, operationQuery(PERSON, { id: "7" }, { resources: [ONE] }), ADA);

    await invalidateChanges(client, [{ action: "updated", id: "7", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(true);
  });

  it("invalidates a query whose data contains a deleted record", async () => {
    const client = idle();
    const people = { items: [ADA, GRACE] };
    const query = cached(client, operationQuery(PEOPLE, {}, { resources: [LISTED] }), people);

    await invalidateChanges(client, [{ action: "deleted", id: "8", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(true);
  });

  it("leaves a query whose data does not contain the record", async () => {
    const client = idle();
    const query = cached(client, operationQuery(PERSON, { id: "7" }, { resources: [ONE] }), ADA);

    await invalidateChanges(client, [{ action: "updated", id: "8", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(false);
  });

  it("invalidates a list of the kind for a created record", async () => {
    const client = idle();
    const query = cached(client, operationQuery(PEOPLE, {}, { resources: [LISTED] }), {
      items: [],
    });

    await invalidateChanges(client, [{ action: "created", id: "9", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(true);
  });

  it("leaves a query without a list of the kind for a created record", async () => {
    const client = idle();
    const query = cached(client, operationQuery(PERSON, { id: "7" }, { resources: [ONE] }), ADA);

    await invalidateChanges(client, [{ action: "created", id: "9", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(false);
  });

  it("leaves a query whose key is not an operation's", async () => {
    const client = idle();
    const query = cached(client, { meta: { resources: [ONE] }, queryKey: ["people", "7"] }, ADA);

    await invalidateChanges(client, [{ action: "updated", id: "7", type: PERSON_KIND }]);

    expect(query.state.isInvalidated).toBe(false);
  });

  it("refetches an active query the change invalidates", async () => {
    expect.hasAssertions();

    const queryFn = vi.fn<() => Promise<typeof ADA>>(() => Promise.resolve(ADA));
    const client = new QueryClient({ defaultOptions: { queries: { queryFn, staleTime: 60_000 } } });
    const observer = new QueryObserver(
      client,
      operationQuery(PERSON, { id: "7" }, { resources: [ONE] }),
    );
    const unsubscribe = observer.subscribe(() => {});

    await vi.waitFor(() => {
      expect(observer.getCurrentResult().data).toStrictEqual(ADA);
    });
    await invalidateChanges(client, [{ action: "updated", id: "7", type: PERSON_KIND }]);
    unsubscribe();

    expect(queryFn).toHaveBeenCalledTimes(2);
  });
});
