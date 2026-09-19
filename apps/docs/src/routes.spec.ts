import { describe, expect, it } from "vitest";

import { routerOver } from "@stealthscale/testing-router";

import { opened } from "#app.fixtures.tsx";
import { buildTree } from "#routes.tsx";

describe("buildTree", () => {
  it("serves the catalogue under its own path inside the frame", () => {
    const router = routerOver(buildTree());
    const found = Object.keys(router.routesById).filter((id) => id.startsWith("/_docs"));

    expect(found).toContain("/_docs.frame/components/actions/button");
  });

  it("sends the site root to the catalogue", async () => {
    const router = routerOver(buildTree());

    await router.navigate({ to: "/" });
    await router.load();

    expect(router.state.location.pathname).toBe("/components");
  });

  it("opens the index at the catalogue's path", async () => {
    const result = await opened("/components");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Components");
  });

  it("opens a page the build indexed at its path under the catalogue's", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("heading", { level: 1 }).textContent).toBe("Button");
  });
});
