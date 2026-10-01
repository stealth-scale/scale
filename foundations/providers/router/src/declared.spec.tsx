import { type FunctionComponent, type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { compileRoutes } from "#compile.ts";
import { type RouteDeclaration, type SearchValidator } from "#declaration.ts";
import { declaredOf, useDeclaredRoute, useRouteParams, useRouteSearch } from "#declared.ts";
import { routeMap } from "#map.ts";
import { quietly } from "#quiet.fixtures.ts";
import { type AnyParams, type RouteRef } from "#reference.ts";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
  Outlet,
  RouterProvider,
} from "#tanstack.ts";

/**
 * Describes the search the requests page reads.
 */
interface Filtered {
  /**
   * The requests the page lists.
   */
  readonly status: "closed" | "open";
}

/**
 * Validates a search by reading `status` from it, and `open` where it states none.
 */
const FILTERED: SearchValidator<Filtered> = {
  "~standard": {
    validate: (value) => ({
      value: {
        status:
          typeof value === "object" &&
          value !== null &&
          "status" in value &&
          value.status === "closed"
            ? "closed"
            : "open",
      },
    }),
    vendor: "acme",
    version: 1,
  },
};

/**
 * The reference a plugin SDK returns for the invoice route.
 */
const INVOICE: RouteRef<{ invoice: string }> = { id: "acme.one" };

/**
 * The reference a plugin SDK returns for the requests route, with its search.
 */
const REQUESTS: RouteRef<AnyParams, Filtered> = { id: "acme.requests" };

/**
 * Renders nothing, in the place of a page a declaration names.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Renders the id of the deepest declared route, so a case can read it from the screen.
 *
 * @returns The declared id, or `none` where no declared route is matched.
 */
function Reading(): ReactNode {
  const declared = useDeclaredRoute();

  return (
    <div>
      <span data-testid="declared">{declared === undefined ? "none" : declared.id}</span>
      <Outlet />
    </div>
  );
}

/**
 * Renders why a page refused to render, so a case can read it from the screen.
 *
 * @param props - What the library passes an error component.
 * @returns The message.
 */
function Failed({ error }: ErrorComponentProps): ReactNode {
  return <span data-testid="failed">{String(error)}</span>;
}

/**
 * Renders the parameter the invoice reference names.
 *
 * @returns The parameter, by name.
 */
function Invoice(): ReactNode {
  return <span data-testid="read">{useRouteParams(INVOICE).invoice}</span>;
}

/**
 * Renders the status the requests reference types.
 *
 * @returns The status the search names.
 */
function Requests(): ReactNode {
  return <span data-testid="read">{useRouteSearch(REQUESTS).status}</span>;
}

/**
 * Opens a host at a path, with declared routes and one route written in code.
 *
 * @param at - The path to open.
 * @param declarations - The routes to compile.
 * @param home - The page the route written in code renders at `/app/home`.
 * @returns Nothing. The caller reads the screen.
 */
async function opened(
  at: string,
  declarations: readonly RouteDeclaration[],
  home: FunctionComponent = Page,
): Promise<void> {
  const root = createRootRoute({ component: Reading });
  const shell = createRoute({
    component: () => <Outlet />,
    getParentRoute: () => root,
    path: "/app",
  });
  const written = createRoute({
    component: home,
    errorComponent: Failed,
    getParentRoute: () => shell,
    path: "/home",
  });
  const routes = compileRoutes(declarations, { errorComponent: () => Failed, parent: shell });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: root.addChildren([shell.addChildren([written, ...routes])]),
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

describe("declaredOf", () => {
  it("reads the declaration a compiled route stores", () => {
    const root = createRootRoute({});
    const compiled = compileRoutes(
      [{ component: Page, id: "acme.one", navigation: { order: 2 }, path: "/one" }],
      { parent: root },
    );
    const named = routeMap(root.addChildren([...compiled]));

    expect(
      declaredOf({ staticData: named.get("acme.one")?.options.staticData ?? {} }),
    ).toStrictEqual({
      id: "acme.one",
      navigation: { order: 2 },
    });
  });

  it("returns nothing for a match that stores no declaration", () => {
    expect(declaredOf({ staticData: {} })).toBeUndefined();
  });

  it("reads a declaration that states no menu entry", () => {
    expect(declaredOf({ staticData: { declared: { id: "acme.one" } } })).toStrictEqual({
      id: "acme.one",
    });
  });

  it("returns nothing where the static data stores something else", () => {
    expect(declaredOf({ staticData: { declared: "a string" } })).toBeUndefined();
    expect(declaredOf({ staticData: { declared: { order: 2 } } })).toBeUndefined();
  });
});

describe("useDeclaredRoute", () => {
  it("returns the declaration of the page a person is on", async () => {
    await opened("/app/one", [{ component: Page, id: "acme.one", path: "/one" }]);

    expect(screen.getByTestId("declared").textContent).toBe("acme.one");
  });

  it("returns the deepest declaration where one nests under another", async () => {
    await opened("/app/one/two", [
      { component: Page, id: "acme.one", path: "/one" },
      { component: Page, id: "acme.two", parent: "acme.one", path: "/two" },
    ]);

    expect(screen.getByTestId("declared").textContent).toBe("acme.two");
  });

  it("returns nothing on a page rendered from a route nobody named", async () => {
    await opened("/app/home", [{ component: Page, id: "acme.one", path: "/one" }]);

    expect(screen.getByTestId("declared").textContent).toBe("none");
  });
});

describe("useRouteParams", () => {
  it("returns the parameters the route named under the names the reference states", async () => {
    await opened("/app/invoices/42", [
      { component: Invoice, id: "acme.one", path: "/invoices/$invoice" },
    ]);

    expect(screen.getByTestId("read").textContent).toBe("42");
  });

  it("throws where the page being rendered is another route", async () => {
    await quietly(() =>
      opened("/app/other", [
        { component: Invoice, id: "acme.other", path: "/other" },
        { component: Page, id: "acme.one", path: "/invoices/$invoice" },
      ]),
    );

    expect(screen.getByTestId("failed").textContent).toContain(
      "The page being rendered is not acme.one, so it cannot return that route's parameters.",
    );
  });

  it("throws where no declared route is matched", async () => {
    await quietly(() => opened("/app/home", [], Invoice));

    expect(screen.getByTestId("failed").textContent).toContain(
      "The page being rendered is not acme.one",
    );
  });
});

describe("useRouteSearch", () => {
  it("returns the search the route's validator returned", async () => {
    await opened("/app/requests?status=closed", [
      { component: Requests, id: "acme.requests", path: "/requests", search: FILTERED },
    ]);

    expect(screen.getByTestId("read").textContent).toBe("closed");
  });

  it("returns the validator's default where the search states no status", async () => {
    await opened("/app/requests", [
      { component: Requests, id: "acme.requests", path: "/requests", search: FILTERED },
    ]);

    expect(screen.getByTestId("read").textContent).toBe("open");
  });

  it("throws where the page being rendered is another route", async () => {
    await quietly(() =>
      opened("/app/other", [
        { component: Requests, id: "acme.other", path: "/other" },
        { component: Page, id: "acme.requests", path: "/requests", search: FILTERED },
      ]),
    );

    expect(screen.getByTestId("failed").textContent).toContain(
      "The page being rendered is not acme.requests, so it cannot return that route's search.",
    );
  });

  it("throws where no declared route is matched", async () => {
    await quietly(() => opened("/app/home", [], Requests));

    expect(screen.getByTestId("failed").textContent).toContain(
      "The page being rendered is not acme.requests",
    );
  });
});
