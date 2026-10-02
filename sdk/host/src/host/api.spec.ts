import { describe, expect, it } from "vitest";

import { operationQuery } from "@stealthscale/provider-data";

import { ADA_AT_GLOBEX, apiCase, UNDECLARED } from "#host/api.fixtures.ts";
import { received } from "#host/host.fixtures.ts";
import { OPEN, REQUEST, timeOffContract } from "#host/product.fixtures.ts";
import { deciding, settled, SEVEN } from "#stores/access.fixtures.ts";
import { GRACE } from "#stores/session.fixtures.ts";

describe("hostApiOf", () => {
  it("resolves true for a tenant permission the session has", async () => {
    const { hostOf } = apiCase();

    await expect(hostOf("time-off").can(timeOffContract.permissions["request.read"])).resolves.toBe(
      true,
    );
  });

  it("resolves false for a permission no installed plugin declares", async () => {
    const { hostOf } = apiCase();

    await expect(hostOf("time-off").can(UNDECLARED, "7")).resolves.toBe(false);
  });

  it("resolves a scoped permission for the tenant without a resource id", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").can(timeOffContract.permissions["request.approve"]),
    ).resolves.toBe(true);
  });

  it("resolves the decision the store knows on a resource", async () => {
    const { access, hostOf } = apiCase({ access: deciding().source });

    access.prime([{ ...SEVEN, allowed: false }]);

    await expect(
      hostOf("time-off").can(timeOffContract.permissions["request.approve"], "7"),
    ).resolves.toBe(false);
  });

  it("resolves false on a resource where the session lacks the permission", async () => {
    const { hostOf } = apiCase({ access: deciding().source, session: GRACE });

    await expect(
      hostOf("time-off").can(timeOffContract.permissions["request.approve"], "7"),
    ).resolves.toBe(false);
  });

  it("resolves true on a resource without an access source", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").can(timeOffContract.permissions["request.approve"], "7"),
    ).resolves.toBe(true);
  });

  it("asks the access source for a decision on a resource", async () => {
    const decider = deciding();
    const { hostOf } = apiCase({ access: decider.source });
    const decision = hostOf("time-off").can(timeOffContract.permissions["request.approve"], "7");

    await settled();
    decider.resolve([true]);

    await expect(decision).resolves.toBe(true);
    expect(decider.batches).toStrictEqual([[SEVEN]]);
  });

  it("asks again for a check the host dropped on a change of subject", async () => {
    const decider = deciding();
    const { access, hostOf, source } = apiCase({ access: decider.source });
    const decision = hostOf("time-off").can(timeOffContract.permissions["request.approve"], "7");

    await settled();
    access.clear();
    source.change(ADA_AT_GLOBEX);
    await settled();
    decider.resolve([false]);
    decider.resolve([true]);

    await expect(decision).resolves.toBe(true);
    expect(decider.batches).toStrictEqual([[SEVEN], [SEVEN]]);
  });

  it("runs a declared query through the data client", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").data.query(timeOffContract.queries.request, { id: "7" }),
    ).resolves.toStrictEqual(OPEN);
  });

  it("rejects a query no installed plugin declares", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").data.query({ id: "elsewhere/list", kind: "query" }, {}),
    ).rejects.toThrow("No installed plugin declares the query elsewhere/list.");
  });

  it("runs a declared mutation through the data client", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").data.mutate(timeOffContract.mutations.approve, { requestId: "7" }),
    ).resolves.toStrictEqual(OPEN);
  });

  it("invalidates the records a declared mutation changes", async () => {
    const { data, hostOf } = apiCase();
    const options = operationQuery(
      REQUEST,
      { id: "7" },
      { resources: [{ id: "id", type: "time-off/request" }] },
    );

    await data.query(options);
    await hostOf("time-off").data.mutate(timeOffContract.mutations.approve, { requestId: "7" });

    expect(data.getQueryCache().find({ queryKey: options.queryKey })?.state.isInvalidated).toBe(
      true,
    );
  });

  it("rejects a mutation no installed plugin declares", async () => {
    const { hostOf } = apiCase();

    await expect(
      hostOf("time-off").data.mutate({ id: "elsewhere/save", kind: "mutation" }, {}),
    ).rejects.toThrow("No installed plugin declares the mutation elsewhere/save.");
  });

  it("emits an event as the plugin it was built for", () => {
    const { bus, hostOf } = apiCase();
    const payloads = received(bus, "time-off/approved");

    hostOf("time-off").emit(timeOffContract.events.approved, { requestId: "7" });

    expect(payloads).toStrictEqual([{ requestId: "7" }]);
  });

  it("refuses an event another plugin declares", () => {
    const { hostOf } = apiCase();

    expect(() => {
      hostOf("billing").emit(timeOffContract.events.approved, { requestId: "7" });
    }).toThrow("The plugin billing may not emit time-off/approved: only time-off emits it.");
  });

  it("returns a declared flag's value", () => {
    const { hostOf } = apiCase();

    expect(hostOf("time-off").flag(timeOffContract.featureFlags.layout)).toBe("list");
  });

  it("returns the reference's default for a flag no installed plugin declares", () => {
    const { hostOf } = apiCase();

    expect(
      hostOf("time-off").flag({ default: true, id: "elsewhere/beta", kind: "featureFlag" }),
    ).toBe(true);
  });

  it("returns false for an undeclared flag without a default", () => {
    const { hostOf } = apiCase();

    expect(hostOf("time-off").flag({ id: "elsewhere/beta", kind: "featureFlag" })).toBe(false);
  });

  it("returns the deepest matched route", () => {
    const { hostOf } = apiCase();

    expect(hostOf("time-off").matched).toBe("time-off/request");
  });

  it("returns no matched route before a router is connected", () => {
    const { hostOf } = apiCase({ connected: false });

    expect(hostOf("time-off").matched).toBeUndefined();
  });

  it("navigates through the router's connection", async () => {
    const { connection, hostOf } = apiCase();

    await hostOf("time-off").navigate(timeOffContract.routes.request, { params: { id: "7" } });

    expect(connection.navigate.mock.lastCall).toStrictEqual([
      timeOffContract.routes.request,
      { params: { id: "7" } },
    ]);
  });

  it("rejects a navigation before a router is connected", async () => {
    const { hostOf } = apiCase({ connected: false });

    await expect(hostOf("time-off").navigate(timeOffContract.routes.overview)).rejects.toThrow(
      "The host is not connected to a router. HostProvider connects one when it renders.",
    );
  });

  it("translates a key in the plugin's namespace", () => {
    const { hostOf } = apiCase();

    expect(hostOf("time-off").t("commands.approve")).toBe("time-off:commands.approve");
  });

  it("returns the key before the catalogues are connected", () => {
    const { hostOf } = apiCase({ connected: false });

    expect(hostOf("time-off").t("commands.approve")).toBe("commands.approve");
  });

  it("returns the session at the time of the run", () => {
    const { hostOf, source } = apiCase();

    source.change(GRACE);

    expect(hostOf("time-off").session).toBe(GRACE);
  });
});
