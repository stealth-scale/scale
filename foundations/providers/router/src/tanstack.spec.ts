import { describe, expect, it } from "vitest";

import * as published from "#index.ts";
import * as tanstack from "#tanstack.ts";

/**
 * The names this package builds on, which a library upgrade renaming one would break silently.
 */
const USED = [
  "Link",
  "Outlet",
  "RouterProvider",
  "createMemoryHistory",
  "createRootRouteWithContext",
  "createRoute",
  "createRouter",
  "interpolatePath",
  "isNotFound",
  "lazyRouteComponent",
  "notFound",
  "redirect",
  "rootRouteId",
  "useMatches",
  "useRouteContext",
] as const;

/**
 * The names this package publishes of its own, which the barrel states beside the library's.
 */
const OWN = [
  "RouteLink",
  "compileRoutes",
  "createAppRootRoute",
  "declaredOf",
  "namedRoute",
  "routeHref",
  "routeMap",
  "routerDefaults",
  "routerOptions",
  "useDeclaredRoute",
  "useRouteHref",
  "useRouteMap",
  "useRouteParams",
  "useRouteSearch",
] as const;

describe("tanstack", () => {
  it.each(USED)("re-exports %s", (name) => {
    expect(tanstack).toHaveProperty(name);
  });

  it("re-exports more than the names this package builds on", () => {
    expect(Object.keys(tanstack).length).toBeGreaterThan(USED.length);
  });

  it.each(OWN)("publishes %s of its own", (name) => {
    expect(published).toHaveProperty(name);
  });

  it("names nothing the library also names", () => {
    const library = new Set(Object.keys(tanstack));

    expect(OWN.filter((name) => library.has(name))).toStrictEqual([]);
  });
});
