import { type Plugin } from "vite";
import { describe, expect, it, vi } from "vitest";

import { type Override } from "@stealthscale/vite-config";

import { type Compiled, compiler } from "#plugin/compiler.ts";

type Refining = Parameters<Override["refine"]>[0];

const HERE = new URL("../../", import.meta.url).pathname;

const VERSION = "#version.ts";

const CONFIG = "@stealthscale/vite-config";

const FILE = "/work/src/counter.tsx";

const COMPONENT = [
  'import { useState } from "react";',
  "",
  "type Props = { readonly label: string };",
  "",
  "export function Counter({ label }: Props) {",
  "  const [count, setCount] = useState(0);",
  "",
  "  return <button onClick={() => setCount(count + 1)}>{label} {count}</button>;",
  "}",
  "",
].join("\n");

const BROKEN = "export function Broken() {\n  return <div>;\n}\n";

const BUILDING: Refining = {
  at: HERE,
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: HERE,
};

const SERVING: Refining = { ...BUILDING, command: "serve", mode: "development" };

const TESTING: Refining = { ...BUILDING, command: "serve", mode: "test" };

const UNMAPPED = { config: { build: { sourcemap: false }, command: "build" } };

interface Read {
  major: () => string;
}

interface Output {
  readonly code: string;
  readonly map: unknown;
}

type Locating = (specifier: string, from: string) => string;

/**
 * Throws the error the resolver throws for a package that is not installed.
 */
function missing(): never {
  throw new Error("Cannot find module 'oxc-transform-react'");
}

/**
 * Throws the message a plugin reports, as the bundler's error hook does.
 */
function thrown(message: string): never {
  throw new Error(message);
}

/**
 * Loads a second copy of the layer against the React major and the resolver a case describes.
 *
 * @param react - The major the installed React declares.
 * @param locate - The resolver in place of the real one, or undefined for the real one.
 * @returns The layer's factory.
 */
async function reloaded(react: string, locate?: Locating): Promise<typeof compiler> {
  vi.resetModules();
  vi.doMock(VERSION, (): Read => ({ major: (): string => react }));
  vi.doMock(CONFIG, async (original: () => Promise<typeof import("@stealthscale/vite-config")>) => {
    const actual = await original();

    return { ...actual, located: locate ?? actual.located };
  });

  return (await import("#plugin/compiler.ts")).compiler;
}

/**
 * Takes one of the pair the layer returns, having checked it is an override.
 */
function layer(index: number, stated?: Compiled, from = compiler): Override {
  const found = from(stated)[index];

  if (found?.kind !== "override") throw new Error("the compiler layer is not an override");

  return found;
}

/**
 * Returns the plugin the first layer adds to a production build.
 */
function pluginOf(stated?: Compiled, from = compiler): Plugin {
  const [found] = layer(0, stated, from).refine(BUILDING, {}).plugins ?? [];

  if (typeof found !== "object" || found === null || !("name" in found)) {
    throw new Error("the compiler layer added no plugin");
  }

  return found;
}

/**
 * Calls one of a plugin's function hooks with the arguments a case gives.
 */
function called(hook: unknown, ...parameters: unknown[]): unknown {
  if (typeof hook !== "function") throw new Error("the plugin has no such hook");

  return Reflect.apply(hook, undefined, parameters);
}

/**
 * Runs a plugin's transform over one module, in the environment a case describes.
 *
 * @param plugin - The plugin under test.
 * @param code - The module's source.
 * @param id - The module's id, the fixture component's by default.
 * @param environment - The bundler's environment, or undefined for the packer, which has none.
 * @returns The compiled code and its source map.
 */
async function transformed(
  plugin: Plugin,
  code: string,
  id = FILE,
  environment?: unknown,
): Promise<Output> {
  const handler: unknown = typeof plugin.transform === "object" ? plugin.transform.handler : null;

  if (typeof handler !== "function") throw new Error("the plugin has no transform handler");

  const result: unknown = await Reflect.apply(handler, { environment, error: thrown }, [code, id]);

  if (typeof result !== "object" || result === null || !("map" in result) || !("code" in result)) {
    throw new Error("the transform returned no code");
  }

  if (typeof result.code !== "string") throw new Error("the transform returned no code");

  return { code: result.code, map: result.map };
}

/**
 * Lists the modules a compiled source imports, in the order it imports them.
 */
function importsOf(code: string): ReadonlyArray<string | undefined> {
  return [...code.matchAll(/from "([^"]+)"/gu)].map((match) => match[1]);
}

/**
 * Returns whether the plugin's filter leaves a module id out of the transform.
 */
function excluded(plugin: Plugin, id: string): boolean {
  const filter: unknown = typeof plugin.transform === "object" ? plugin.transform.filter?.id : null;

  if (typeof filter !== "object" || filter === null || !("exclude" in filter)) {
    throw new Error("the plugin excludes no module id");
  }

  if (!Array.isArray(filter.exclude)) throw new Error("the plugin excludes a single pattern");

  return filter.exclude.some((pattern: unknown) => pattern instanceof RegExp && pattern.test(id));
}

