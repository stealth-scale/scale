import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Contribution, type Preset } from "@stealthscale/vite-config";

import { host, type Hosted } from "#federation/host.ts";
import { told } from "#vite.fixtures.ts";

function plugged(stated: Hosted): Contribution {
  return host(stated)[0] as Contribution;
}

describe("host", () => {
  it("targets plugins", () => {
    expect(plugged({ name: "one", remotes: [] }).at).toBe("plugins");
  });

  it("resolves itemOf to a plugin when a remote is named", async () => {
    await expect(
      plugged({ name: "one", remotes: ["two"] }).itemOf?.(told()),
    ).resolves.toBeDefined();
  });

  it("sets because to a reason naming the other deployment", () => {
    expect(plugged({ name: "one", remotes: [] }).because).toContain("another deployment");
  });

  it("names the contribution federation.host with the host name", () => {
    expect(plugged({ name: "shell", remotes: [] }).name).toBe("federation.host(shell)");
  });

  it("resolves itemOf to a plugin when shared is given", async () => {
    await expect(
      plugged({ name: "one", remotes: ["two"], shared: { react: { singleton: true } } }).itemOf?.(
        told(),
      ),
    ).resolves.toBeDefined();
  });

  it("resolves itemOf to a plugin when remotes is absent", async () => {
    await expect(plugged({ name: "one" }).itemOf?.(told())).resolves.toBeDefined();
  });

  it("returns one layer when stubs is absent", () => {
    expect(host({ name: "one", remotes: [] })).toHaveLength(1);
  });

  it("sets test.alias to the stubs it was given", () => {
    const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

    expect(((held as Preset).config as UserConfig).test?.alias).toStrictEqual({
      "remote/Thing": "/abs/thing.tsx",
    });
  });

  it("names the stub preset federation.host(name).stubs", () => {
    const [, held] = host({ name: "one", stubs: { "remote/Thing": "/abs/thing.tsx" } });

    expect(held?.name).toBe("federation.host(one).stubs");
  });
});
