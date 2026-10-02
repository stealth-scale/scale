import { type FunctionComponent } from "react";

import { act, render, type RenderResult } from "@testing-library/react";

import {
  type AnyRoute,
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  Outlet,
  routeMap,
  routerOptions,
  RouterProvider,
} from "@stealthscale/provider-router";
import { type Product } from "@stealthscale/sdk-core";
import { HostContext } from "@stealthscale/sdk-plugin";

import { createHost } from "#host/create-host.ts";
import { optionsOf } from "#host/host.fixtures.ts";
import { internalsOf } from "#host/internals.ts";
import { type Host, type HostOptions } from "#host/options.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { createHostRoutes } from "#routes/create-routes.ts";
import { NotFound } from "#routes/pages.fixtures.tsx";

export interface Routed {
  readonly host: Host;
  readonly router: AnyRouter;
  readonly view: RenderResult;
}

export interface RoutedOptions {
  readonly at: string;
  readonly host?: Partial<HostOptions> | undefined;
  readonly prepare?: ((host: Host) => void) | undefined;
  readonly root?: FunctionComponent | undefined;
  readonly routes?: Product | undefined;
  readonly strict?: boolean | undefined;
}

export function treeOf(product: Product, component: FunctionComponent = Outlet): AnyRoute {
  const root = createRootRoute({ component, notFoundComponent: NotFound });

  return root.addChildren([...createHostRoutes(product)(root)]);
}

export function routerOf(
  host: Host,
  product: Product,
  at: string,
  component?: FunctionComponent,
): AnyRouter {
  const tree = treeOf(product, component);

  return createRouter({
    ...routerOptions({ data: host.data, host, routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });
}

export function contextOf(stated: Partial<HostOptions> = {}): HostRouterContext {
  const host = createHost(optionsOf(stated));
  const tree = treeOf(stated.product ?? PRODUCT);

  createRouter({ routeTree: tree });

  return { data: host.data, host, routes: routeMap(tree) };
}

export async function routed(options: RoutedOptions): Promise<Routed> {
  const host = createHost(optionsOf(options.host));
  const product = options.routes ?? options.host?.product ?? PRODUCT;
  const router = routerOf(host, product, options.at, options.root);

  options.prepare?.(host);
  await router.load();

  const view = await act(async () => {
    const rendered = render(
      <HostContext value={internalsOf(host).runtime}>
        <RouterProvider router={router} />
      </HostContext>,
      { reactStrictMode: options.strict === true },
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    return rendered;
  });

  return { host, router, view };
}
