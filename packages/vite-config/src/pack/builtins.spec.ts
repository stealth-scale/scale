import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { resolved } from "@stealthscale/testing";

import { builtins } from "#pack/builtins.ts";
import { told } from "#vite.fixtures.ts";

/**
 * Takes the plugin the override appended to the packer's list, or nothing where it appended none.
 */
function appended(config: UserConfig): Parameters<typeof resolved>[0] | undefined {
  const refined = builtins().refine(told(), config);
  const plugins: unknown = Array.isArray(refined.pack) ? undefined : refined.pack?.plugins;
  const held: unknown = Array.isArray(plugins) ? plugins.at(-1) : undefined;

  // The override appends the plugin it built, and nothing else answers here.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return held as Parameters<typeof resolved>[0] | undefined;
}

/**
 * Takes the plugin the override appends for a library packed for a browser.
 *
 * @throws {@link Error} When the override appended none.
 */
function refusing(): Parameters<typeof resolved>[0] {
  const plugin = appended({ pack: { platform: "neutral" } });

  if (plugin === undefined) throw new Error("no plugin was appended");

  return plugin;
}

describe("builtins", () => {
  it("names the layer for the call that produced it and says why", () => {
    expect(builtins().name).toBe("pack.builtins");
    expect(builtins().because).not.toBe("");
  });

  it("appends the plugin where the library is packed for a browser", () => {
    expect(appended({ pack: { platform: "neutral" } })?.name).toBe("stealth:pack.builtins");
    expect(appended({ pack: { platform: "browser" } })?.name).toBe("stealth:pack.builtins");
  });

  it("appends nothing where the library is packed for node", () => {
    expect(appended({ pack: { platform: "node" } })).toBeUndefined();
    expect(appended({})).toBeUndefined();
  });

  it("appends the plugin to every bundle of a packer configured as a list", () => {
    const refined = builtins().refine(told(), {
      pack: [{ platform: "neutral" }, { platform: "browser" }],
    });

    expect(refined.pack).toMatchObject([
      { plugins: [{ name: "stealth:pack.builtins" }] },
      { plugins: [{ name: "stealth:pack.builtins" }] },
    ]);
  });

  it("leaves a list alone where one bundle is packed for node", () => {
    const config: UserConfig = { pack: [{ platform: "neutral" }, { platform: "node" }] };

    expect(builtins().refine(told(), config)).toBe(config);
  });

  it("ends the pack at an import of a Node built-in and names the file", async () => {
    await expect(resolved(refusing(), "node:fs", "/pkg/src/index.ts")).rejects.toThrow(
      "/pkg/src/index.ts imports node:fs, which is a Node built-in",
    );
    await expect(resolved(refusing(), "path")).rejects.toThrow("an entry imports path");
  });

  it("leaves every other specifier to the packer", async () => {
    await expect(resolved(refusing(), "react", "/pkg/src/index.ts")).resolves.toBeUndefined();
    await expect(resolved(refusing(), "./local.ts", "/pkg/src/index.ts")).resolves.toBeUndefined();
  });
});
