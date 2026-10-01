import { describe, expect, expectTypeOf, it } from "vitest";

import { type Reference } from "#reference.ts";
import {
  type MenuReference,
  type NoParams,
  params,
  route,
  type RouteMarker,
  type RouteReference,
  type SearchSchema,
} from "#route.ts";

interface Filter {
  readonly status?: "approved" | "open";
}

const REPORTS: MenuReference = { id: "time-off/reports", kind: "menu" };

const OVERVIEW: RouteReference = { id: "time-off/overview", kind: "route" };

const REQUESTS: Reference<"query"> = { id: "time-off/requests", kind: "query" };

const FILTER: SearchSchema<Filter> = {
  "~standard": { validate: () => ({ value: {} }), vendor: "stealth", version: 1 },
};

describe("route", () => {
  it("marks a route listed in a menu", () => {
    const overview = route({
      navigation: { label: "navigation.overview", menu: REPORTS, order: 30 },
      path: "time-off",
    });

    expect(overview).toStrictEqual({
      kind: "route",
      navigation: { label: "navigation.overview", menu: REPORTS, order: 30 },
      path: "time-off",
    });

    expectTypeOf(overview).toEqualTypeOf<RouteMarker<NoParams>>();
  });

  it("marks a route with the parameters its path names", () => {
    const request = route({
      ...params<{ readonly id: string }>(),
      parent: OVERVIEW,
      path: "$id",
      sample: { id: "7" },
    });

    expect(request).toStrictEqual({
      kind: "route",
      parent: OVERVIEW,
      path: "$id",
      sample: { id: "7" },
    });

    expectTypeOf(request).toEqualTypeOf<RouteMarker<{ readonly id: string }>>();
  });

  it("types the search by the route's validator", () => {
    const overview = route({ path: "time-off", search: FILTER });

    expect(overview.search).toBe(FILTER);

    expectTypeOf(overview).toEqualTypeOf<RouteMarker<NoParams, Filter>>();
  });

  it("refuses a menu entry on a path with parameters", () => {
    const request = route({
      ...params<{ readonly id: string }>(),
      // @ts-expect-error -- a menu entry is a link without parameters, and this path names `$id`.
      navigation: { label: "navigation.request" },
      path: "$id",
      sample: { id: "7" },
    });

    expect(request.navigation).toStrictEqual({ label: "navigation.request" });
  });

  it("requires a sample on a path with parameters", () => {
    // @ts-expect-error -- the route's tests open the page at a sample.
    const request = route({ ...params<{ readonly id: string }>(), path: "$id" });

    expect(request.sample).toBeUndefined();
  });

  it("refuses a path that leaves out a parameter", () => {
    const request = route({
      ...params<{ readonly id: string }>(),
      // @ts-expect-error -- the path names no `$id` segment.
      path: "request",
      sample: { id: "7" },
    });

    expect(request.path).toBe("request");
  });

  it("declares the parameters in the type alone", () => {
    expect(params<{ readonly id: string }>()).toStrictEqual({});
  });

  it("names a data variable by a parameter of the path or a member of the search", () => {
    const request = route({
      ...params<{ readonly id: string }>(),
      data: [{ query: REQUESTS, variables: ["id", "status"] }],
      path: "$id",
      sample: { id: "7" },
      search: FILTER,
    });

    expect(request.data).toStrictEqual([{ query: REQUESTS, variables: ["id", "status"] }]);
  });

  it("refuses a data variable the path and the search do not name", () => {
    const overview = route({
      // @ts-expect-error -- `owner` is neither a parameter of the path nor a member of the search.
      data: [{ query: REQUESTS, variables: ["owner"] }],
      path: "time-off",
      search: FILTER,
    });

    expect(overview.data?.[0]?.variables).toStrictEqual(["owner"]);
  });
});
