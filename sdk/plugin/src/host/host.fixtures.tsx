import { type ReactNode } from "react";

import { render, type RenderResult } from "@testing-library/react";

import {
  type AccessCheck,
  type KnownDecision,
  type Product,
  type ResourceRef,
  type Session,
  type SlotPlacement,
  type ToastOptions,
} from "@stealthscale/sdk-core";
import { memoryStore } from "@stealthscale/settings";

import { PRODUCT } from "#host/product.fixtures.ts";
import { type HostReport, type RenderTarget } from "#host/report.ts";
import { HostContext, type HostRuntime } from "#host/runtime.ts";
import {
  type AccessState,
  type FlagReading,
  type FlagsState,
  type MountedSlot,
  type PageContribution,
  type PluginAvailability,
  type Quarantined,
  type SessionState,
  type Store,
} from "#host/stores.ts";
import { PluginProvider } from "#scope/provider.tsx";

export interface Settable<T> extends Store<T> {
  readonly set: (value: T) => void;
}

export function storeOf<T>(initial: T): Settable<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      value = next;

      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function sessionStateOf(session: Session): SessionState {
  return {
    entitlements: new Set(session.entitlements),
    permissions: new Set(session.permissions),
    session,
  };
}

export const ADA: Session = {
  authenticated: true,
  displayName: "Ada",
  entitlements: ["time-off/module"],
  permissions: ["time-off/request.approve", "time-off/request.read"],
  roles: [],
  tenantId: "acme",
  userId: "ada",
};

export interface Recorded {
  readonly emitted: Array<readonly [string | undefined, string, unknown]>;
  readonly failed: Array<readonly [RenderTarget, unknown]>;
  readonly forgotten: Array<ResourceRef | undefined>;
  readonly primed: KnownDecision[];
  readonly ran: Array<readonly [string, unknown]>;
  readonly rendered: RenderTarget[];
  readonly reported: HostReport[];
  readonly requested: AccessCheck[];
  readonly toasts: ToastOptions[];
}

export interface FixtureHost {
  readonly access: Settable<AccessState>;
  readonly availability: Settable<Readonly<Record<string, PluginAvailability>>>;
  readonly flags: Settable<FlagsState>;
  readonly mounted: Settable<ReadonlyMap<string, readonly MountedSlot[]>>;
  readonly pages: Settable<ReadonlyMap<string, readonly PageContribution[]>>;
  readonly placements: Settable<Readonly<Record<string, SlotPlacement>>>;
  readonly quarantine: Settable<ReadonlyMap<RenderTarget, Quarantined>>;
  readonly recorded: Recorded;
  readonly reports: Settable<readonly HostReport[]>;
  readonly runtime: HostRuntime;
  readonly session: Settable<SessionState>;
}

export interface FixtureOptions {
  readonly product?: Product | undefined;
  readonly products?: Readonly<Record<string, boolean | string>> | undefined;
  readonly session?: Session | undefined;
  readonly source?: boolean | undefined;
}

function recorded(): Recorded {
  return {
    emitted: [],
    failed: [],
    forgotten: [],
    primed: [],
    ran: [],
    rendered: [],
    reported: [],
    requested: [],
    toasts: [],
  };
}

function readingOf(
  product: Product,
  values: Readonly<Record<string, boolean | string>>,
  id: string,
): FlagReading | undefined {
  const declared = product.flags.find((one) => one.id === id);

  if (declared === undefined) return undefined;

  const stated = values[id];

  return stated === undefined
    ? { origin: "contract", value: declared.default }
    : { origin: "source", value: stated };
}

function without<K, V>(map: ReadonlyMap<K, V>, key: K): ReadonlyMap<K, V> {
  const next = new Map(map);

  next.delete(key);

  return next;
}

function fixtureBus(record: Recorded): HostRuntime["events"] {
  const handlers = new Map<string, Set<(payload: unknown) => void>>();

  return {
    emit: (by, eventId, payload) => {
      record.emitted.push([by, eventId, payload]);

      for (const handler of handlers.get(eventId) ?? []) handler(payload);
    },
    subscribe: (_by, eventId, handler) => {
      const subscribed = handlers.get(eventId) ?? new Set<(payload: unknown) => void>();

      subscribed.add(handler);
      handlers.set(eventId, subscribed);

      return () => {
        subscribed.delete(handler);
      };
    },
  };
}

