import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { resolved } from "@stealthscale/testing";

import { builtins } from "#pack/builtins.ts";
import { told } from "#vite.fixtures.ts";

/**
 * Returns the last plugin the override appended to the packer's plugin list, or undefined when it
 * appended none.
 */
function appended(config: UserConfig): Parameters<typeof resolved>[0] | undefined {
  const refined = builtins().refine(told(), config);
  const plugins: unknown = Array.isArray(refined.pack) ? undefined : refined.pack?.plugins;
  const held: unknown = Array.isArray(plugins) ? plugins.at(-1) : undefined;

  // The override appends the plugin it built, and no other value can appear here.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return held as Parameters<typeof resolved>[0] | undefined;
}

/**
 * Returns the plugin the override appends for a library packed for a platform a browser loads.
 *
 * @throws {@link Error} When the override appended none.
 */
function refusing(): Parameters<typeof resolved>[0] {
  const plugin = appended({ pack: { platform: "neutral" } });

  if (plugin === undefined) throw new Error("no plugin was appended");

  return plugin;
}

describe("builtins", () => {
  it("names the override pack.builtins", () => {
    expect(builtins().name).toBe("pack.builtins");
  });

  it("sets a non-empty because on the override", () => {
    expect(builtins().because).not.toBe("");
  });

  it("appends the plugin when the platform is neutral or browser", () => {
    expect(appended({ pack: { platform: "neutral" } })?.name).toBe("stealth:pack.builtins");
    expect(appended({ pack: { platform: "browser" } })?.name).toBe("stealth:pack.builtins");
  });

  it("appends no plugin when the platform is node or absent", () => {
    expect(appended({ pack: { platform: "node" } })).toBeUndefined();
    expect(appended({})).toBeUndefined();
  });

  it("appends the plugin to every bundle when pack is an array", () => {
    const refined = builtins().refine(told(), {
      pack: [{ platform: "neutral" }, { platform: "browser" }],
    });

    expect(refined.pack).toMatchObject([
      { plugins: [{ name: "stealth:pack.builtins" }] },
      { plugins: [{ name: "stealth:pack.builtins" }] },
    ]);
  });

  it("returns the same configuration object when one bundle is packed for node", () => {
    const config: UserConfig = { pack: [{ platform: "neutral" }, { platform: "node" }] };

    expect(builtins().refine(told(), config)).toBe(config);
  });

  it("throws naming the importing file when it imports a Node built-in", async () => {
    await expect(resolved(refusing(), "node:fs", "/pkg/src/index.ts")).rejects.toThrow(
      "/pkg/src/index.ts imports node:fs, which is a Node built-in",
    );
  });

  it("throws naming an entry when the import has no importer", async () => {
    await expect(resolved(refusing(), "path")).rejects.toThrow("an entry imports path");
  });

  it("resolves a specifier that is not a built-in to undefined", async () => {
    await expect(resolved(refusing(), "react", "/pkg/src/index.ts")).resolves.toBeUndefined();
    await expect(resolved(refusing(), "./local.ts", "/pkg/src/index.ts")).resolves.toBeUndefined();
  });
});
