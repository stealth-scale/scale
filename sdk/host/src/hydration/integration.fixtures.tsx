import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { act } from "@testing-library/react";

import {
  type AnyRouter,
  createMemoryHistory,
  createRouter,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";
import { type FlagReading } from "@stealthscale/sdk-plugin";

import { createHost } from "#host/create-host.ts";
import { optionsOf } from "#host/host.fixtures.ts";
import { type Host } from "#host/options.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { setupHostIntegration } from "#hydration/integration.ts";
import { Calendar } from "#hydration/pages.fixtures.tsx";
import { HostProvider } from "#parts/provider.tsx";
import { treeOf } from "#routes/routed.fixtures.tsx";
import { CALENDAR, flagging } from "#stores/flags.fixtures.ts";

type ServerSsr = NonNullable<AnyRouter["serverSsr"]>;

export type Dehydrate = () => Promise<Readonly<Record<string, unknown>>>;

export type Hydrate = (dehydrated: unknown) => Promise<void>;

export const ON: FlagReading = { origin: "source", value: true };

export interface Server {
  readonly finish: () => void;
  readonly host: Host;
  readonly router: AnyRouter;
}

export interface Hydrated {
  readonly errors: readonly string[];
  readonly text: string;
}

export function hostOf(calendar: boolean): Host {
  return createHost(optionsOf({ flags: flagging({ [CALENDAR]: calendar }, false).source }));
}

function routerFor(host: Host, isServer: boolean): AnyRouter {
  const tree = treeOf(PRODUCT);

  return createRouter({
    ...routerOptions({ data: host.data, host, routes: routeMap(tree) }),
    history: createMemoryHistory({ initialEntries: ["/time-off"] }),
    isServer,
    routeTree: tree,
  });
}

export function serverOf(host: Host, earlier?: Dehydrate): Server {
  const listeners: Array<() => void> = [];
  const router = routerFor(host, true);

  if (earlier !== undefined) router.options.dehydrate = earlier;

  const attached = {
    onRenderFinished: (listener: () => void): void => {
      listeners.push(listener);
    },
  };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture attaches the one member of the server utilities the integration calls
  router.serverSsr = attached as unknown as ServerSsr;
  setupHostIntegration({ host, router });

  return {
    finish: () => {
      for (const listener of listeners) listener();
    },
    host,
    router,
  };
}

export function browserOf(host: Host, earlier?: Hydrate): AnyRouter {
  const router = routerFor(host, false);

  if (earlier !== undefined) router.options.hydrate = earlier;

  setupHostIntegration({ host, router });

  return router;
}

export async function dehydratedBy(server: Server): Promise<unknown> {
  const state: unknown = await server.router.options.dehydrate?.();

  return state;
}

export function keysOf(state: unknown): readonly string[] {
  return typeof state === "object" && state !== null ? Object.keys(state) : [];
}

export async function snapshotIn(state: unknown): Promise<unknown> {
  const snapshot: unknown =
    typeof state === "object" && state !== null && "host" in state ? await state.host : undefined;

  return snapshot;
}

export async function hydrateBy(router: AnyRouter, state: unknown): Promise<void> {
  await router.options.hydrate?.(state);
}

export async function roundTrip(hydrates: boolean): Promise<Hydrated> {
  const server = serverOf(hostOf(true));

  await server.host.ready();

  const state = await dehydratedBy(server);
  const html = renderToString(
    <HostProvider host={server.host} router={server.router}>
      <Calendar />
    </HostProvider>,
  );

  server.finish();

  const browser = hostOf(false);
  const router = browserOf(browser);
  const container = document.createElement("div");
  const errors: string[] = [];

  if (hydrates) await hydrateBy(router, state);

  container.innerHTML = html;
  document.body.append(container);

  const root = await act(async () => {
    const hydrating = hydrateRoot(
      container,
      <HostProvider host={browser} router={router}>
        <Calendar />
      </HostProvider>,
      {
        onRecoverableError: (error) => {
          errors.push(error instanceof Error ? error.message : String(error));
        },
      },
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    return hydrating;
  });
  const text = container.textContent;

  act(() => {
    root.unmount();
  });
  container.remove();

  return { errors, text };
}

export function readingIn(snapshot: unknown, id: string): unknown {
  const flags: unknown =
    typeof snapshot === "object" && snapshot !== null && "flags" in snapshot ? snapshot.flags : [];
  const entries: readonly unknown[] = Array.isArray(flags) ? flags : [];

  return entries.find(
    (entry): entry is readonly [string, unknown] => Array.isArray(entry) && entry[0] === id,
  )?.[1];
}
