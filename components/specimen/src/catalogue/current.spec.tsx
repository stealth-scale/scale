import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import {
  compileRoutes,
  createAppRootRoute,
  Outlet,
  type RouteDeclaration,
} from "@stealthscale/provider-router";
import { mountRoute } from "@stealthscale/testing-router";

import { useCatalogueMark } from "#catalogue/current.ts";
import { routeId } from "#catalogue/routes.tsx";

/**
 * The id of the route an application hung the catalogue under.
 */
const CATALOGUE = "docs.components";

/**
 * Draws what a link to the catalogue would carry, so a case reads it out of the document.
 */
function Probe(): ReactElement {
  return <span>{useCatalogueMark(CATALOGUE)}</span>;
}

/**
 * Draws the probe on a declared route of the given id.
 */
async function on(id: string): Promise<string> {
  const compiled: readonly RouteDeclaration[] = [{ component: Probe, id, path: "/here" }];
  const root = createAppRootRoute()({ component: Outlet });
  const { result } = await mountRoute(
    root.addChildren([...compileRoutes(compiled, { parent: root })]),
    "/here",
  );

  return result.container.textContent ?? "";
}

describe("useCatalogueMark", () => {
  it("marks a link to the catalogue on a page of the catalogue", async () => {
    await expect(on(routeId("components/actions/button"))).resolves.toBe("page");
  });

  it("marks a link to the catalogue on an index the catalogue draws", async () => {
    await expect(on(`${CATALOGUE}.components.actions`)).resolves.toBe("page");
  });

  it("leaves a link to the catalogue unmarked on a page outside it", async () => {
    await expect(on("docs.changelog")).resolves.toBe("false");
  });

  it("leaves a link to the catalogue unmarked where no route declared itself", async () => {
    const { result } = await mountRoute(createAppRootRoute()({ component: Probe }));

    expect(result.container.textContent).toBe("false");
  });
});
