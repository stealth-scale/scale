import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { identity, identityContract } from "#resolve/requirements.fixtures.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";
import {
  colon,
  formed,
  guarded,
  listed,
  located,
  orphan,
  PAGE_PLACED,
  paged,
  PLACED,
  ring,
  sectioned,
  twin,
} from "#resolve/routes.fixtures.ts";
import { checkRoutes, normalised, resolveRoutes } from "#resolve/routes.ts";

describe("routes", () => {
  it.each([
    { path: "home", want: "/home" },
    { path: "/home/", want: "/home" },
    { path: "", want: "/" },
  ])("writes $path as $want", ({ path, want }) => {
    expect(normalised(path)).toBe(want);
  });

  it("passes the routes of installed plugins", () => {
    const context = contextFor(productOf([installed(timeOff), installed(identity)]));

    expect(faultsOf(checkRoutes, context)).toStrictEqual({ problems: [], warnings: [] });
  });

  it("refuses a path in the :name form", () => {
    expect(faultsOf(checkRoutes, contextFor(productOf([installed(colon)]))).problems).toStrictEqual(
      ["colon.routes.detail.path: uses :name, and the router reads $name"],
    );
  });

  it("refuses a route in a route's condition", () => {
    const context = contextFor(productOf([installed(timeOff), installed(located)]));

    expect(faultsOf(checkRoutes, context).problems).toStrictEqual([
      "located.routes.here.when.allOf.0.route: is refused where the condition runs before a match",
    ]);
  });

  it("refuses a route in the product's condition", () => {
    const when = { route: timeOffContract.routes.overview };
    const context = contextFor(productOf([installed(timeOff)], { when }));

    expect(faultsOf(checkRoutes, context).problems).toStrictEqual([
      "product.when.route: is refused where the condition runs before a match",
    ]);
  });

  it("refuses a menu entry on a path with parameters", () => {
    expect(faultsOf(checkRoutes, contextFor(productOf([installed(listed)]))).problems).toContain(
      "listed.routes.detail.navigation: is refused on a path with parameters",
    );
  });

  it("refuses a path with parameters that states no sample", () => {
    expect(faultsOf(checkRoutes, contextFor(productOf([installed(listed)]))).problems).toContain(
      "listed.routes.detail.sample: is required on a path with parameters",
    );
  });

  it("refuses a parent whose plugin is not installed", () => {
    expect(
      faultsOf(checkRoutes, contextFor(productOf([installed(orphan)]))).problems,
    ).toStrictEqual([
      "orphan.routes.detail.parent: names the route billing/home, whose plugin is not installed",
    ]);
  });

  it("warns of a menu whose plugin is not installed", () => {
    expect(
      faultsOf(checkRoutes, contextFor(productOf([installed(orphan)]))).warnings,
    ).toStrictEqual([
      "orphan.routes.detail.navigation.menu: names the menu billing/reports, whose plugin is not installed",
    ]);
  });

  it("refuses two routes that serve one path under one parent", () => {
    const context = contextFor(productOf([installed(timeOff), installed(twin)]));

    expect(faultsOf(checkRoutes, context).problems).toStrictEqual([
      "twin.routes.home.path: serves /time-off under the root, as time-off/overview does",
      "twin.routes.settings.path: serves /time-off/time-off under host/settings, as host/settings/time-off/time-off does",
    ]);
  });

  it("refuses parents that form a cycle", () => {
    expect(faultsOf(checkRoutes, contextFor(productOf([installed(ring)]))).problems).toStrictEqual([
      "ring.routes.first.parent: forms a cycle: ring/first → ring/second → ring/first",
    ]);
  });

  it("joins the product's condition into every route but the sign-in route", () => {
    const when = { authenticated: true };
    const definition = productOf([installed(identity), installed(guarded)], {
      signIn: identityContract.routes.signIn,
      when,
    });
    const routes = resolveRoutes(contextFor(definition), PLACED);

    expect(routes.map((route) => [route.id, route.when])).toStrictEqual([
      ["host/settings", when],
      ["identity/signIn", undefined],
      ["guarded/loaded", when],
      ["guarded/page", { allOf: [when, when] }],
      ["host/settings/host/plugins", when],
    ]);
  });

  it("keeps a route's own condition where the product states none", () => {
    const routes = resolveRoutes(contextFor(productOf([installed(guarded)])), PLACED);

    expect(routes.find((route) => route.id === "guarded/page")?.when).toStrictEqual({
      authenticated: true,
    });
  });

  it("resolves a menu entry into the host's main menu where it names none", () => {
    const routes = resolveRoutes(
      contextFor(productOf([installed(timeOff), installed(guarded)])),
      PLACED,
    );

    expect(
      routes.flatMap((route) => (route.navigation === undefined ? [] : [route.navigation])),
    ).toStrictEqual([
      { label: "navigation.overview", menu: "time-off/reports", order: undefined },
      { label: "navigation.page", menu: "host/main", order: 2 },
      { label: "settings.plugins", menu: "host/settings", order: undefined },
      { label: "settings.title", menu: "host/settings", order: 40 },
    ]);
  });

  it("resolves a page's data by the queries' ids", () => {
    const routes = resolveRoutes(
      contextFor(productOf([installed(timeOff), installed(guarded)])),
      PLACED,
    );

    expect(routes.find((route) => route.id === "guarded/loaded")?.data).toStrictEqual([
      { query: "time-off/request", variables: ["id"] },
      { query: "time-off/request", variables: [] },
    ]);
  });

  it("loads the plugins of the extensions in a page's slots and around the page", () => {
    const routes = resolveRoutes(contextFor(productOf([installed(timeOff)])), PLACED);

    expect(routes.find((route) => route.id === "time-off/request")).toMatchObject({
      loads: ["cards", "inventory"],
      parent: "time-off/overview",
      plugin: "time-off",
      sample: { id: "7" },
    });
  });

  it("resolves a settings page as a child of the settings route in the settings menu", () => {
    const routes = resolveRoutes(contextFor(productOf([installed(paged)])), PLACED);

    expect(routes.find((route) => route.id === "host/settings/paged/main")).toStrictEqual({
      data: [],
      id: "host/settings/paged/main",
      loads: [],
      navigation: { label: "settings.main", menu: "host/settings", order: 2 },
      parent: "host/settings",
      path: "paged/main",
      plugin: "paged",
      sample: undefined,
      when: { authenticated: true },
    });
  });

  it("joins the product's condition into a settings page's condition", () => {
    const when = { permission: { id: "paged/read", kind: "permission" as const } };
    const routes = resolveRoutes(contextFor(productOf([installed(paged)], { when })), PLACED);

    expect(routes.find((route) => route.id === "host/settings/paged/main")?.when).toStrictEqual({
      allOf: [when, { authenticated: true }],
    });
  });

  it("leaves out the host's account page where no section targets it", () => {
    const routes = resolveRoutes(contextFor(productOf([installed(timeOff)])), PLACED);

    expect(
      routes.filter((route) => route.parent === "host/settings").map(({ id }) => id),
    ).toStrictEqual(["host/settings/host/plugins", "host/settings/time-off/time-off"]);
  });

  it("resolves the host's account page where a section targets it", () => {
    const definition = productOf([installed(paged), installed(sectioned)]);
    const routes = resolveRoutes(contextFor(definition), PLACED);

    expect(routes.map(({ id }) => id)).toContain("host/settings/host/account");
  });

  it("loads the plugins of a settings page's component sections and of its extensions", () => {
    const definition = productOf([installed(paged), installed(sectioned), installed(formed)]);
    const routes = resolveRoutes(contextFor(definition), PAGE_PLACED);

    expect(routes.find((route) => route.id === "host/settings/paged/main")?.loads).toStrictEqual([
      "sectioned",
      "notes",
    ]);
  });

  it("leaves a settings page's own plugin out of the plugins that load with it", () => {
    const routes = resolveRoutes(contextFor(productOf([installed(timeOff)])), PLACED);

    expect(
      routes.find((route) => route.id === "host/settings/time-off/time-off")?.loads,
    ).toStrictEqual([]);
  });
});