describe("compiler", () => {
  it("names both layers for the call a consumer wrote", () => {
    expect(compiler().map((one) => one.name)).toStrictEqual([
      "react.plugin.compiler",
      "react.plugin.compiler(pack)",
    ]);
  });

  it("states a reason for each layer", () => {
    expect([layer(0).because, layer(1).because]).not.toContain("");
  });

  it("appends the plugin to the plugins the tier built", () => {
    const already = { name: "other" };
    const refined = layer(0).refine(BUILDING, { plugins: [already] });

    expect(refined.plugins).toStrictEqual([already, expect.anything()]);
  });

  it("adds the plugin where the tier built none", () => {
    expect(layer(0).refine(BUILDING, {}).plugins).toHaveLength(1);
  });

  it("returns a plugin named react.plugin.compiler", () => {
    expect(pluginOf().name).toBe("react.plugin.compiler");
  });

  it("keeps the plugins the packer already runs", () => {
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

  it("leaves pack undefined when the config has no packer", () => {
    expect(layer(1).refine(BUILDING, { plugins: [] }).pack).toBeUndefined();
  });

  it("adds nothing in test mode", () => {
    expect(layer(0).refine(TESTING, { plugins: [] }).plugins).toStrictEqual([]);
    expect(layer(1).refine(TESTING, { pack: {} }).pack).toStrictEqual({});
  });

  it("adds no plugin to a dev server when only is build", () => {
    expect(layer(0, { only: "build" }).refine(SERVING, { plugins: [] }).plugins).toStrictEqual([]);
  });

  it("adds the plugin to a build when only is build", () => {
    expect(layer(0, { only: "build" }).refine(BUILDING, { plugins: [] }).plugins).toHaveLength(1);
  });

  it("adds the plugin to a dev server by default", () => {
    expect(layer(0).refine(SERVING, { plugins: [] }).plugins).toHaveLength(1);
  });

  it("applies to a client environment", () => {
    expect(called(pluginOf().applyToEnvironment, { config: { consumer: "client" } })).toBe(true);
  });

  it("skips a server environment", () => {
    expect(called(pluginOf().applyToEnvironment, { config: { consumer: "server" } })).toBe(false);
  });

  it.each([
    { react: "18", want: "react-compiler-runtime" },
    { react: "19", want: "react/compiler-runtime" },
  ])("pre-bundles $want for React $react", async ({ react, want }) => {
    const plugin = pluginOf(undefined, await reloaded(react));

    expect(called(plugin.config, {}, BUILDING)).toStrictEqual({
      optimizeDeps: { include: [want] },
    });
  });

  it("imports the runtime of the installed React", async () => {
    const plugin = pluginOf(undefined, await reloaded("18"));

    expect(importsOf((await transformed(plugin, COMPONENT)).code)).toStrictEqual([
      "react-compiler-runtime",
      "react",
    ]);
  });

  it("imports the runtime of the React a caller names", async () => {
    const plugin = pluginOf({ target: "18" }, await reloaded("19"));

    expect(importsOf((await transformed(plugin, COMPONENT)).code)).toStrictEqual([
      "react-compiler-runtime",
      "react",
    ]);
  });

  it("imports the newest runtime for a React newer than every target", async () => {
    const plugin = pluginOf(undefined, await reloaded("23"));

    expect(importsOf((await transformed(plugin, COMPONENT)).code)).toStrictEqual([
      "react/compiler-runtime",
      "react",
    ]);
  });

  it("throws when the installed React is older than every target", async () => {
    const loaded = await reloaded("16");

    expect(() => loaded()).toThrow(/no target for React 16/u);
  });

  it("throws naming the package to install when the compiler is not installed", async () => {
    const loaded = await reloaded("19", missing);

    expect(() => loaded()).toThrow(/add oxc-transform-react to this package/u);
  });

  it("leaves JSX in place", async () => {
    const output = await transformed(pluginOf(), COMPONENT);

    expect(output.code).toContain("<button onClick");
  });

  it("compiles a module whose id ends in a query", async () => {
    const output = await transformed(pluginOf(), COMPONENT, `${FILE}?v=1`);

    expect(importsOf(output.code)).toStrictEqual(["react/compiler-runtime", "react"]);
  });

  it("compiles each module one plugin receives", async () => {
    const plugin = pluginOf();
    const first = await transformed(plugin, COMPONENT);
    const second = await transformed(plugin, COMPONENT, "/work/src/other.tsx");

    expect([importsOf(first.code), importsOf(second.code)]).toStrictEqual([
      ["react/compiler-runtime", "react"],
      ["react/compiler-runtime", "react"],
    ]);
  });

  it.each([
    "/work/src/preset/index.d.ts",
    "/work/src/theme.d.mts",
    "/work/src/page.d.mdx.ts",
    "/work/src/index.d.ts?v=1",
  ])("leaves the declaration %s out of the transform", (id) => {
    expect(excluded(pluginOf(), id)).toBe(true);
  });

  it.each(["/work/src/card.tsx", "/work/src/audio.data.ts", "/work/src/card.d.tsx"])(
    "keeps the module %s in the transform",
    (id) => {
      expect(excluded(pluginOf(), id)).toBe(false);
    },
  );

  it("leaves a module under node_modules out of the transform", () => {
    expect(excluded(pluginOf(), "/work/node_modules/x/card.tsx")).toBe(true);
  });

  it("returns a source map when the context has no environment", async () => {
    await expect(transformed(pluginOf(), COMPONENT)).resolves.toHaveProperty("map.mappings");
  });

  it("returns no source map when the build writes none", async () => {
    const output = await transformed(pluginOf(), COMPONENT, FILE, UNMAPPED);

    expect(output.map).toBeNull();
  });

  it("stops the build with the compiler's diagnostic when a module does not parse", async () => {
    await expect(transformed(pluginOf(), BROKEN, "/work/src/broken.tsx")).rejects.toThrow(
      /could not compile \/work\/src\/broken\.tsx\n\nUnexpected token/u,
    );
  });
});
