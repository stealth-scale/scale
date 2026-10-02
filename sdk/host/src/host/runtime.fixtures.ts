import { vi } from "vitest";

import { createTestDataClient } from "@stealthscale/provider-data/testing";
import { type HostApi, type Product, type Toaster } from "@stealthscale/sdk-core";
import { type HostReport, type HostRuntime } from "@stealthscale/sdk-plugin";
import { memoryStore } from "@stealthscale/settings";

import { createEventBus } from "#bus/bus.ts";
import { optionsOf, withCode } from "#host/host.fixtures.ts";
import { type Connection } from "#host/internals.ts";
import { createPage } from "#host/page.ts";
import { lazy, PRODUCT, run, timeOff } from "#host/product.fixtures.ts";
import { createRuntime } from "#host/runtime.ts";
import { createState } from "#host/state.ts";
import { sampledFrom } from "#host/transport.ts";

export function toasterOf(_args: unknown, _needs: unknown, host: HostApi): Toaster {
  return host.toaster;
}

export const ROUTED_PRODUCT: Product = {
  ...PRODUCT,
  commands: PRODUCT.commands.map((command) =>
    command.id === "time-off/request"
      ? { ...command, when: { route: { id: "time-off/overview", kind: "route" } } }
      : command,
  ),
};

export const TOASTING_PRODUCT: Product = withCode(PRODUCT, "time-off", {
  ...timeOff.code,
  commands: {
    approve: { run: lazy({ run }) },
    pick: { run: lazy({ run }) },
    request: { run: lazy({ toasterOf }) },
  },
});

export function runtimeOf(product: Product = PRODUCT, connection?: Connection): HostRuntime {
  const report = vi.fn<(entry: HostReport) => void>();
  const page = createPage({ report });
  const events = createEventBus({ events: product.events, report });
  const state = createState({ events, options: optionsOf({ product }), report });

  return createRuntime({
    connection: () => connection,
    data: createTestDataClient(sampledFrom(product)),
    events,
    product,
    report,
    settings: memoryStore(),
    stores: { ...state.stores, ...page.stores },
  });
}
