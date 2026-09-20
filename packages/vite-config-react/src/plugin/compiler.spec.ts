/**
 * Checks where the compiler lands, which React it writes against, and what it does without one.
 */

import { describe, expect, it, vi } from "vitest";

import { type Override } from "@stealthscale/vite-config";

import { compiler } from "#plugin/compiler.ts";

type Refining = Parameters<Override["refine"]>[0];

const HERE = new URL("../../", import.meta.url).pathname;

const BRIDGE = "@vitejs/plugin-react";

const VERSION = "#version.ts";

const BUILDING: Refining = {
  at: HERE,
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: HERE,
};

const TESTING: Refining = { ...BUILDING, command: "serve", mode: "test" };

interface Preset {
  reactCompilerPreset: (options: unknown) => unknown;
}

interface Read {
  major: () => string;
}

interface Loaded {
  compiler: typeof compiler;
  target: () => unknown;
}

/**
 * Stands in for a compiler that cannot be resolved from the package asking for it.
 */
function missing(): never {
  throw new Error("Cannot find module 'babel-plugin-react-compiler'");
}

/**
 * Loads a second copy of the layer against the preset and the React a case describes.
 *
 * @param preset - What the bridge answers in place of the real preset.
 * @param react - The major the installed React declares.
 * @returns The layer, and what target the preset was asked for.
 */
async function reloaded(preset: unknown, react = "19"): Promise<Loaded> {
  let seen: unknown;

  vi.resetModules();
  vi.doMock(BRIDGE, (): Preset => ({
    reactCompilerPreset: (options: unknown): unknown => {
      seen = options;

      return preset;
    },
  }));
  vi.doMock(VERSION, (): Read => ({ major: (): string => react }));

  return {
    compiler: (await import("#plugin/compiler.ts")).compiler,
    target: () => seen,
  };
}

/**
 * Takes one of the pair the layer returns, having checked it is an override.
 */
function layer(index: number, stated?: Parameters<typeof compiler>[0]): Override {
  const held = compiler(stated)[index];

  if (held?.kind !== "override") throw new Error("the compiler layer is not an override");

  return held;
}

describe("compiler", () => {
  it("names both layers for the call a consumer wrote", () => {
    expect(compiler().map((one) => one.name)).toStrictEqual([
      "react.plugin.compiler",
      "react.plugin.compiler(pack)",
    ]);
  });

  it("states why a package carries each layer", () => {
    expect([layer(0).because, layer(1).because]).not.toContain("");
  });

  it("adds the plugin after whatever plugins the tier built", () => {
    const already = { name: "other" };
    const refined = layer(0).refine(BUILDING, { plugins: [already] });

    expect(refined.plugins).toStrictEqual([already, expect.anything()]);
  });

  it("adds the plugin where the tier built none", () => {
    expect(layer(0).refine(BUILDING, {}).plugins).toHaveLength(1);
  });

  it("hands the bundler a plugin it resolves before it runs", async () => {
    const [plugin] = layer(0).refine(BUILDING, {}).plugins ?? [];

    await expect(plugin).resolves.toHaveProperty("name");
  });

  it("keeps the plugins the packer already held", () => {
    const already = { name: "other" };
    const refined = layer(1).refine(BUILDING, { pack: { plugins: [already] } });
    const held = Array.isArray(refined.pack) ? [] : (refined.pack?.plugins ?? []);

    expect(held).toStrictEqual([[already], expect.anything()]);
  });

  it("compiles every bundle of a package that publishes more than one", () => {
    const refined = layer(1).refine(BUILDING, { pack: [{}, {}] });
    const held = Array.isArray(refined.pack) ? refined.pack.map((one) => one.plugins) : [];

    expect(held).toStrictEqual([
      [[], expect.anything()],
      [[], expect.anything()],
    ]);
  });

  it("leaves an application alone because it has no packer", () => {
    expect(layer(1).refine(BUILDING, { plugins: [] }).pack).toBeUndefined();
  });

  it("leaves a specification reading what its author wrote", () => {
    expect(layer(0).refine(TESTING, { plugins: [] }).plugins).toStrictEqual([]);
    expect(layer(1).refine(TESTING, { pack: {} }).pack).toStrictEqual({});
  });

  it("leaves a dev server's transforms alone where the caller compiles under a build alone", () => {
    const serving: Refining = { ...BUILDING, command: "serve", mode: "development" };
    const building = layer(0, { only: "build" });

    expect(building.refine(serving, { plugins: [] }).plugins).toStrictEqual([]);
    expect(building.refine(BUILDING, { plugins: [] }).plugins).toHaveLength(1);
    expect(layer(0).refine(serving, { plugins: [] }).plugins).toHaveLength(1);
  });

  it("writes the memo cache against the installed React", async () => {
    const loaded = await reloaded({ preset: "held" }, "18");

    loaded.compiler();

    expect(loaded.target()).toStrictEqual(expect.objectContaining({ target: "18" }));
  });

  it("writes the memo cache against the React a caller names", async () => {
    const loaded = await reloaded({ preset: "held" }, "18");

    loaded.compiler({ target: "17" });

    expect(loaded.target()).toStrictEqual(expect.objectContaining({ target: "17" }));
  });

  it("writes the newest memo cache for a React the compiler has no target for", async () => {
    const loaded = await reloaded({ preset: "held" }, "23");

    loaded.compiler();

    expect(loaded.target()).toStrictEqual(expect.objectContaining({ target: "19" }));
  });

  it("names the React to upgrade to where the installed one is too old", async () => {
    const loaded = await reloaded({ preset: "held" }, "16");

    expect(() => loaded.compiler()).toThrow(/no target for React 16/u);
  });

  it("raises what the compiler cannot read rather than skipping it", async () => {
    const loaded = await reloaded({ preset: "held" });

    loaded.compiler();

    expect(loaded.target()).toStrictEqual(
      expect.objectContaining({ panicThreshold: "critical_errors" }),
    );
  });

  it("names the package to install where the compiler cannot be resolved", async () => {
    const loaded = await reloaded({ preset: missing });

    expect(() => loaded.compiler()).toThrow(/babel-plugin-react-compiler/u);
  });

  it("takes a preset the bridge resolves by name rather than by call", async () => {
    const loaded = await reloaded({ preset: "babel-preset-react-compiler" });

    expect(() => loaded.compiler()).not.toThrow();
  });
});
