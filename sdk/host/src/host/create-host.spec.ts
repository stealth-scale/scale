import { describe, expect, it, vi } from "vitest";

import { operationQuery } from "@stealthscale/provider-data";

import { eagerLoad, hanging, sourcesOf } from "#host/create-host.fixtures.ts";
import { createHost } from "#host/create-host.ts";
import { isPending, optionsOf, received, withoutManifest } from "#host/host.fixtures.ts";
import { internalsOf } from "#host/internals.ts";
import { OPEN, PRODUCT, REQUEST } from "#host/product.fixtures.ts";
import { settled } from "#stores/access.fixtures.ts";
import { ADA, switchable } from "#stores/session.fixtures.ts";

describe("createHost", () => {
  it("throws where a manifest lacks a declared name's code", () => {
    expect(() => createHost(optionsOf({ product: withoutManifest(PRODUCT, "billing") }))).toThrow(
      "No manifest maps the route billing/invoices to code.",
    );
  });

  it("emits the session as host/sessionChanged", () => {
    const host = createHost(optionsOf());

    expect(received(internalsOf(host).runtime.events, "host/sessionChanged")).toStrictEqual([ADA]);
  });

  it("emits host/pluginChanged when a switch turns a plugin off", () => {
    const host = createHost(optionsOf());
    const changes = received(internalsOf(host).runtime.events, "host/pluginChanged");

    internalsOf(host).switches.set("payroll", false);

    expect(changes).toStrictEqual([{ on: false, pluginId: "payroll", reason: "off" }]);
  });

  it("keeps every entry it reports in its reports store", () => {
    const source = switchable(ADA);
    const host = createHost(optionsOf({ session: source }));
    const failure = new Error("expired");

    source.fail(failure);

    expect(host.stores.reports.get()).toStrictEqual([{ error: failure, kind: "session-failed" }]);
  });

  it("writes its reports to the console where the product states no receiver", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const source = switchable(ADA);
    const failure = new Error("expired");

    createHost({ ...optionsOf({ session: source }), report: undefined });
    source.fail(failure);

    expect(error.mock.lastCall).toStrictEqual([
      "[host] session-failed",
      { error: failure, kind: "session-failed" },
    ]);
  });

  it("serves the declared samples where the product states no transport", async () => {
    const host = createHost(optionsOf());

    await expect(host.data.query(operationQuery(REQUEST, { id: "7" }))).resolves.toStrictEqual(
      OPEN,
    );
  });

  it("imports the eager plugins' modules as it is created", () => {
    const { load, product } = eagerLoad();

    createHost(optionsOf({ product }));

    expect(load).toHaveBeenCalledTimes(2);
  });

  it("measures the first import of an eager plugin", async () => {
    const { product } = eagerLoad();

    performance.clearMeasures();
    await createHost(optionsOf({ product })).ready();

    expect(performance.getEntriesByName("stealth:load:time-off", "measure")).toHaveLength(1);
  });

  it("is ready once the flag source identified the session", async () => {
    const { flags } = sourcesOf();
    const ready = createHost(optionsOf({ flags: flags.source })).ready();

    await expect(isPending(ready)).resolves.toBe(true);

    flags.finish();

    await expect(ready).resolves.toBeUndefined();
  });

  it("is ready once the flag timeout passes", async () => {
    vi.useFakeTimers();

    try {
      const { flags } = sourcesOf();
      const ready = createHost(optionsOf({ flags: flags.source, flagsTimeout: 50 })).ready();

      await vi.advanceTimersByTimeAsync(50);

      await expect(ready).resolves.toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns one promise from every call of ready", () => {
    const host = createHost(optionsOf());

    expect(host.ready()).toBe(host.ready());
  });

  it("lifts a quarantine on retry", () => {
    const host = createHost(optionsOf({ quarantineAfter: 1 }));

    host.stores.quarantine.failed("route:time-off/overview", new Error("broken"));
    host.retry("route:time-off/overview");

    expect(host.stores.quarantine.get().size).toBe(0);
  });

  it("stops listening to its sources once disposed", () => {
    const { access, flags, session } = sourcesOf();
    const host = createHost(optionsOf({ access: access.source, flags: flags.source, session }));

    host.dispose();

    expect([session.listeners(), flags.listeners(), access.listeners()]).toStrictEqual([0, 0, 0]);
  });

  it("cancels the data client's fetches once disposed", async () => {
    const { signals, transport } = hanging();
    const host = createHost(optionsOf({ data: { transport } }));

    void host.data.query(operationQuery(REQUEST, { id: "7" })).catch(() => null);
    await settled();
    host.dispose();

    expect(signals.map((signal) => signal.aborted)).toStrictEqual([true]);
  });
});
