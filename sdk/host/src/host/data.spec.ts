import { describe, expect, it, vi } from "vitest";

import { DataError, mutateOperation, operationQuery } from "@stealthscale/provider-data";
import { sampledTransport } from "@stealthscale/provider-data/testing";
import { type KnownDecision } from "@stealthscale/sdk-core";

import { createHostData } from "#host/data.ts";
import {
  APPROVABLE,
  APPROVED,
  busOf,
  connectionOf,
  received,
  serving,
  withQuery,
} from "#host/host.fixtures.ts";
import { APPROVE, OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";

describe("createHostData", () => {
  it("primes the decisions a declared query's data states", async () => {
    const prime = vi.fn<(decisions: readonly KnownDecision[]) => void>();
    const client = createHostData({
      access: { prime },
      connection: () => {},
      data: { transport: serving(APPROVABLE) },
      events: busOf(),
      product: PRODUCT,
      session: { refresh: vi.fn<() => void>() },
    });

    await client.query(operationQuery(REQUEST, { id: "7" }));

    expect(prime.mock.lastCall).toStrictEqual([
      [
        {
          allowed: true,
          permission: "time-off/request.approve",
          resource: { id: "7", type: "time-off/request" },
        },
      ],
    ]);
  });

  it("primes no decision for a member that is not a boolean", async () => {
    const prime = vi.fn<(decisions: readonly KnownDecision[]) => void>();
    const client = createHostData({
      access: { prime },
      connection: () => {},
      data: { transport: serving(OPEN) },
      events: busOf(),
      product: PRODUCT,
      session: { refresh: vi.fn<() => void>() },
    });

    await client.query(operationQuery(REQUEST, { id: "7" }));

    expect(prime).not.toHaveBeenCalled();
  });

  it("primes nothing for a decision whose permission states no resource kind", async () => {
    const prime = vi.fn<(decisions: readonly KnownDecision[]) => void>();
    const client = createHostData({
      access: { prime },
      connection: () => {},
      data: { transport: serving(APPROVABLE) },
      events: busOf(),
      product: withQuery(PRODUCT, {
        decisions: [{ field: "approvable", id: "id", permission: "time-off/request.read" }],
      }),
      session: { refresh: vi.fn<() => void>() },
    });

    await client.query(operationQuery(REQUEST, { id: "7" }));

    expect(prime).not.toHaveBeenCalled();
  });

  it("emits host/recordsChanged with the changes of a declared mutation", async () => {
    const bus = busOf();
    const payloads = received(bus, "host/recordsChanged");
    const client = createHostData({
      access: { prime: vi.fn<(decisions: readonly KnownDecision[]) => void>() },
      connection: () => {},
      events: bus,
      product: PRODUCT,
      session: { refresh: vi.fn<() => void>() },
    });

    await mutateOperation(client, APPROVE, { requestId: "7" });

    expect(payloads).toStrictEqual([APPROVED]);
  });

  it("reads the session again where the gateway refuses the session", async () => {
    const refresh = vi.fn<() => void>();
    const connection = connectionOf();
    const expired = new DataError({
      kind: "unauthenticated",
      message: "expired",
      operation: REQUEST.id,
    });
    const client = createHostData({
      access: { prime: vi.fn<(decisions: readonly KnownDecision[]) => void>() },
      connection: () => connection,
      data: { transport: sampledTransport({ [REQUEST.id]: { error: expired } }) },
      events: busOf(),
      product: PRODUCT,
      session: { refresh },
    });

    await client.query(operationQuery(REQUEST, { id: "7" })).catch(() => null);

    expect(refresh).toHaveBeenCalledExactlyOnceWith();
    expect(connection.invalidate).toHaveBeenCalledExactlyOnceWith();
  });

  it("reads the session again before a router is connected", async () => {
    const refresh = vi.fn<() => void>();
    const expired = new DataError({
      kind: "unauthenticated",
      message: "expired",
      operation: REQUEST.id,
    });
    const client = createHostData({
      access: { prime: vi.fn<(decisions: readonly KnownDecision[]) => void>() },
      connection: () => {},
      data: { transport: sampledTransport({ [REQUEST.id]: { error: expired } }) },
      events: busOf(),
      product: PRODUCT,
      session: { refresh },
    });

    await client.query(operationQuery(REQUEST, { id: "7" })).catch(() => null);

    expect(refresh).toHaveBeenCalledExactlyOnceWith();
  });
});
