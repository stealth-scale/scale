import { createElement, type ReactNode } from "react";

import { describe, expect, it } from "vitest";

import {
  type AnyRoute,
  createAppRootRoute,
  createRoute,
  namedRoute,
  Outlet,
  RouteLink,
  type RoutesContext,
} from "@stealthscale/provider-router";

import { mountRoute, mountRouter, routerOver } from "#mount.ts";

/**
 * Renders the invoice list and the route open beneath it.
 *
 * @returns The list and its outlet.
 */
function Invoices(): ReactNode {
  return createElement(
    "main",
    null,
    createElement(RouteLink, { params: { id: "42" }, to: "app.invoice" }, "Open 42"),
    createElement(Outlet),
  );
}

/**
 * Renders one invoice.
 *
 * @returns The invoice element.
 */
function Invoice(): ReactNode {
  return createElement("article", null, "One invoice");
}

/**
 * Returns a route tree holding the invoice list and one invoice beneath it.
 *
 * @returns The assembled route tree.
 */
function tree(): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const invoices = createRoute({
    ...namedRoute("app.invoices"),
    component: Invoices,
    getParentRoute: () => root,
    path: "/invoices",
  });
  const invoice = createRoute({
    ...namedRoute("app.invoice"),
    component: Invoice,
    getParentRoute: () => invoices,
    path: "$id",
  });

  return root.addChildren([invoices.addChildren([invoice])]);
}

describe("routerOver", () => {
  it("opens the router at the path it was given", () => {
    expect(routerOver(tree(), "/invoices").state.location.pathname).toBe("/invoices");
  });

  it("opens the router at the site root when no path is given", () => {
    expect(routerOver(tree()).state.location.pathname).toBe("/");
  });

  it("returns a new router on each call", () => {
    const built = tree();

    expect(routerOver(built)).not.toBe(routerOver(built));
  });

  it("puts the route map in the router context", () => {
    const built: { options: { context: RoutesContext } } = routerOver(tree());

    expect(built.options.context.routes?.size).toBe(2);
  });
});

describe("mountRoute", () => {
  it("renders the page the path matches", async () => {
    const { result } = await mountRoute(tree(), "/invoices");

    expect(result.getByRole("main")).toBeTruthy();
  });

  it("renders the child route the path names", async () => {
    const { result } = await mountRoute(tree(), "/invoices/42");

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("resolves a named route link to its path", async () => {
    const { result } = await mountRoute(tree(), "/invoices");

    expect(result.getByRole("link").getAttribute("href")).toBe("/invoices/42");
  });

  it("returns the router the page was rendered from", async () => {
    const { router } = await mountRoute(tree(), "/invoices");

    expect(router.state.location.pathname).toBe("/invoices");
  });
});

describe("mountRouter", () => {
  it("renders the page the router is already on", async () => {
    const { result } = await mountRouter(routerOver(tree(), "/invoices/42"));

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("navigates to the path before it renders", async () => {
    const { result } = await mountRouter(routerOver(tree(), "/invoices"), "/invoices/42");

    expect(result.getByRole("article").textContent).toBe("One invoice");
  });

  it("leaves the router at its location when no path is given", async () => {
    const { router } = await mountRouter(routerOver(tree(), "/invoices"));

    expect(router.state.location.pathname).toBe("/invoices");
  });
});
