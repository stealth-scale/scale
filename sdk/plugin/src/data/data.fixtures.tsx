import { type ReactNode, Suspense } from "react";

import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { vi } from "vitest";

import {
  DataProvider,
  type QueryClient,
  type RecordPatch,
  type Transport,
} from "@stealthscale/provider-data";
import { createTestDataClient, sampledTransport } from "@stealthscale/provider-data/testing";
import {
  type MutationReference,
  type QueryReference,
  type ResolvedChanges,
} from "@stealthscale/sdk-core";

import { fixtureHost, type FixtureHost } from "#host/host.fixtures.tsx";
import { type Approval, APPROVE, OPEN, REQUEST, type Request } from "#host/product.fixtures.ts";
import { HostContext } from "#host/runtime.ts";

export const UNDECLARED_QUERY: QueryReference<"payroll/runs"> = {
  id: "payroll/runs",
  kind: "query",
};

export const UNDECLARED_MUTATION: MutationReference<"payroll/close"> = {
  id: "payroll/close",
  kind: "mutation",
};

export const REQUEST_KEY = ["operation", REQUEST.id, { id: "7" }] as const;

export const APPROVED: Request = { ...OPEN, status: "approved" };

export const CREATED: ResolvedChanges = { action: "created", type: "time-off/request" };

export const UPDATED: ResolvedChanges = { action: "updated", id: "id", type: "time-off/request" };

export interface Served {
  readonly client: QueryClient;
  readonly host: FixtureHost;
  readonly request: () => Request;
  readonly runs: string[];
}

export function served(transport: (base: Transport) => Transport = (base) => base): Served {
  const runs: string[] = [];
  const request = vi.fn<() => Request>(() => OPEN);
  const base = sampledTransport({
    [APPROVE.id]: { data: APPROVED },
    [REQUEST.id]: { respond: request },
  });
  const chosen = transport(base);

  return {
    client: createTestDataClient({
      ...chosen,
      run: (operation, variables, options) => {
        runs.push(operation.id);

        return chosen.run(operation, variables, options);
      },
    }),
    host: fixtureHost(),
    request,
    runs,
  };
}

export function pending(base: Transport): Transport {
  return {
    ...base,
    run: (operation, variables, options) =>
      operation.kind === "mutation"
        ? new Promise<never>(() => {})
        : base.run(operation, variables, options),
  };
}

export function approving({ requestId }: Approval): readonly RecordPatch[] {
  return [
    {
      apply: (record) => ({ ...record, status: "approved" }),
      id: requestId,
      type: "time-off/request",
    },
  ];
}

export function tick(): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export function hookIn<Result>(
  hook: () => Result,
  { client, host }: Served,
): Promise<RenderHookResult<Result, unknown>> {
  return act(async () => {
    const rendered = renderHook(hook, {
      wrapper: ({ children }: { readonly children?: ReactNode }) => (
        <HostContext value={host.runtime}>
          <DataProvider client={client}>
            <Suspense fallback={null}>{children}</Suspense>
          </DataProvider>
        </HostContext>
      ),
    });

    await tick();

    return rendered;
  });
}