export function fixtureHost(options: FixtureOptions = {}): FixtureHost {
  const product = options.product ?? PRODUCT;
  const record = recorded();
  const session = storeOf(sessionStateOf(options.session ?? ADA));
  const flags = storeOf<FlagsState>({ overrides: {}, readings: new Map() });
  const availability = storeOf<Readonly<Record<string, PluginAvailability>>>(
    Object.fromEntries(product.plugins.map(({ id }) => [id, { on: true }])),
  );
  const access = storeOf<AccessState>({ decisions: new Map(), source: options.source ?? true });
  const placements = storeOf<Readonly<Record<string, SlotPlacement>>>({});
  const quarantine = storeOf<ReadonlyMap<RenderTarget, Quarantined>>(new Map());
  const mounted = storeOf<ReadonlyMap<string, readonly MountedSlot[]>>(new Map());
  const pages = storeOf<ReadonlyMap<string, readonly PageContribution[]>>(new Map());
  const reports = storeOf<readonly HostReport[]>([]);

  const runtime: HostRuntime = {
    events: fixtureBus(record),
    product,
    report: (entry) => {
      record.reported.push(entry);
    },
    run: (commandId, args) => {
      record.ran.push([commandId, args]);

      return Promise.resolve(`ran ${commandId}`);
    },
    settings: memoryStore(),
    stores: {
      access: {
        ...access,
        forget: (resource) => {
          record.forgotten.push(resource);
        },
        prime: (decisions) => {
          record.primed.push(...decisions);
        },
        request: (check) => {
          record.requested.push(check);
        },
      },
      availability,
      flags: {
        ...flags,
        override: (id, value) => {
          const { [id]: _dropped, ...kept } = flags.get().overrides;

          flags.set({
            ...flags.get(),
            overrides: value === undefined ? kept : { ...kept, [id]: value },
          });
        },
        read: (id) => {
          const { overrides, readings } = flags.get();
          const overridden = overrides[id];

          if (overridden !== undefined) return overridden;

          const reading = readings.get(id) ?? readingOf(product, options.products ?? {}, id);

          return reading?.value;
        },
      },
      mounted: {
        ...mounted,
        mount: (slotId, slot) => {
          mounted.set(
            new Map([...mounted.get(), [slotId, [...(mounted.get().get(slotId) ?? []), slot]]]),
          );

          return () => {
            const left = (mounted.get().get(slotId) ?? []).filter((one) => one !== slot);

            mounted.set(new Map([...mounted.get(), [slotId, left]]));
          };
        },
      },
      pages: {
        ...pages,
        fill: (key, content) => {
          pages.set(
            new Map(
              [...pages.get()].map(([slotId, placed]) => [
                slotId,
                placed.map((one) => (one.key === key ? { ...one, content } : one)),
              ]),
            ),
          );
        },
        place: (slotId, key, order) => {
          const placed = pages.get().get(slotId) ?? [];

          pages.set(
            new Map([...pages.get(), [slotId, [...placed, { content: null, key, order }]]]),
          );

          return () => {
            const left = (pages.get().get(slotId) ?? []).filter((one) => one.key !== key);

            pages.set(new Map([...pages.get(), [slotId, left]]));
          };
        },
      },
      placements: {
        ...placements,
        reset: () => {
          placements.set({});
        },
        update: (change) => {
          placements.set({ ...placements.get(), ...change });
        },
      },
      quarantine: {
        ...quarantine,
        failed: (target, error) => {
          record.failed.push([target, error]);
        },
        rendered: (target) => {
          record.rendered.push(target);
        },
        retry: (target) => {
          quarantine.set(without(quarantine.get(), target));
        },
      },
      reports,
      session,
    },
    toaster: {
      create: (toast) => {
        record.toasts.push(toast);

        return String(record.toasts.length);
      },
      dismiss: () => {},
    },
  };

  return {
    access,
    availability,
    flags,
    mounted,
    pages,
    placements,
    quarantine,
    recorded: record,
    reports,
    runtime,
    session,
  };
}

export function hosted(
  ui: ReactNode,
  host: FixtureHost = fixtureHost(),
  pluginId?: string,
): RenderResult {
  return render(
    <HostContext value={host.runtime}>
      {pluginId === undefined ? ui : <PluginProvider pluginId={pluginId}>{ui}</PluginProvider>}
    </HostContext>,
  );
}

export function wrapperOf(
  host: FixtureHost,
  pluginId?: string,
): (given: { readonly children?: ReactNode }) => ReactNode {
  return function Hosted({ children }) {
    return (
      <HostContext value={host.runtime}>
        {pluginId === undefined ? (
          children
        ) : (
          <PluginProvider pluginId={pluginId}>{children}</PluginProvider>
        )}
      </HostContext>
    );
  };
}
