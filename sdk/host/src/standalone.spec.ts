import { describe, expect, it, vi } from "vitest";

import { NOBODY, resolveProduct } from "@stealthscale/sdk-core";

import { isPending } from "#host/host.fixtures.ts";
import { PACKAGES, PRODUCT, timeOff, timeOffContract } from "#host/product.fixtures.ts";
import {
  identityContract,
  placeholderCodeOf,
  placeholderExtensionOf,
  placeholderRunOf,
  profile,
  profileContract,
} from "#standalone.fixtures.ts";
import { standaloneFrom, standaloneProduct, standaloneSources } from "#standalone.ts";

const CHECK = {
  permission: "time-off/request.approve",
  resource: { id: "7", type: "time-off/request" },
};

describe("standalone", () => {
  it("installs the plugin from its manifest", () => {
    const { plugins } = standaloneProduct({ contract: profileContract, manifest: profile });

    expect(plugins[0]?.manifest).toBe(profile);
  });

  it("installs the plugin from its contract alone where no manifest is given", () => {
    const { plugins } = standaloneProduct({ contract: profileContract });

    expect(plugins[0]?.manifest.contract).toBe(profileContract);
  });

  it("installs each plugin beside the plugin from its contract alone", () => {
    const { plugins } = standaloneProduct({
      beside: [identityContract, timeOffContract],
      contract: profileContract,
      manifest: profile,
    });

    expect(plugins.map(({ manifest }) => manifest.contract)).toStrictEqual([
      profileContract,
      identityContract,
      timeOffContract,
    ]);
  });

  it("passes the configuration to the plugin", () => {
    const { plugins } = standaloneProduct({
      config: { region: "us" },
      contract: profileContract,
      manifest: profile,
    });

    expect(plugins[0]?.config).toStrictEqual({ region: "us" });
  });

  it("names the product after the plugin", () => {
    const { name, productId } = standaloneProduct({ contract: profileContract, manifest: profile });

    expect([productId, name]).toStrictEqual(["profile", "plugin.name"]);
  });

  it("throws when the manifest implements another contract", () => {
    expect(() => standaloneProduct({ contract: profileContract, manifest: timeOff })).toThrow(
      "The manifest implements the contract of time-off, not of profile.",
    );
  });

  it("builds the product from the manifest a module exports", () => {
    const { plugins } = standaloneFrom({
      from: "src/manifest.ts",
      module: { manifest: profile, pages: ["profile"] },
    });

    expect(plugins[0]?.manifest).toBe(profile);
  });

  it("installs the contract each module beside the plugin exports", () => {
    const { plugins } = standaloneFrom({ from: "src/manifest.ts", module: { manifest: profile } }, [
      { from: "@acme/identity-contract", module: { contract: identityContract, version: "1.0.0" } },
    ]);

    expect(plugins.map(({ manifest }) => manifest.contract)).toStrictEqual([
      profileContract,
      identityContract,
    ]);
  });

  it("takes a manifest a module exports under two names once", () => {
    const module = { default: profile, manifest: profile };

    expect(standaloneFrom({ from: "src/manifest.ts", module }).plugins).toHaveLength(1);
  });

  it("throws for a module that exports no manifest", () => {
    const module = { contract: profileContract, empty: null };

    expect(() => standaloneFrom({ from: "src/manifest.ts", module })).toThrow(
      "src/manifest.ts exports 0 plugin manifests, and a standalone product takes one.",
    );
  });

  it("throws for a module that exports several manifests", () => {
    const module = { profile, timeOff };

    expect(() => standaloneFrom({ from: "src/manifest.ts", module })).toThrow(
      "src/manifest.ts exports 2 plugin manifests, and a standalone product takes one.",
    );
  });

  it("throws for a module beside the plugin that exports no contract", () => {
    const beside = [{ from: "@acme/identity-contract", module: { manifest: profile } }];

    expect(() =>
      standaloneFrom({ from: "src/manifest.ts", module: { manifest: profile } }, beside),
    ).toThrow(
      "@acme/identity-contract exports 0 plugin contracts, and a standalone product takes one.",
    );
  });

  it("resolves with no problem when a plugin beside it comes from its contract alone", () => {
    const definition = standaloneProduct({
      beside: [identityContract],
      contract: profileContract,
      manifest: profile,
    });

    expect(resolveProduct(definition, PACKAGES, { today: "2026-10-01" }).problems).toStrictEqual(
      [],
    );
  });

  it("maps every route of a contract alone to a module of one placeholder page", async () => {
    const { routes = {} } = placeholderCodeOf(identityContract);
    const modules = await Promise.all(
      Object.values(routes).map((code) => (typeof code === "function" ? code() : code.component())),
    );

    expect(modules.map((module) => Object.keys(module))).toStrictEqual([
      ["PlaceholderPage"],
      ["PlaceholderPage"],
    ]);
  });

  it("renders the content a placeholder extension wraps", async () => {
    const component = await placeholderExtensionOf(identityContract, "frame");

    expect(component({ children: "wrapped" })).toBe("wrapped");
  });

  it("renders nothing for a placeholder extension that wraps nothing", async () => {
    const component = await placeholderExtensionOf(identityContract, "badge");

    expect(component({})).toBeUndefined();
  });

  it("maps every command of a contract alone to a run that returns nothing", async () => {
    const runs = await Promise.all([
      placeholderRunOf(identityContract, "invite"),
      placeholderRunOf(identityContract, "pick"),
    ]);

    expect(runs.map((run) => run())).toStrictEqual([undefined, undefined]);
  });

  it("maps a settings section without a schema to the placeholder section", async () => {
    const { settings = {} } = placeholderCodeOf(identityContract);
    const module = await settings["photo"]?.component?.();

    expect(Object.keys(module ?? {})).toStrictEqual(["PlaceholderSection"]);
  });

  it("maps no code to a settings section with a schema", () => {
    const { settings = {} } = placeholderCodeOf(identityContract);

    expect(Object.keys(settings)).toStrictEqual(["photo"]);
  });

  it("starts a signed-in session with every declared permission", () => {
    const { authenticated, permissions } = standaloneSources(PRODUCT).session.read();

    expect([authenticated, permissions]).toStrictEqual([
      true,
      ["time-off/request.approve", "time-off/request.read", "billing/invoice.read"],
    ]);
  });

  it("starts the session with every declared entitlement", () => {
    expect(standaloneSources(PRODUCT).session.read().entitlements).toStrictEqual([
      "time-off/module",
    ]);
  });

  it("returns the session a set replaced", () => {
    const { session } = standaloneSources(PRODUCT);

    session.set(NOBODY);

    expect(session.read()).toBe(NOBODY);
  });

  it("calls the session's listeners after a set", () => {
    const { session } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    session.subscribe(listener);
    session.set(NOBODY);

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("calls no session listener when a set passes the same session", () => {
    const { session } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    session.subscribe(listener);
    session.set(session.read());

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops calling a session listener once its stop function runs", () => {
    const { session } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    session.subscribe(listener)();
    session.set(NOBODY);

    expect(listener).not.toHaveBeenCalled();
  });

  it("allows every check at first", async () => {
    await expect(standaloneSources(PRODUCT).access.check([CHECK, CHECK])).resolves.toStrictEqual([
      true,
      true,
    ]);
  });

  it("denies every check after deny", async () => {
    const { access } = standaloneSources(PRODUCT);

    access.deny();

    await expect(access.check([CHECK, CHECK])).resolves.toStrictEqual([false, false]);
  });

  it("leaves every check pending after pending", async () => {
    const { access } = standaloneSources(PRODUCT);

    access.pending();

    await expect(isPending(access.check([CHECK]))).resolves.toBe(true);
  });

  it("allows every check after allow", async () => {
    const { access } = standaloneSources(PRODUCT);

    access.deny();
    access.allow();

    await expect(access.check([CHECK])).resolves.toStrictEqual([true]);
  });

  it("decides each check with the function decide passes", async () => {
    const { access } = standaloneSources(PRODUCT);
    const other = { ...CHECK, resource: { ...CHECK.resource, id: "8" } };

    access.decide(({ resource }) => resource.id === "7");

    await expect(access.check([CHECK, other])).resolves.toStrictEqual([true, false]);
  });

  it("calls the access listeners after the decision changes", () => {
    const { access } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    access.subscribe(listener);
    access.pending();

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("denies a check whose permission the session lacks", async () => {
    const { access, session } = standaloneSources(PRODUCT);

    session.set({ ...session.read(), permissions: [] });

    await expect(access.check([CHECK])).resolves.toStrictEqual([false]);
  });

  it("calls the access listeners after the session changes", () => {
    const { access, session } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    access.subscribe(listener);
    session.set(NOBODY);

    expect(listener).toHaveBeenCalledExactlyOnceWith();
  });

  it("stops calling an access listener for a session change once its stop function runs", () => {
    const { access, session } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    access.subscribe(listener)();
    session.set(NOBODY);

    expect(listener).not.toHaveBeenCalled();
  });

  it("calls no access listener when the decision does not change", () => {
    const { access } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    access.subscribe(listener);
    access.allow();

    expect(listener).not.toHaveBeenCalled();
  });

  it("turns every boolean flag on", () => {
    const { flags } = standaloneSources(PRODUCT);

    expect(flags.evaluate({ id: "time-off/calendar", type: "boolean" })).toBe(true);
  });

  it("returns no value for an experiment", () => {
    const { flags } = standaloneSources(PRODUCT);

    expect(flags.evaluate({ id: "time-off/layout", type: "string" })).toBeUndefined();
  });

  it("never calls a flag listener", () => {
    const { flags } = standaloneSources(PRODUCT);
    const listener = vi.fn<() => void>();

    flags.subscribe(listener)();

    expect(listener).not.toHaveBeenCalled();
  });
});
