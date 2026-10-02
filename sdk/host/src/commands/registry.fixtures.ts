import {
  type CommandRun,
  constantSession,
  type HostApi,
  type LazyCommand,
  type Product,
  type ResolvedCommand,
  type Session,
} from "@stealthscale/sdk-core";
import { type HostStores, type PluginAvailability } from "@stealthscale/sdk-plugin";

import { PRODUCT, timeOff } from "#host/product.fixtures.ts";
import { createFlagStore } from "#stores/flags.ts";
import { ADA } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";
import { type Writable, writable } from "#stores/store.ts";
import { ignored } from "#stores/switches.fixtures.ts";

export interface ConditionStores extends Pick<HostStores, "flags" | "session"> {
  readonly availability: Writable<Readonly<Record<string, PluginAvailability>>>;
}

export function conditionStores(session: Session = ADA): ConditionStores {
  return {
    availability: writable<Readonly<Record<string, PluginAvailability>>>(
      Object.fromEntries(PRODUCT.plugins.map(({ id }) => [id, { on: true }])),
    ),
    flags: createFlagStore({ product: PRODUCT, report: ignored }),
    session: createSessionStore({
      product: PRODUCT,
      report: ignored,
      source: constantSession(session),
    }),
  };
}

export function apiOf(pluginId: string): HostApi {
  return {
    can: () => Promise.resolve(true),
    data: {
      mutate: () => Promise.reject(new Error("The fixture runs no mutation.")),
      query: () => Promise.reject(new Error("The fixture runs no query.")),
    },
    emit: ignored,
    flag: () => {
      throw new Error("The fixture reads no flag.");
    },
    matched: undefined,
    navigate: () => Promise.resolve(),
    pluginId,
    session: ADA,
    t: (key) => key,
    toaster: { create: () => "1", dismiss: ignored },
  };
}

export function moduleOf(call: CommandRun<unknown, unknown, unknown>): LazyCommand {
  return () => Promise.resolve({ call });
}

export function importing(importer: LazyCommand): Pick<Product, "commands" | "manifests"> {
  return {
    commands: PRODUCT.commands,
    manifests: {
      ...PRODUCT.manifests,
      "time-off": {
        ...timeOff,
        code: {
          ...timeOff.code,
          commands: {
            approve: { run: importer },
            pick: { run: importer },
            request: { run: importer },
          },
        },
      },
    },
  };
}

export const ROUTED: ResolvedCommand = {
  id: "time-off/request",
  label: "commands.request",
  needs: {},
  plugin: "time-off",
  returnsResult: false,
  takesArguments: false,
  when: { route: { id: "time-off/overview", kind: "route" } },
};
