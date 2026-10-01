import { type ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { compileRoutes } from "#compile.ts";
import {
  type LayoutProps,
  type RouteDeclaration,
  type RouteLoaderArgs,
  type SearchValidator,
} from "#declaration.ts";
import { routeMap } from "#map.ts";
import { quietly } from "#quiet.fixtures.ts";
import {
  type AnyRoute,
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorRouteComponent,
  isNotFound,
  Outlet,
  RouterProvider,
} from "#tanstack.ts";

/**
 * Validates a search by reading `tab` from it, and `lines` where it states none.
 */
const TABBED: SearchValidator<{ readonly tab: string }> = {
  "~standard": {
    validate: (value) => ({
      value: {
        tab:
          typeof value === "object" && value !== null && "tab" in value
            ? String(value.tab)
            : "lines",
      },
    }),
    vendor: "acme",
    version: 1,
  },
};

/**
 * Describes the router a case builds, beyond its tree.
 */
interface Settings {
  /**
   * The router's context.
   */
  readonly context?: object | undefined;

  /**
   * How long a loader's result is fresh, in milliseconds. Zero where it states none.
   */
  readonly fresh?: number | undefined;
}

/**
 * Renders nothing, which is enough for a route that is never rendered.
 *
 * @returns Nothing.
 */
function Page(): null {
  return null;
}

/**
 * Renders a layout that returns the route below it.
 *
 * @param props - The route below the frame.
 * @returns The frame.
 */
function Frame({ children }: LayoutProps): ReactNode {
  return children;
}

/**
 * Renders a frame that writes the options the declaration stated for it.
 *
 * @param props - The route below the frame, and the stated options.
 * @returns The frame.
 */
function Reporting({ children, options }: LayoutProps): ReactNode {
  return (
    <div data-testid="frame" data-wide={String(options?.["wide"])}>
      {children}
    </div>
  );
}

/**
 * Builds a root and a parent to compile under, fresh for every case.
 *
 * @returns The root route and the route declarations hang under.
 */
function tree(): { parent: AnyRoute; root: AnyRoute } {
  const root = createRootRoute({});
  const parent = createRoute({ getParentRoute: () => root, path: "/app" });

  return { parent, root };
}

/**
 * Builds a router over a compiled set, so ids and paths can be read as the library sees them.
 *
 * @param declarations - The declarations to compile.
 * @param options - The options the compiler needs beyond the declarations.
 * @param settings - The router's context, and how long a loader's result stays fresh.
 * @returns The compiled routes, the parent they were placed under, the tree and the router.
 */
function routed(
  declarations: readonly RouteDeclaration[],
  options: Omit<Parameters<typeof compileRoutes>[1], "parent"> = {},
  settings: Settings = {},
): { compiled: readonly AnyRoute[]; parent: AnyRoute; router: AnyRouter; tree: AnyRoute } {
  const { parent, root } = tree();
  const compiled = compileRoutes(declarations, { ...options, parent });
  const built = root.addChildren([parent.addChildren([...compiled])]);
  const router = createRouter({
    context: settings.context ?? {},
    defaultStaleTime: settings.fresh ?? 0,
    history: createMemoryHistory({ initialEntries: ["/app"] }),
    routeTree: built,
  });

  return { compiled, parent, router, tree: built };
}

/**
 * Lists the pathless routes of a router, which are the frames the layouts compiled to.
 *
 * @param router - The router to read.
 * @returns One id per pathless route.
 */
function framesOf(router: { routesById: Readonly<Record<string, unknown>> }): string[] {
  return Object.keys(router.routesById).filter(
    (id) => id.startsWith("/") && id.split("/").at(-1)?.startsWith("_") === true,
  );
}

/**
 * Builds one declaration, with whatever a case overrides.
 *
 * @param over - The members to state beyond the defaults.
 * @returns The declaration.
 */
function declared(over: Partial<RouteDeclaration> = {}): RouteDeclaration {
  return { component: Page, id: "acme.one", path: "/one", ...over };
}

/**
 * Renders the host's own chrome around the declared route below it.
 *
 * @returns The chrome, with the outlet inside it.
 */
function Shell(): ReactNode {
  return (
    <div data-testid="shell">
      <Outlet />
    </div>
  );
}

/**
 * Builds a host whose shell renders around one declared route, and renders it.
 *
 * @param declaration - The one route the host renders.
 * @returns Nothing. The caller reads the screen.
 */
async function hosted(declaration: RouteDeclaration): Promise<void> {
  const root = createRootRoute({});
  const shell = createRoute({ component: Shell, getParentRoute: () => root, path: "/app" });
  const routes = compileRoutes([declaration], {
    errorComponent: (failed) =>
      function Failed(): ReactNode {
        return <span data-testid="failed">{failed.id}</span>;
      },
    parent: shell,
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/app/one"] }),
    routeTree: root.addChildren([shell.addChildren([...routes])]),
  });

  await router.load();

  render(<RouterProvider router={router} />);
}

/**
 * Builds a whole tree and a server router over one set of declarations.
 *
 * @remarks
 *   `isServer` is stated rather than inferred. The library reads it to decide whether to serve
 *   from the process-wide tree cache, and a specification running against a document would never
 *   reach that path.
 * @param paths - One path per declaration, each its own route.
 * @returns The router, and the tree it was built over.
 */
function served(paths: readonly string[]): { router: AnyRouter; tree: AnyRoute } {
  const root = createRootRoute({});
  const shell = createRoute({ getParentRoute: () => root, path: "/app" });
  const routes = compileRoutes(
    paths.map((path) => ({ component: Page, id: `acme${path}`, path })),
    { parent: shell },
  );
  const built = root.addChildren([shell.addChildren([...routes])]);

  return {
    router: createRouter({
      history: createMemoryHistory({ initialEntries: ["/app"] }),
      isServer: true,
      routeTree: built,
    }),
    tree: built,
  };
}

/**
 * Lists the paths a router serves, leaving out the root and the shell.
 *
 * @param router - The router to read.
 * @returns One full path per compiled route.
 */
function pathsOf(router: AnyRouter): string[] {
  return Object.keys(router.routesById)
    .filter((id) => id.startsWith("/app/"))
    .toSorted();
}

/**
 * Builds a loader that records every call and resolves at once.
 *
 * @returns The loader, as a spy.
 */
function recording(): Mock<(args: RouteLoaderArgs) => void> {
  return vi.fn<(args: RouteLoaderArgs) => void>();
}

describe("compileRoutes", () => {
  it("compiles a declaration to a route under the parent it was given", () => {
    const { router } = routed([declared()]);

    expect(Object.keys(router.routesById)).toContain("/app/one");
  });

  it("names every declared route in the tree it was placed in", () => {
    const { parent, tree: built } = routed([
      declared({ id: "acme.one" }),
      declared({ id: "acme.two", path: "/two" }),
    ]);
    const named = routeMap(built);

    expect([...named.keys()]).toStrictEqual(["acme.one", "acme.two"]);
    expect(named.get("acme.two")?.fullPath).toBe("/app/two");
    expect(parent.children).toHaveLength(2);
  });

  it("leaves the parent's own children untouched", () => {
    const { parent, root } = tree();
    const written = createRoute({ getParentRoute: () => parent, path: "/home" });

    parent.addChildren([written]);
    root.addChildren([parent]);

    compileRoutes([declared()], { parent });

    expect(parent.children).toStrictEqual([written]);
  });

  it("returns routes sharing no object with a second call over one parent", () => {
    const { parent } = tree();
    const first = compileRoutes([declared()], { parent });
    const second = compileRoutes([declared()], { parent });

    expect(first[0]).not.toBe(second[0]);
  });

  it("nests a declaration under another it names", () => {
    const { router } = routed([
      declared({ id: "acme.parent", path: "/parent" }),
      declared({ id: "acme.child", parent: "acme.parent", path: "/child" }),
    ]);

    expect(Object.keys(router.routesById)).toContain("/app/parent/child");
  });

  it("nests a declaration under one declared after it", () => {
    const { router } = routed([
      declared({ id: "acme.child", parent: "acme.parent", path: "/child" }),
      declared({ id: "acme.parent", path: "/parent" }),
    ]);

    expect(Object.keys(router.routesById)).toContain("/app/parent/child");
  });

  it("renders a layout as a pathless parent that consumes no path segment", () => {
    const { router, tree: built } = routed([declared({ layout: ["frame"] })], {
      layouts: { frame: Frame },
    });

    expect(framesOf(router)).toStrictEqual(["/app/_frame"]);
    expect(routeMap(built).get("acme.one")?.fullPath).toBe("/app/one");
  });

  it("renders the layout around the page with the options the declaration stated", async () => {
    const { router } = routed(
      [
        declared({
          component: () => <span data-testid="page">page</span>,
          layout: ["frame"],
          layoutOptions: { wide: true },
        }),
      ],
      { layouts: { frame: Reporting } },
    );

    await router.navigate({ to: "/app/one" });
    await router.load();
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("frame").dataset["wide"]).toBe("true");
    expect(screen.getByTestId("frame").contains(screen.getByTestId("page"))).toBe(true);
  });

  it("nests layouts outermost first", () => {
    const { router } = routed([declared({ layout: ["outer", "inner"] })], {
      layouts: { inner: Frame, outer: Frame },
    });

    expect(Object.keys(router.routesById)).toContain("/app/_outer/_inner");
  });

  it("shares one pathless parent between two routes naming one layout", () => {
    const { router } = routed(
      [
        declared({ id: "acme.one", layout: ["frame"] }),
        declared({ id: "acme.two", layout: ["frame"], path: "/two" }),
      ],
      { layouts: { frame: Frame } },
    );

    expect(framesOf(router)).toStrictEqual(["/app/_frame"]);
  });

  it("builds a second pathless parent where two routes state different layout options", () => {
    const { router } = routed(
      [
        declared({ id: "acme.one", layout: ["frame"], layoutOptions: { wide: true } }),
        declared({
          id: "acme.two",
          layout: ["frame"],
          layoutOptions: { wide: false },
          path: "/two",
        }),
      ],
      { layouts: { frame: Frame } },
    );

    expect(framesOf(router)).toHaveLength(2);
  });

  it("loads a lazy page no earlier than the first navigation", () => {
    const load = vi.fn(() => Promise.resolve({ default: Page }));

    routed([declared({ component: { load } })]);

    expect(load).not.toHaveBeenCalled();
  });

  it("refuses two declarations sharing an id", () => {
    expect(() => routed([declared(), declared()])).toThrow("Two routes declare the id acme.one.");
  });

  it("refuses a declaration naming a parent nothing declares", () => {
    expect(() => routed([declared({ parent: "acme.absent" })])).toThrow(
      "The route acme.one names the parent acme.absent, which is absent.",
    );
  });

  it("refuses a declaration naming a layout a route above it already renders", () => {
    expect(() =>
      routed(
        [
          declared({ id: "acme.parent", layout: ["frame"], path: "/parent" }),
          declared({ id: "acme.child", layout: ["frame"], parent: "acme.parent", path: "/child" }),
        ],
        { layouts: { frame: Frame } },
      ),
    ).toThrow(
      "The route acme.child names the layout frame, which a route above it already renders.",
    );
  });

  it("refuses a declaration naming a layout nothing provides", () => {
    expect(() => routed([declared({ layout: ["absent"] })])).toThrow(
      "The route acme.one names the layout absent, which is absent.",
    );
  });

  it("refuses declarations whose parents form a cycle", () => {
    expect(() =>
      routed([
        declared({ id: "acme.one", parent: "acme.two" }),
        declared({ id: "acme.two", parent: "acme.one", path: "/two" }),
      ]),
    ).toThrow("nests under itself");
  });

  it("refuses a declaration stating a condition when no evaluator was given", () => {
    expect(() => routed([declared({ when: { role: "admin" } })])).toThrow(
      "The route acme.one states a condition and no evaluator was given.",
    );
  });

  it("refuses a declaration stating an outlet", () => {
    expect(() => routed([declared({ outlet: "detail" })])).toThrow(
      "The route acme.one states the outlet detail.",
    );
  });

  it("routes a declaration whose condition is true", async () => {
    const { router } = routed([declared({ when: "allowed" })], { evaluate: () => true });

    await router.navigate({ to: "/app/one" });
    await router.load();

    expect(router.state.location.pathname).toBe("/app/one");
    expect(router.state.matches.every((match) => match.status === "success")).toBe(true);
  });

  it("refuses a declaration whose condition fails as not-found", async () => {
    const { router } = routed([declared({ when: "refused" })], { evaluate: () => false });

    await router.navigate({ to: "/app/one" });
    await router.load();

    expect(router.state.matches.some((match) => isNotFound(match.error))).toBe(true);
  });

  it("passes the evaluator the condition the declaration stated", async () => {
    const evaluate = vi.fn<(when: unknown, context: unknown) => boolean>(() => true);
    const { router } = routed([declared({ when: { role: "admin" } })], { evaluate });

    await router.navigate({ to: "/app/one" });
    await router.load();

    expect(evaluate.mock.lastCall?.[0]).toStrictEqual({ role: "admin" });
  });

  it("passes the evaluator the router's context", async () => {
    const evaluate = vi.fn<(when: unknown, context: unknown) => boolean>(() => true);
    const { router } = routed(
      [declared({ when: "allowed" })],
      { evaluate },
      { context: { session: "ada" } },
    );

    await router.navigate({ to: "/app/one" });
    await router.load();

    expect(evaluate.mock.lastCall?.[1]).toStrictEqual({ session: "ada" });
  });

  it("names the declaration when it builds an error component for one", () => {
    const errorComponent = vi.fn((): ErrorRouteComponent => Page);

    routed([declared()], { errorComponent });

    expect(errorComponent).toHaveBeenCalledWith(expect.objectContaining({ id: "acme.one" }));
  });

  it("validates a route's search with the validator the declaration states", async () => {
    const { router } = routed([declared({ search: TABBED })]);

    await router.navigate({ to: "/app/one" });
    await router.load();

    expect({ ...router.state.location.search }).toStrictEqual({ tab: "lines" });
  });

  it("passes the loader the parameters the route's path names", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader, path: "/invoices/$id" })]);

    await router.navigate({ to: "/app/invoices/42" });

    expect({ ...loader.mock.lastCall?.[0].params }).toStrictEqual({ id: "42" });
  });

  it("passes the loader the search the route's validator returns", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader, search: TABBED })]);

    await router.navigate({ search: { tab: "history" }, to: "/app/one" });

    expect(loader.mock.lastCall?.[0].search).toStrictEqual({ tab: "history" });
  });

  it("passes the loader the router's context", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader })], {}, { context: { session: "ada" } });

    await router.navigate({ to: "/app/one" });

    expect(loader.mock.lastCall?.[0].context).toStrictEqual({ session: "ada" });
  });

  it("runs the loader again when the search changes within its fresh time", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader, search: TABBED })], {}, { fresh: 60_000 });

    await router.navigate({ search: { tab: "lines" }, to: "/app/one" });
    await router.navigate({ search: { tab: "history" }, to: "/app/one" });

    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("runs the loader once for two navigations to one search within its fresh time", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader, search: TABBED })], {}, { fresh: 60_000 });

    await router.navigate({ search: { tab: "lines" }, to: "/app/one" });
    await router.navigate({ search: { tab: "lines" }, to: "/app/one" });

    expect(loader).toHaveBeenCalledOnce();
  });

  it("marks a navigation as no preload", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader })]);

    await router.navigate({ to: "/app/one" });

    expect(loader.mock.lastCall?.[0].preload).toBe(false);
  });

  it("marks a preload as one", async () => {
    const loader = recording();
    const { router } = routed([declared({ loader })]);

    await router.preloadRoute({ to: "/app/one" });

    expect(loader.mock.lastCall?.[0].preload).toBe(true);
  });

  it("aborts the loader's signal when a later navigation supersedes it", async () => {
    const signals: AbortSignal[] = [];
    const { router } = routed([
      declared({
        loader: async ({ signal }) => {
          signals.push(signal);

          await new Promise((resolve) => {
            signal.addEventListener("abort", resolve);
          });
        },
      }),
    ]);

    void router.navigate({ to: "/app/one" });
    await vi.waitFor(() => {
      expect(signals).toHaveLength(1);
    });
    await router.navigate({ to: "/app" });

    expect(signals[0]?.aborted).toBe(true);
  });

  it("serves two servers their own routes from one process", () => {
    const first = served(["/one"]);
    const second = served(["/two"]);

    expect(pathsOf(first.router)).toStrictEqual(["/app/one"]);
    expect(pathsOf(second.router)).toStrictEqual(["/app/two"]);
  });

  it("builds a tree no other compilation shares an object with", () => {
    expect(served(["/one"]).tree).not.toBe(served(["/two"]).tree);
  });

  it("serves a second server from the cache where the tree is the same object", () => {
    const { tree: kept } = served(["/one"]);
    const again = createRouter({
      history: createMemoryHistory({ initialEntries: ["/app"] }),
      isServer: true,
      routeTree: kept,
    });

    expect(pathsOf(again)).toStrictEqual(["/app/one"]);
  });

  it("renders the route's own error component where its page fails to load", async () => {
    await quietly(() =>
      hosted(declared({ component: { load: () => Promise.reject(new Error("down")) } })),
    );

    expect(screen.getByTestId("failed").textContent).toBe("acme.one");
  });

  it("keeps the host's chrome rendered where a plugin's page fails to load", async () => {
    await quietly(() =>
      hosted(declared({ component: { load: () => Promise.reject(new Error("down")) } })),
    );

    expect(screen.getByTestId("shell").contains(screen.getByTestId("failed"))).toBe(true);
  });

  it("renders the route's own error component where its page throws while rendering", async () => {
    await quietly(() =>
      hosted(
        declared({
          component: () => {
            throw new Error("the page threw");
          },
        }),
      ),
    );

    expect(screen.getByTestId("failed").textContent).toBe("acme.one");
  });
});
