import { describe, expect, it } from "vitest";

import { createHost } from "#host/create-host.ts";
import { connectionOf, optionsOf } from "#host/host.fixtures.ts";
import { connector, internalsOf } from "#host/internals.ts";
import { type Host } from "#host/options.ts";
import { PRODUCT } from "#host/product.fixtures.ts";
import { instrumented } from "#recovery/instrument.ts";

describe("internals", () => {
  it("returns the internals of a host createHost created", () => {
    const host = createHost(optionsOf());

    expect(internalsOf(host).runtime.product).toBe(instrumented(PRODUCT).product);
  });

  it("throws for a host createHost did not create", () => {
    const copy: Host = { ...createHost(optionsOf()) };

    expect(() => internalsOf(copy)).toThrow(
      "The host was not created by createHost, so it has no runtime to provide.",
    );
  });

  it("returns no connection before one connects", () => {
    expect(connector().current()).toBeUndefined();
  });

  it("keeps a connection until it disconnects", () => {
    const kept = connector();
    const connection = connectionOf();
    const disconnect = kept.connect(connection);

    expect(kept.current()).toBe(connection);

    disconnect();

    expect(kept.current()).toBeUndefined();
  });

  it("keeps a later connection when an earlier one disconnects", () => {
    const kept = connector();
    const disconnect = kept.connect(connectionOf());
    const later = connectionOf();

    kept.connect(later);
    disconnect();

    expect(kept.current()).toBe(later);
  });
});
