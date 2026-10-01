import { type FunctionComponent, type ReactNode } from "react";

import { render, type RenderResult } from "@testing-library/react";

import { I18nProvider } from "@stealthscale/provider-i18n";
import {
  type AnyRouter,
  compileRoutes,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  Outlet,
  routeMap,
  RouterContextProvider,
  RouterProvider,
} from "@stealthscale/provider-router";

import { type FixtureHost } from "#host/host.fixtures.tsx";
import { PRODUCT } from "#host/product.fixtures.ts";
import { HostContext } from "#host/runtime.ts";
import { CATALOGUES } from "#host/words.fixtures.ts";

export interface Routed {
  readonly router: AnyRouter;
  readonly view: RenderResult;
}

function blank(): null {
  return null;
}

export function routerAt(
  at: string,
  pages: Readonly<Record<string, FunctionComponent>> = {},
  root: FunctionComponent = Outlet,
): AnyRouter {
  const top = createRootRoute({ component: root });
  const routes = compileRoutes(
    PRODUCT.routes.map(({ id, parent, path }) => ({
      component: pages[id] ?? blank,
      id,
      parent,
      path,
    })),
    { parent: top },
  );
  const tree = top.addChildren([...routes]);

  return createRouter({
    context: { routes: routeMap(tree) },
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });
}

export async function routedWrapper(
  host: FixtureHost,
  at = "/time-off/7",
): Promise<(given: { readonly children?: ReactNode }) => ReactNode> {
  const router = routerAt(at);

  await router.load();

  return function Routed({ children }) {
    return (
      <HostContext value={host.runtime}>
        <I18nProvider catalogues={CATALOGUES} locale="en">
          <RouterContextProvider router={router}>{children}</RouterContextProvider>
        </I18nProvider>
      </HostContext>
    );
  };
}

export async function routed(
  host: FixtureHost,
  at: string,
  pages: Readonly<Record<string, FunctionComponent>> = {},
  root: FunctionComponent = Outlet,
): Promise<Routed> {
  const router = routerAt(at, pages, root);

  await router.load();

  const view = render(
    <HostContext value={host.runtime}>
      <I18nProvider catalogues={CATALOGUES} locale="en">
        <RouterProvider router={router} />
      </I18nProvider>
    </HostContext>,
  );

  return { router, view };
}
