import { type FunctionComponent, type ReactNode } from "react";

import { act, render, type RenderResult } from "@testing-library/react";
import { getI18n } from "react-i18next";
import { type Mock, vi } from "vitest";

import {
  type AnyRoute,
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  routeMap,
  routerOptions,
  RouterProvider,
} from "@stealthscale/provider-router";
import {
  defineContract,
  definePlugin,
  extension,
  hostContract,
  installed,
  type Product,
} from "@stealthscale/sdk-core";
import { type HostRuntime } from "@stealthscale/sdk-plugin";

import { worded } from "#commands/commands.fixtures.ts";
import { createHost } from "#host/create-host.ts";
import { optionsOf, withCode } from "#host/host.fixtures.ts";
import { type Host, type HostOptions } from "#host/options.ts";
import { billing, lazy, payroll, productOf, timeOff, total } from "#host/product.fixtures.ts";
import { Banner, Dialogs, Frame, Notice, Socket, Titled } from "#parts/frames.fixtures.tsx";
import { HostNotFound } from "#parts/not-found.tsx";
import { HostProvider } from "#parts/provider.tsx";
import { createHostRoutes } from "#routes/create-routes.ts";
import { Overview } from "#routes/pages.fixtures.tsx";
import { failInvoicesOnce } from "#routes/routes.fixtures.ts";

export const shellContract = defineContract("shell", () => ({
  extensions: {
    banner: extension({ position: "before", target: hostContract.slots.layout }),
    dialogs: extension({ position: "after", target: hostContract.slots.overlay }),
    notice: extension({ position: "before", target: hostContract.slots.content }),
    socket: extension({ position: "after", target: hostContract.slots.root }),
  },
  version: "1.0.0",
}));

export const shell = definePlugin(shellContract, {
  extensions: {
    banner: { component: lazy({ Banner }) },
    dialogs: { component: lazy({ Dialogs }) },
    notice: { component: lazy({ Notice }) },
    socket: { component: lazy({ Socket }) },
  },
});

export const SHELLED: Product = productOf([
  installed(timeOff),
  installed(billing),
  installed(payroll),
  installed(shell),
]);

export const TITLED: Product = withCode(SHELLED, "billing", {
  extensions: { total: { component: lazy({ total }) } },
  routes: { invoices: lazy({ Titled }) },
});

export const OVERVIEWED: Product = withCode(SHELLED, "billing", {
  extensions: { total: { component: lazy({ total }) } },
  routes: { invoices: lazy({ Overview }) },
});

export interface Framed {
  readonly host: Host;
  readonly router: AnyRouter;
  readonly view: RenderResult;
}

export interface Loaded {
  readonly host: Host;
  readonly router: AnyRouter;
}

export interface FramedOptions {
  readonly at: string;
  readonly children?: ((router: AnyRouter) => ReactNode) | undefined;
  readonly frame?: FunctionComponent | undefined;
  readonly host?: Partial<HostOptions> | undefined;
  readonly prepare?: ((host: Host) => void) | undefined;
}

export interface Reporting extends Pick<HostRuntime, "product" | "report"> {
  readonly report: Mock<HostRuntime["report"]>;
}

export function reporting(): Reporting {
  return { product: SHELLED, report: vi.fn<HostRuntime["report"]>() };
}

export function named(): void {
  worded();
  getI18n().addResourceBundle("en", "people", { product: { name: "People" } }, true, true);
}

export function frameTreeOf(product: Product, frame: FunctionComponent = Frame): AnyRoute {
  const root = createRootRoute({ component: frame, notFoundComponent: HostNotFound });

  return root.addChildren([...createHostRoutes(product)(root)]);
}

export function hostRouterOf(
  host: Host,
  product: Product,
  at: string,
  frame?: FunctionComponent,
): AnyRouter {
  const tree = frameTreeOf(product, frame);

  return createRouter({
    ...routerOptions({ data: host.data, host, routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: [at] }),
    routeTree: tree,
  });
}

export function routedAt(at: string, stated: Partial<HostOptions> = {}): Loaded {
  const host = createHost(optionsOf({ product: SHELLED, ...stated }));

  return { host, router: hostRouterOf(host, stated.product ?? SHELLED, at) };
}

export async function loadedAt(at: string, stated: Partial<HostOptions> = {}): Promise<Loaded> {
  const routed = routedAt(at, stated);

  await routed.router.load();

  return routed;
}

export async function painted(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

export function quarantined(host: Host): void {
  failInvoicesOnce(host);
  failInvoicesOnce(host);
  failInvoicesOnce(host);
}

export async function changed(run: () => void): Promise<void> {
  await act(async () => {
    run();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

export async function waited(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  });
}

export async function framed(options: FramedOptions): Promise<Framed> {
  const host = createHost(optionsOf({ product: SHELLED, ...options.host }));
  const router = hostRouterOf(host, options.host?.product ?? SHELLED, options.at, options.frame);
  const children =
    options.children ?? ((given: AnyRouter): ReactNode => <RouterProvider router={given} />);

  options.prepare?.(host);
  await router.load();

  const view = await act(async () => {
    const rendered = render(
      <HostProvider host={host} router={router}>
        {children(router)}
      </HostProvider>,
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    return rendered;
  });

  return { host, router, view };
}
