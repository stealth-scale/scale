import { describe, expect, it } from "vitest";

import { operationKey } from "@stealthscale/provider-data";
import { createTestDataClient } from "@stealthscale/provider-data/testing";

import { OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { sampledFrom } from "#host/transport.ts";
import { loaderOf } from "#routes/loader.ts";
import { routeIn, UNGUARDED } from "#routes/routes.fixtures.ts";

describe("loaderOf", () => {
  it("returns no loader for a route that reads no data", () => {
    expect(loaderOf(PRODUCT, routeIn(PRODUCT, "billing/invoices"))).toBeUndefined();
  });

  it("loads a route's query with the variables the route's parameters contain", async () => {
    const data = createTestDataClient(sampledFrom(UNGUARDED));

    await loaderOf(
      UNGUARDED,
      routeIn(UNGUARDED, "identity/request"),
    )?.({
      context: { data },
      params: { id: "7" },
      preload: false,
      search: {},
      signal: new AbortController().signal,
    });

    expect(data.getQueryData(operationKey(REQUEST, { id: "7" }))).toStrictEqual(OPEN);
  });
});
