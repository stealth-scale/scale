import { type Mock, vi } from "vitest";

import {
  type ChangeBatch,
  defineSubscription,
  type NoVariables,
  type Operation,
  type Transport,
} from "@stealthscale/provider-data";
import { sampledTransport } from "@stealthscale/provider-data/testing";
import {
  constantSession,
  type HostApi,
  type PluginCode,
  type Product,
  type ResolvedQuery,
} from "@stealthscale/sdk-core";
import { type EventBus, type HostReport } from "@stealthscale/sdk-plugin";
import { memoryStore } from "@stealthscale/settings";

import { createEventBus } from "#bus/bus.ts";
import { type Connection } from "#host/internals.ts";
import { type HostOptions } from "#host/options.ts";
import { OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { CALENDAR, KEY } from "#stores/flags.fixtures.ts";
import { ADA } from "#stores/session.fixtures.ts";

export const CHANGES: Operation<ChangeBatch, NoVariables, "subscription"> =
  defineSubscription<ChangeBatch>("people~1~changes");

export const APPROVED: ChangeBatch = {
  changes: [{ action: "updated", id: "7", type: "time-off/request" }],
};

export const APPROVABLE = { ...OPEN, approvable: true };

export interface Connected extends Connection {
  readonly invalidate: Mock<() => void>;
  readonly navigate: Mock<HostApi["navigate"]>;
  readonly translate: Mock<Connection["translate"]>;
}

export function connectionOf(matched: readonly string[] = []): Connected {
  return {
    invalidate: vi.fn<() => void>(),
    matched: () => matched,
    navigate: vi.fn<HostApi["navigate"]>(() => Promise.resolve()),
    translate: vi.fn<Connection["translate"]>((namespace, key) => `${namespace}:${key}`),
  };
}

export function optionsOf(stated: Partial<HostOptions> = {}): HostOptions {
  return {
    product: PRODUCT,
    report: vi.fn<(entry: HostReport) => void>(),
    session: constantSession(ADA),
    store: memoryStore(),
    ...stated,
  };
}

export function withCode(product: Product, pluginId: string, code: PluginCode): Product {
  const manifest = product.manifests[pluginId];

  if (manifest === undefined) throw new Error(`The fixture installs no plugin ${pluginId}.`);

  return { ...product, manifests: { ...product.manifests, [pluginId]: { ...manifest, code } } };
}

export function withComponentSections(product: Product): Product {
  return {
    ...product,
    settings: {
      ...product.settings,
      sections: product.settings.sections.map((section) => ({ ...section, component: true })),
    },
  };
}

export function withoutManifest(product: Product, pluginId: string): Product {
  return {
    ...product,
    manifests: Object.fromEntries(
      Object.entries(product.manifests).filter(([id]) => id !== pluginId),
    ),
  };
}

export function withQuery(product: Product, query: Partial<ResolvedQuery>): Product {
  return {
    ...product,
    queries: product.queries.map((declared) => ({ ...declared, ...query })),
  };
}

export function serving(data: unknown): Transport {
  return sampledTransport({ [REQUEST.id]: { data } });
}

export function streaming(events: readonly unknown[]): Transport {
  return {
    run: () => Promise.reject(new Error("The fixture runs no operation.")),
    subscribe: (_operation, _variables, next) => {
      for (const event of events) {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture streams the events a case states, typed as the subscription's data
        next(event as never);
      }

      return Promise.resolve();
    },
  };
}

export function busOf(): EventBus {
  return createEventBus({ events: PRODUCT.events, report: vi.fn<(entry: HostReport) => void>() });
}

export function received(bus: EventBus, eventId: string): readonly unknown[] {
  const payloads: unknown[] = [];

  bus.subscribe(undefined, eventId, (payload) => {
    payloads.push(payload);
  });

  return payloads;
}

export function eagerly(product: Product, pluginId: string): Product {
  return {
    ...product,
    plugins: product.plugins.map((plugin) =>
      plugin.id === pluginId ? { ...plugin, eager: true } : plugin,
    ),
  };
}

export async function isPending(promise: Promise<unknown>): Promise<boolean> {
  const marker = Symbol("pending");

  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

  return (await Promise.race([promise, Promise.resolve(marker)])) === marker;
}

export function storedOverride(): () => void {
  window.sessionStorage.setItem(KEY, JSON.stringify({ [CALENDAR]: true }));

  return () => {
    sessionStorage.removeItem(KEY);
  };
}

export function withoutWindow(): void {
  // eslint-disable-next-line unicorn/no-useless-undefined -- a server has no window, and the stub states that as undefined
  vi.stubGlobal("window", undefined);
}

export function refusedStorage(): () => void {
  const own = Object.getOwnPropertyDescriptor(window, "sessionStorage");

  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    get: () => {
      throw new Error("The page refused the storage.");
    },
  });

  return () => {
    if (own === undefined) Reflect.deleteProperty(window, "sessionStorage");
    else Object.defineProperty(window, "sessionStorage", own);
  };
}
