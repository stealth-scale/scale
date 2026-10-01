import { describe, expect, it, vi } from "vitest";

import {
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  isNotFound,
  type RouteLoaderArgs,
} from "@stealthscale/provider-router";

import { createDataClient } from "#client.ts";
import { DataError, type DataErrorKind } from "#errors.ts";
import { ADA, LISTED, PEOPLE, PERSON } from "#operation.fixtures.ts";
import { operationKey, operationQuery } from "#queries.ts";
import { type DataNeed, loadNeeds, setupDataIntegration } from "#router.ts";
import { createTestDataClient, sampledTransport } from "#testing.ts";

/**
 * The need of a page that reads one person by the route's `id`.
 */
const NEED: DataNeed = { operation: PERSON, variables: ["id"] };

/**
 * Builds what a loader receives on a navigation to a person's page.
 *
 * @param context - The router's context.
 * @param overrides - Members over the navigation's.
 * @returns The loader's arguments.
 */
function argsOf(context: unknown, overrides: Partial<RouteLoaderArgs> = {}): RouteLoaderArgs {
  return {
    context,
    params: { id: "7" },
    preload: false,
    search: {},
    signal: new AbortController().signal,
    ...overrides,
  };
}

/**
 * Runs a loader built from needs.
 *
 * @param needs - The page's needs.
 * @param args - What the loader receives.
 * @returns The loader's promise.
 */
async function loaded(needs: readonly DataNeed[], args: RouteLoaderArgs): Promise<void> {
  await loadNeeds(needs)(args);
}

/**
 * Builds a refusal of the person's query.
 *
 * @param kind - The refusal's kind.
 * @returns The refusal.
 */
function refusal(kind: DataErrorKind): DataError {
  return new DataError({ kind, message: kind, operation: PERSON.id });
}

/**
 * Creates a router over a memory history, as a page or a server creates one.
 *
 * @param isServer - True for a server's router.
 * @returns The router.
 */
function routerOf(isServer = false): AnyRouter {
  return createRouter({
    history: createMemoryHistory(),
    isServer,
    routeTree: createRootRoute(),
  });
}

describe("router", () => {
  it("loads each need's query into the client", async () => {
    const client = createTestDataClient(sampledTransport({ [PERSON.id]: { data: ADA } }));

    await loaded([NEED], argsOf({ data: client }));

    expect(client.getQueryData(operationKey(PERSON, { id: "7" }))).toStrictEqual(ADA);
  });

  it("reads a variable from the search where the parameters lack it", async () => {
    const transport = sampledTransport({ [PEOPLE.id]: { data: { items: [] } } });
    const run = vi.spyOn(transport, "run");
    const need = { operation: PEOPLE, variables: ["status"] };

    await loaded(
      [need],
      argsOf({ data: createTestDataClient(transport) }, { search: { status: "open" } }),
    );

    expect(run.mock.lastCall?.[1]).toStrictEqual({ status: "open" });
  });

  it("reads a variable from the parameters ahead of the search", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
    const run = vi.spyOn(transport, "run");

    await loaded(
      [NEED],
      argsOf({ data: createTestDataClient(transport) }, { search: { id: "8" } }),
    );

    expect(run.mock.lastCall?.[1]).toStrictEqual({ id: "7" });
  });

  it("leaves out a variable that neither the parameters nor the search contain", async () => {
    const transport = sampledTransport({ [PEOPLE.id]: { data: { items: [] } } });
    const run = vi.spyOn(transport, "run");
    const need = { operation: PEOPLE, variables: ["status"] };

    await loaded([need], argsOf({ data: createTestDataClient(transport) }, { search: undefined }));

    expect(run.mock.lastCall?.[1]).toStrictEqual({});
  });

  it("runs the query with the need's resource selectors", async () => {
    const client = createTestDataClient(sampledTransport({ [PEOPLE.id]: { data: { items: [] } } }));

    await loaded([{ operation: PEOPLE, resources: [LISTED] }], argsOf({ data: client }));

    expect(client.getQueryCache().find({ queryKey: operationKey(PEOPLE, {}) })?.meta).toStrictEqual(
      {
        resources: [LISTED],
      },
    );
  });

  it("renders cached data without fetching again", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
    const run = vi.spyOn(transport, "run");
    const client = createDataClient({ defaultOptions: { queries: { staleTime: 0 } }, transport });

    await loaded([NEED], argsOf({ data: client }));
    await loaded([NEED], argsOf({ data: client }));

    expect(run).toHaveBeenCalledTimes(1);
  });

  it("throws the router's not found for a not-found refusal", async () => {
    const client = createTestDataClient(
      sampledTransport({ [PERSON.id]: { error: refusal("not-found") } }),
    );
    const thrown = await loaded([NEED], argsOf({ data: client })).catch((error: unknown) => error);

    expect(isNotFound(thrown)).toBe(true);
  });

  it("rethrows a refusal of another kind", async () => {
    const forbidden = refusal("forbidden");
    const client = createTestDataClient(sampledTransport({ [PERSON.id]: { error: forbidden } }));

    await expect(loaded([NEED], argsOf({ data: client }))).rejects.toBe(forbidden);
  });

  it("starts the fetches of a preload without waiting for them", async () => {
    const transport = sampledTransport({ [PERSON.id]: { data: ADA } });
    const run = vi.spyOn(transport, "run").mockReturnValue(new Promise<never>(() => {}));

    await loaded([NEED], argsOf({ data: createTestDataClient(transport) }, { preload: true }));

    expect(run).toHaveBeenCalledTimes(1);
  });

  it("leaves a preload's failure for the navigation to report", async () => {
    const client = createTestDataClient(
      sampledTransport({ [PERSON.id]: { error: refusal("server") } }),
    );

    await expect(
      loaded([NEED], argsOf({ data: client }, { preload: true })),
    ).resolves.toBeUndefined();
  });

  it.each([
    { context: {}, label: "a context without a data client" },
    { context: undefined, label: "no context" },
  ])("throws for a router with $label", async ({ context }) => {
    await expect(loaded([NEED], argsOf(context))).rejects.toThrow(
      "The router's context has no data client.",
    );
  });

  it("keeps the client's onUnauthenticated after the integration wraps the caches", async () => {
    const onUnauthenticated = vi.fn<() => void>();
    const transport = sampledTransport({ [PERSON.id]: { error: refusal("unauthenticated") } });
    const client = createDataClient({ onUnauthenticated, transport });
    const handler = client.getQueryCache().config.onError;

    setupDataIntegration({ client, router: routerOf() });

    await expect(client.query(operationQuery(PERSON, { id: "7" }))).rejects.toBeInstanceOf(
      DataError,
    );
    expect(client.getQueryCache().config.onError).not.toBe(handler);
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("hydrates a server's queries through the page's router", () => {
    const router = routerOf();

    setupDataIntegration({ client: createTestDataClient(sampledTransport({})), router });

    expect(router.options.hydrate).toBeTypeOf("function");
  });

  it("wraps the page's router in nothing", () => {
    const router = routerOf();

    setupDataIntegration({ client: createTestDataClient(sampledTransport({})), router });

    expect(router.options.Wrap).toBeUndefined();
  });

  it("dehydrates the queries through a server's router", () => {
    const router = routerOf(true);

    setupDataIntegration({ client: createTestDataClient(sampledTransport({})), router });

    expect(router.options.dehydrate).toBeTypeOf("function");
  });
});
