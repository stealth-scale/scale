import { type ReactElement, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { RouteLink } from "#link.tsx";
import { routeMap } from "#map.ts";
import { routerOptions } from "#options.ts";
import { type AnyParams, type RouteRef } from "#reference.ts";
import { createAppRootRoute } from "#root.ts";
import {
  createMemoryHistory,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "#tanstack.ts";

/**
 * The reference a plugin SDK returns for the invoice list, with its search.
 */
const LIST: RouteRef<AnyParams, { readonly tab: "history" | "lines" }> = { id: "acme.list" };

/**
 * Renders nothing, in the place of a page a declaration names.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Renders a link above whatever page a router opened, inside a router that knows the declarations.
 *
 * @remarks
 *   The root route renders the link, because the root matches whatever the router opened. One case
 *   therefore reads the link from a page the route it names is not on.
 * @param link - The link to render.
 * @param at - The path to open.
 * @returns Nothing. The caller reads the screen.
 */
async function linked(link: ReactElement, at = "/"): Promise<void> {
  /**
   * Renders the link above the page the router opened.
   *
   * @returns The link and the outlet.
   */
  function Chrome(): ReactNode {
    return (
      <div>
        {link}
        <Outlet />
      </div>
    );
  }

  const root = createAppRootRoute()({ component: Chrome });
  const home = createRoute({ component: Page, getParentRoute: () => root, path: "/" });
  const plugins = createRoute({ getParentRoute: () => root, path: "/app" });
  const compiled = compileRoutes(
    [
      { component: Page, id: "acme.list", path: "/invoices" },
      { component: Page, id: "acme.one", path: "/invoices/$id" },
    ],
    { parent: plugins },
  );
  const tree = root.addChildren([home, plugins.addChildren([...compiled])]);
  const router = createRouter({
    ...routerOptions({ routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

describe("RouteLink", () => {
  it("links to the path a declared id resolves to", async () => {
    await linked(<RouteLink to="acme.list">Open</RouteLink>);

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices");
  });

  it("fills in what the declared path names", async () => {
    await linked(
      <RouteLink params={{ id: "42" }} to="acme.one">
        Open
      </RouteLink>,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices/42");
  });

  it("writes the search into the address", async () => {
    await linked(
      <RouteLink search={{ tab: "history" }} to={LIST}>
        Open
      </RouteLink>,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices?tab=history");
  });

  it("refuses a search the reference does not type", async () => {
    await linked(
      // @ts-expect-error -- the reference types `tab` as `history` or `lines`, so `notes` is refused.
      <RouteLink search={{ tab: "notes" }} to={LIST}>
        Open
      </RouteLink>,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe("/app/invoices?tab=notes");
  });

  it("renders the children it was given", async () => {
    await linked(<RouteLink to="acme.list">Open</RouteLink>);

    expect(screen.getByRole("link").textContent).toBe("Open");
  });

  it("marks a declared link active with the library's own state", async () => {
    await linked(<RouteLink to="acme.list">Open</RouteLink>, "/app/invoices");

    const link = screen.getByRole("link");

    expect(link.dataset["status"]).toBe("active");
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("marks the link active on a page below the route it names", async () => {
    await linked(<RouteLink to="acme.list">Open</RouteLink>, "/app/invoices/42");

    expect(screen.getByRole("link").dataset["status"]).toBe("active");
  });

  it("is not active where the page is elsewhere", async () => {
    await linked(<RouteLink to="acme.list">Open</RouteLink>, "/");

    expect(screen.getByRole("link").dataset["status"]).toBeUndefined();
  });

  it("passes the library every other prop it was given", async () => {
    await linked(
      <RouteLink className="menu" title="Invoices" to="acme.list">
        Open
      </RouteLink>,
    );

    const link = screen.getByRole("link");

    expect(link.getAttribute("class")).toBe("menu");
    expect(link.getAttribute("title")).toBe("Invoices");
  });
});
