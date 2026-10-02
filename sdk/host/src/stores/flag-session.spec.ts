import { describe, expect, it, vi } from "vitest";

import { type HostReport } from "@stealthscale/sdk-plugin";

import { exposuresOf, identityOf } from "#stores/flag-session.ts";
import { flagging, flagIn, LAYOUT, SYNC } from "#stores/flags.fixtures.ts";
import { ADA, GRACE } from "#stores/session.fixtures.ts";

describe("flag-session", () => {
  it("queues flag-exposed the first time the subject is served a variant", () => {
    const queue = vi.fn<(entry: HostReport) => void>();

    exposuresOf(queue).expose(flagIn(LAYOUT), "board");

    expect(queue).toHaveBeenCalledExactlyOnceWith({
      flag: LAYOUT,
      kind: "flag-exposed",
      variant: "board",
    });
  });

  it("queues a variant once for one subject", () => {
    const queue = vi.fn<(entry: HostReport) => void>();
    const exposures = exposuresOf(queue);

    exposures.expose(flagIn(LAYOUT), "board");
    exposures.expose(flagIn(LAYOUT), "board");

    expect(queue).toHaveBeenCalledTimes(1);
  });

  it("queues nothing for a boolean value", () => {
    const queue = vi.fn<(entry: HostReport) => void>();

    exposuresOf(queue).expose(flagIn(SYNC), true);

    expect(queue).not.toHaveBeenCalled();
  });

  it("queues a variant again after a reset to another subject", () => {
    const queue = vi.fn<(entry: HostReport) => void>();
    const exposures = exposuresOf(queue);

    exposures.expose(flagIn(LAYOUT), "board");
    exposures.reset("grace@acme");
    exposures.expose(flagIn(LAYOUT), "board");

    expect(queue).toHaveBeenCalledTimes(2);
  });

  it("keeps the variants served after a reset to the same subject", () => {
    const queue = vi.fn<(entry: HostReport) => void>();
    const exposures = exposuresOf(queue);

    exposures.reset("ada@acme");
    exposures.expose(flagIn(LAYOUT), "board");
    exposures.reset("ada@acme");
    exposures.expose(flagIn(LAYOUT), "board");

    expect(queue).toHaveBeenCalledTimes(1);
  });

  it("records a variant a server served the same subject without a report", () => {
    const queue = vi.fn<(entry: HostReport) => void>();
    const exposures = exposuresOf(queue);

    exposures.reset("ada@acme");
    exposures.serve("ada@acme", flagIn(LAYOUT), "board");
    exposures.expose(flagIn(LAYOUT), "board");

    expect(queue).not.toHaveBeenCalled();
  });

  it("ignores a variant a server served another subject", () => {
    const queue = vi.fn<(entry: HostReport) => void>();
    const exposures = exposuresOf(queue);

    exposures.reset("ada@acme");
    exposures.serve("grace@acme", flagIn(LAYOUT), "board");
    exposures.expose(flagIn(LAYOUT), "board");

    expect(queue).toHaveBeenCalledTimes(1);
  });

  it("trusts a source without identify at once", () => {
    const { source } = flagging({}, false);

    expect(identityOf(source, vi.fn<(error: unknown) => void>()).trusted()).toBe(source);
  });

  it("resolves true at once for a source without identify", async () => {
    const { source } = flagging({}, false);

    await expect(identityOf(source, vi.fn<(error: unknown) => void>()).identify(ADA)).resolves.toBe(
      true,
    );
  });

  it("trusts no source before its first identify resolves", () => {
    const { source } = flagging();
    const identity = identityOf(source, vi.fn<(error: unknown) => void>());

    void identity.identify(ADA);

    expect(identity.trusted()).toBeUndefined();
  });

  it("trusts the source once identify resolves", async () => {
    const flags = flagging();
    const identity = identityOf(flags.source, vi.fn<(error: unknown) => void>());
    const identified = identity.identify(ADA);

    flags.finish();

    await expect(identified).resolves.toBe(true);
    expect(identity.trusted()).toBe(flags.source);
  });

  it("resolves false for an identify a later one overtook", async () => {
    const flags = flagging();
    const identity = identityOf(flags.source, vi.fn<(error: unknown) => void>());
    const first = identity.identify(ADA);

    void identity.identify(GRACE);
    flags.finish();

    await expect(first).resolves.toBe(false);
  });

  it("passes the error of a rejected identify to failed", async () => {
    const flags = flagging();
    const failed = vi.fn<(error: unknown) => void>();
    const failure = new Error("unreachable");
    const identified = identityOf(flags.source, failed).identify(ADA);

    flags.fail(failure);

    await expect(identified).resolves.toBe(false);
    expect(failed).toHaveBeenCalledExactlyOnceWith(failure);
  });

  it("passes nothing to failed for a rejected identify a later one overtook", async () => {
    const flags = flagging();
    const failed = vi.fn<(error: unknown) => void>();
    const identity = identityOf(flags.source, failed);
    const first = identity.identify(ADA);

    void identity.identify(GRACE);
    flags.fail(new Error("unreachable"));
    await first;

    expect(failed).not.toHaveBeenCalled();
  });

  it("ignores an identify in flight once stopped", async () => {
    const flags = flagging();
    const identity = identityOf(flags.source, vi.fn<(error: unknown) => void>());
    const identified = identity.identify(ADA);

    identity.stop();
    flags.finish();

    await expect(identified).resolves.toBe(false);
    expect(identity.trusted()).toBeUndefined();
  });

  it("trusts nothing without a source", () => {
    expect(identityOf(undefined, vi.fn<(error: unknown) => void>()).trusted()).toBeUndefined();
  });
});
