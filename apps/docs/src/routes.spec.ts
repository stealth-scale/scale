import { describe, expect, it } from "vitest";

import { type RouteDeclaration } from "@stealthscale/provider-router";
import { routerOver } from "@stealthscale/testing-router";

import { opened } from "#app.fixtures.tsx";
import { COMPILED } from "#catalogue.ts";
import { buildTree, rerouted, routed } from "#routes.tsx";

/**
 * A page the index did not hold when the router was built, nested as the button's page is.
 */
const GAINED: RouteDeclaration = {
  ...COMPILED.find((one) => one.id === "specimen.components.actions.button"),
  component: () => null,
  id: "specimen.components.data.gained",
  path: "components/data/gained",
};

describe("rerouted", () => {
  it("keeps the route tree when the compiled routes are unchanged", () => {
    const router = routed();
    const tree = router.routeTree;

    rerouted(router);

    expect(router.routeTree).toBe(tree);
  });

  it("adds a gained page to the route tree when the compiled routes change", () => {
    const router = routed();

    rerouted(router, [...COMPILED, GAINED]);

    expect(Object.keys(router.routesById)).toContain("/_docs.frame/components/data/gained");
  });

  it("builds the tree once for the same changed routes", () => {
    const router = routed();
    const changed = [...COMPILED, GAINED];

    rerouted(router, changed);
    const tree = router.routeTree;
    rerouted(router, changed);

    expect(router.routeTree).toBe(tree);
  });
});

describe("buildTree", () => {
  it("serves the catalogue under its own path inside the frame", () => {
    const router = routerOver(buildTree());
    const found = Object.keys(router.routesById).filter((id) => id.startsWith("/_docs"));

    expect(found).toContain("/_docs.frame/components/actions/button");
  });

  it("serves the catalogue at the site root rather than under a path of its own", async () => {
    const router = routerOver(buildTree());

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/");
  });

  it("opens the index at the site root", async () => {
    const result = await opened("/");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Catalogue");
  });

  it("opens the index of a section at the section's path", async () => {
    const result = await opened("/components");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Components");
  });

  it("opens the index of a group at the group's path", async () => {
    const result = await opened("/components/actions");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Actions");
  });

  it("opens a page the build indexed at its path under the catalogue's", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Button");
  });
});
