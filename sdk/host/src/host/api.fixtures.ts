import { vi } from "vitest";

import { type QueryClient } from "@stealthscale/provider-data";
import { createTestDataClient } from "@stealthscale/provider-data/testing";
import {
  type AccessSource,
  type HostApi,
  type PermissionReference,
  type Session,
} from "@stealthscale/sdk-core";
import { type EventBus, type HostReport } from "@stealthscale/sdk-plugin";

import { hostApiOf } from "#host/api.ts";
import { busOf, type Connected, connectionOf } from "#host/host.fixtures.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { sampledFrom } from "#host/transport.ts";
import { createAccessStore, type HostAccessStore } from "#stores/access.ts";
import { createFlagStore } from "#stores/flags.ts";
import { ADA, type Switchable, switchable } from "#stores/session.fixtures.ts";
import { createSessionStore } from "#stores/session.ts";

export const UNDECLARED: PermissionReference<"payroll/run.approve"> = {
  id: "payroll/run.approve",
  kind: "permission",
};

export const ADA_AT_GLOBEX: Session = { ...ADA, tenantId: "globex" };

export interface ApiCase {
  readonly access: HostAccessStore;
  readonly bus: EventBus;
  readonly connection: Connected;
  readonly data: QueryClient;
  readonly hostOf: (pluginId: string) => HostApi;
  readonly source: Switchable;
}

export interface ApiCaseOptions {
  readonly access?: AccessSource;
  readonly connected?: boolean;
  readonly session?: Session;
}

export function apiCase(options: ApiCaseOptions = {}): ApiCase {
  const report = vi.fn<(entry: HostReport) => void>();
  const source = switchable(options.session ?? ADA);
  const session = createSessionStore({ product: PRODUCT, report, source });
  const access = createAccessStore({ product: PRODUCT, report, source: options.access });
  const flags = createFlagStore({ product: PRODUCT, report });
  const bus = busOf();
  const connection = connectionOf(["time-off/overview", "time-off/request"]);
  const data = createTestDataClient(sampledFrom(PRODUCT));
  const hostOf = hostApiOf({
    connection: () => (options.connected === false ? undefined : connection),
    data,
    events: bus,
    product: PRODUCT,
    stores: { access, flags, session },
    toaster: { create: () => "1", dismiss: vi.fn<(id?: string) => void>() },
  });

  return { access, bus, connection, data, hostOf, source };
}
