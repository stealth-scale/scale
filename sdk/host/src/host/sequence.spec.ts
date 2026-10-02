import { describe, expect, it } from "vitest";

import { operationKey } from "@stealthscale/provider-data";

import { received } from "#host/host.fixtures.ts";
import { OPEN, REQUEST } from "#host/product.fixtures.ts";
import { following } from "#host/sequence.fixtures.ts";
import { settled } from "#stores/access.fixtures.ts";
import { ADA, GRACE } from "#stores/session.fixtures.ts";

describe("followSession", () => {
  it("emits the session as host/sessionChanged at once", () => {
    const { bus } = following();

    expect(received(bus, "host/sessionChanged")).toStrictEqual([ADA]);
  });

  it("emits the new session after a change", () => {
    const { bus, source } = following();
    const sessions = received(bus, "host/sessionChanged");

    source.change(GRACE);

    expect(sessions).toStrictEqual([ADA, GRACE]);
  });

  it("resets the data client on a change of subject", async () => {
    const { data, source } = following();

    data.setQueryData(operationKey(REQUEST, { id: "7" }), OPEN);
    source.change(GRACE);
    await settled();

    expect(data.getQueryCache().getAll()).toStrictEqual([]);
  });

  it("clears the access store on a change of subject", () => {
    const { clear, source } = following();

    source.change(GRACE);

    expect(clear).toHaveBeenCalledExactlyOnceWith();
  });

  it("keeps the data on a change that keeps the subject", async () => {
    const { clear, data, source } = following();

    data.setQueryData(operationKey(REQUEST, { id: "7" }), OPEN);
    source.change({ ...ADA, displayName: "Ada Lovelace" });
    await settled();

    expect(data.getQueryCache().getAll()).toHaveLength(1);
    expect(clear).not.toHaveBeenCalled();
  });

  it("identifies each session to the flag source", () => {
    const { identify, source } = following();

    source.change(GRACE);

    expect(identify.mock.calls).toStrictEqual([[ADA], [GRACE]]);
  });

  it("returns the identification of the first session", () => {
    const { identify, sequence } = following();

    expect(sequence.identified).toBe(identify.mock.results[0]?.value);
  });

  it("stops following the session", () => {
    const { bus, identify, sequence, source } = following();
    const sessions = received(bus, "host/sessionChanged");

    sequence.stop();
    source.change(GRACE);

    expect(sessions).toStrictEqual([ADA]);
    expect(identify.mock.calls).toStrictEqual([[ADA]]);
  });
});
