import { OpenFeature } from "@openfeature/web-sdk";
import { describe, expect, it } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";

import {
  bound,
  CALENDAR,
  configOf,
  LAYOUT,
  listening,
  PAUSED,
  TARGETED,
} from "#openfeature.fixtures.ts";
import { openFeatureFlags } from "#openfeature.ts";
import { ADA } from "#stores/session.fixtures.ts";

describe("openFeatureFlags", () => {
  it("evaluates a release flag through the provider bound to the domain", async () => {
    await bound("release");

    expect(
      openFeatureFlags({ domain: "release" }).evaluate({ id: CALENDAR, type: "boolean" }),
    ).toBe(true);
  });

  it("evaluates an experiment's variant through the provider bound to the domain", async () => {
    await bound("experiment");

    expect(
      openFeatureFlags({ domain: "experiment" }).evaluate({ id: LAYOUT, type: "string" }),
    ).toBe("board");
  });

  it("returns no value for a flag the provider does not know", async () => {
    await bound("unknown");

    expect(
      openFeatureFlags({ domain: "unknown" }).evaluate({ id: "time-off/absent", type: "boolean" }),
    ).toBeUndefined();
  });

  it("returns no value for a flag the provider disabled", async () => {
    await bound("disabled");

    expect(
      openFeatureFlags({ domain: "disabled" }).evaluate({ id: PAUSED, type: "boolean" }),
    ).toBeUndefined();
  });

  it("returns no value for a flag of another type", async () => {
    await bound("mismatched");

    expect(
      openFeatureFlags({ domain: "mismatched" }).evaluate({ id: LAYOUT, type: "boolean" }),
    ).toBeUndefined();
  });

  it("returns no value where no provider is bound to the domain", () => {
    expect(
      openFeatureFlags({ domain: "unbound" }).evaluate({ id: CALENDAR, type: "boolean" }),
    ).toBeUndefined();
  });

  it("evaluates through the stealth.host domain where the options state none", async () => {
    await bound("stealth.host");

    expect(openFeatureFlags().evaluate({ id: CALENDAR, type: "boolean" })).toBe(true);
  });

  it("sets the session as the domain's evaluation context", async () => {
    await openFeatureFlags({ domain: "identified" }).identify?.(ADA);

    expect(OpenFeature.getContext("identified")).toStrictEqual({
      authenticated: true,
      entitlements: ["time-off/module", "elsewhere/module"],
      roles: ["time-off/approver"],
      targetingKey: "ada",
      tenantId: "acme",
    });
  });

  it("leaves the targeting key out for a session without a person", async () => {
    await openFeatureFlags({ domain: "nobody" }).identify?.(NOBODY);

    expect(OpenFeature.getContext("nobody")).toStrictEqual({
      authenticated: false,
      entitlements: [],
      roles: [],
    });
  });

  it("evaluates a flag for the person the session identified", async () => {
    const flags = openFeatureFlags({ domain: "targeted" });

    await bound("targeted");
    await flags.identify?.(ADA);

    expect(flags.evaluate({ id: TARGETED, type: "boolean" })).toBe(true);
  });

  it("calls the listener at once where the provider is ready", async () => {
    const listener = listening();

    await bound("ready");
    openFeatureFlags({ domain: "ready" }).subscribe(listener);

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("calls the listener after the provider's configuration changes", async () => {
    const listener = listening();
    const provider = await bound("configured");

    openFeatureFlags({ domain: "configured" }).subscribe(listener);
    listener.mockClear();
    await provider.putConfiguration(configOf(false));

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("calls the listener after the provider reconciles a new session", async () => {
    const listener = listening();
    const flags = openFeatureFlags({ domain: "reconciled" });

    await bound("reconciled");
    flags.subscribe(listener);
    listener.mockClear();
    await flags.identify?.(ADA);

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("stops calling the listener once its stop function runs", async () => {
    const listener = listening();
    const provider = await bound("stopped");

    openFeatureFlags({ domain: "stopped" }).subscribe(listener)();
    listener.mockClear();
    await provider.putConfiguration(configOf(false));

    expect(listener).not.toHaveBeenCalled();
  });
});
