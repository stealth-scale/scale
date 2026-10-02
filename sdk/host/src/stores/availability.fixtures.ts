import { type Mock, vi } from "vitest";

import {
  installed,
  type PluginChanged,
  type Requirement,
  type ResolvedPlugin,
  type ResolvedProduct,
  type Session,
} from "@stealthscale/sdk-core";

import {
  billing,
  payroll,
  payrollContract,
  productOf,
  timeOff,
  timeOffContract,
} from "#host/product.fixtures.ts";
import { type AvailabilityStore, createAvailabilityStore } from "#stores/availability.ts";
import { tab } from "#stores/flags.fixtures.ts";
import { createFlagStore, type HostFlagStore } from "#stores/flags.ts";
import { ADA, type Switchable, switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";
import { type Writable, writable } from "#stores/store.ts";
import { ignored } from "#stores/switches.fixtures.ts";
import { type Switches } from "#stores/switches.ts";

export const LICENSED = productOf([
  installed(timeOff),
  installed(billing, { when: { entitlement: timeOffContract.entitlements.module } }),
  installed(payroll),
]);

export const NAMING = productOf([
  installed(timeOff),
  installed(billing, { when: { plugin: payrollContract } }),
  installed(payroll),
]);

export const LOCKED = productOf([
  installed(timeOff),
  installed(billing, { locked: true }),
  installed(payroll),
]);

export function pluginOf(id: string, requires: readonly Requirement[] = []): ResolvedPlugin {
  return {
    config: {},
    eager: false,
    enabled: true,
    id,
    killSwitch: `host/plugin.${id}`,
    locked: false,
    requires,
    version: "1.0.0",
    when: undefined,
  };
}

export function builtOf(plugins: readonly ResolvedPlugin[]): ResolvedProduct {
  return {
    commands: [],
    entitlements: [],
    events: [],
    extensions: [],
    flags: [],
    mutations: [],
    name: "product.name",
    permissions: [],
    plugins,
    productId: "people",
    queries: [],
    resources: [],
    roles: [],
    routes: [],
    settings: { pages: [], sections: [] },
    slots: {},
    version: "2026.10.1",
    warnings: [],
  };
}

export interface Stores {
  readonly availability: AvailabilityStore;
  readonly changed: Mock<(change: PluginChanged) => void>;
  readonly flags: HostFlagStore;
  readonly source: Switchable;
  readonly switches: Writable<Switches>;
}

export function storesOf(
  product: ResolvedProduct,
  switches: Switches = {},
  session: Session = ADA,
): Stores {
  const source = switchable(session);
  const flags = createFlagStore({ overrides: tab().storage, product, report: ignored });
  const changed = vi.fn<(change: PluginChanged) => void>();
  const stored = writable(switches);
  const availability = createAvailabilityStore({
    changed,
    flags,
    product,
    session: createSessionStore({ product, report: ignored, source }),
    switches: stored,
  });

  return { availability, changed, flags, source, switches: stored };
}
