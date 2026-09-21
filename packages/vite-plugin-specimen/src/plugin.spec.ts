import { readFileSync } from "node:fs";
import { type Plugin, type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import {
  changed,
  configured,
  hookContext,
  loaded,
  resolved,
  type ScratchWorkspace,
  transformed,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";

import { kit } from "#anatomy/kit.fixtures.ts";
import { ID, PROPS } from "#options.ts";
import { specimens } from "#plugin.ts";

const RESOLVED = ID;

const PATTERNS = ["src/**/*.specimen.tsx"];

const BADGE = [
  'import { Badge } from "#badge/index.ts";',
  "",
  'export const sizes = { draw: () => <Badge />, title: "Sizes" };',
  "",
  'export default specimen({ id: "data/badge", group: "Data", scenes: [sizes] });',
  "",
].join("\n");

const TREE = { "package.json": '{ "name": "@kit/data" }', "src/badge.specimen.tsx": BADGE };

function serving<Result>(
  files: Readonly<Record<string, string>>,
  run: (plugin: Plugin, scratch: ScratchWorkspace) => Promise<Result>,
): Promise<Result> {
  return withScratchWorkspaceAsync(files, async (scratch) => {
    const plugin = specimens({ patterns: PATTERNS });

    await configured(plugin, { command: "serve", root: scratch.root });

    return run(plugin, scratch);
  });
}

function index(files: Readonly<Record<string, string>> = TREE): Promise<string> {
  return serving(files, async (plugin) => (await loaded(plugin, RESOLVED)) ?? "");
}

type Handler = (...args: readonly unknown[]) => unknown;

interface Group {
  readonly includeDependenciesRecursively?: boolean;
  readonly name: string;
  readonly test: (id: string) => boolean;
}

interface Naming {
  readonly codeSplitting: { readonly groups: readonly [Group, Group] };
}

function naming(plugin: Plugin, stated: unknown): Naming {
  const config: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
    stated,
    { command: "build", mode: "production" },
  ]);
  const output: unknown = (config as UserConfig).build?.rolldownOptions?.output;

  return output as Naming;
}

function reading(scratch: ScratchWorkspace): Promise<Plugin> {
  const plugin = specimens({ patterns: PATTERNS, props: {} });

  return configured(plugin, { command: "serve", root: scratch.root }).then(() => plugin);
}

function probed(badge: string): string {
  return badge.replace(
    "export interface Own",
    "export interface Own {\n  probe?: string;\n}\n\nexport interface Own",
  );
}

function hookOf(
  plugin: Plugin,
  name: "closeBundle" | "config" | "configureServer" | "hotUpdate",
): Handler {
  const hook: unknown = plugin[name];

  if (typeof hook !== "function") throw new Error(`the plugin has no ${name} hook`);

  return hook as Handler;
}

function updating(
  plugin: Plugin,
  file: string,
  text: string,
  graphed: readonly string[] = [RESOLVED],
): Promise<unknown> {
  const update = {
    file,
    modules: [],
    read: (): string => text,
    timestamp: Date.now(),
    type: "update",
  };

  return Promise.resolve(
    Reflect.apply(hookOf(plugin, "hotUpdate"), hookContext(graphed), [update]),
  );
}

describe("plugin", () => {
  it("returns a plugin named stealth:specimens", () => {
    expect(specimens({ patterns: PATTERNS }).name).toBe("stealth:specimens");
  });

  it("ignores the coverage directory in the server watcher", () => {
    const plugin = specimens({ patterns: PATTERNS });
    const held: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
      {},
      { command: "serve", mode: "test" },
    ]);

    expect(held).toMatchObject({ server: { watch: { ignored: ["**/coverage/**"] } } });
  });

  it("returns one code-splitting group per chunk", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      const [props, pages] = naming(plugin, {}).codeSplitting.groups;
      const page = scratch.path("src/badge.specimen.tsx");
      const asked = [page, `${page}?rolldown-lazy=1`, scratch.path("src/other.ts")];

      return {
        pages: { ...pages, test: asked.map((id) => pages.test(id)) },
        props: { ...props, test: [`${PROPS}data/badge`, page].map((id) => props.test(id)) },
      };
    });

    expect(held).toStrictEqual({
      pages: { includeDependenciesRecursively: true, name: "pages", test: [true, true, false] },
      props: { name: "props", test: [true, false] },
    });
  });

  it("adds no code-splitting group under a dev server", () => {
    const plugin = specimens({ patterns: PATTERNS });
    const held: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
      {},
      { command: "serve", mode: "development" },
    ]);

    expect(held).toStrictEqual({ server: { watch: { ignored: ["**/coverage/**"] } } });
  });

  it("adds no code-splitting group when the output is an array", () => {
    const plugin = specimens({ patterns: PATTERNS });
    const held: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
      { build: { rolldownOptions: { output: [{}, {}] } } },
      { command: "build", mode: "production" },
    ]);

    expect(held).toStrictEqual({ server: { watch: { ignored: ["**/coverage/**"] } } });
  });

  it("resolves the index specifier to its resolved identifier", async () => {
    await expect(resolved(specimens({ patterns: PATTERNS }), ID)).resolves.toBe(RESOLVED);
  });

  it("returns undefined for any other specifier", async () => {
    await expect(resolved(specimens({ patterns: PATTERNS }), "react")).resolves.toBeUndefined();
  });

  it("serves an index module exporting pages", async () => {
    await expect(index()).resolves.toMatch(/export const pages/u);
  });

  it("appends a hot update accept handler to a listed specimen", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return [
        await transformed(plugin, hookContext(), BADGE, scratch.path("src/badge.specimen.tsx")),
        await transformed(plugin, hookContext(), BADGE, scratch.path("src/badge.specimen.tsx?raw")),
        await transformed(plugin, hookContext(), "export const a = 1;\n", scratch.path("src/a.ts")),
      ];
    });

    expect(held[0]).toBe(
      `${BADGE}if (import.meta.hot) import.meta.hot.accept((replaced) => { if (replaced !== undefined) ` +
        'window.dispatchEvent(new CustomEvent("specimen:updated", ' +
        '{ detail: { module: replaced, id: "data/badge" } })); });\n',
    );
    expect(held.slice(1)).toStrictEqual([undefined, undefined]);
  });

  it("lists the page a specimen declares", async () => {
    await expect(index()).resolves.toMatch(/id: "data\/badge"/u);
  });

  it("lists the group a specimen declares", async () => {
    await expect(index()).resolves.toMatch(/group: "Data"/u);
  });

  it("names the package the specimen belongs to", async () => {
    await expect(index()).resolves.toMatch(/package: "@kit\/data"/u);
  });

  it("returns undefined when the hot update hook has no environment", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);

      return Reflect.apply(hookOf(plugin, "hotUpdate"), { environment: undefined }, [
        {
          file: scratch.path("src/badge/badge.ts"),
          modules: [],
          read: (): string => "",
          timestamp: Date.now(),
          type: "update",
        },
      ]);
    });

    expect(held).toBeUndefined();
  });

  it("reads a typed file again when a bundled environment reports it changed", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);
      const file = scratch.path("src/badge/badge.ts");

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);
      scratch.write({ "src/badge/badge.ts": probed(scratch.read("src/badge/badge.ts")) });
      await changed(plugin, hookContext([], "serve", true), file, "update");

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).toContain('"probe"');
  });

  it("reads no typed file again when the environment is not bundled", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);
      const file = scratch.path("src/badge/badge.ts");

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);
      scratch.write({ "src/badge/badge.ts": probed(scratch.read("src/badge/badge.ts")) });
      await changed(plugin, hookContext(), file, "update");

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).not.toContain('"probe"');
  });

  it("returns undefined for a module this plugin does not serve", async () => {
    const held = await serving(TREE, (plugin) => loaded(plugin, "virtual:other"));

    expect(held).toBeUndefined();
  });

  it("adds the stamp to the files the index watches", async () => {
    const watched = await serving(TREE, async (plugin) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      return context.watched;
    });

    expect(watched).toHaveLength(1);
    expect(watched[0]?.endsWith("/index")).toBe(true);
  });

  it("rewrites the stamp when a specimen appears in a bundled environment", async () => {
    const stamps = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ "src/chip.specimen.tsx": BADGE.replace("data/badge", "data/chip") });
      await changed(
        plugin,
        hookContext([], "serve", true),
        scratch.path("src/chip.specimen.tsx"),
        "create",
      );

      return { after: readFileSync(stamp, "utf8"), before };
    });

    expect(stamps.after).not.toBe(stamps.before);
  });

  it("rewrites the stamp when a specimen disappears in a bundled environment", async () => {
    const stamps = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      await changed(
        plugin,
        hookContext([], "serve", true),
        scratch.path("src/badge.specimen.tsx"),
        "delete",
      );

      return { after: readFileSync(stamp, "utf8"), before };
    });

    expect(stamps.after).not.toBe(stamps.before);
  });

  it("leaves the stamp alone when a scene changed in a bundled environment", async () => {
    const stamps = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ "src/badge.specimen.tsx": BADGE.replace("<Badge />", "<Badge>x</Badge>") });
      await changed(
        plugin,
        hookContext([], "serve", true),
        scratch.path("src/badge.specimen.tsx"),
        "update",
      );

      return { after: readFileSync(stamp, "utf8"), before };
    });

    expect(stamps.after).toBe(stamps.before);
  });

  it("rewrites the stamp when a page changed its declared metadata in a bundled environment", async () => {
    const stamps = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ "src/badge.specimen.tsx": BADGE.replace('group: "Data"', 'group: "Facts"') });
      await changed(
        plugin,
        hookContext([], "serve", true),
        scratch.path("src/badge.specimen.tsx"),
        "update",
      );

      return { after: readFileSync(stamp, "utf8"), before };
    });

    expect(stamps.after).not.toBe(stamps.before);
  });

  it("leaves the stamp alone when the environment is not bundled", async () => {
    const stamps = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED, context);

      const stamp = context.watched[0] ?? "";
      const before = readFileSync(stamp, "utf8");

      scratch.write({ "src/chip.specimen.tsx": BADGE.replace("data/badge", "data/chip") });
      await changed(plugin, hookContext(), scratch.path("src/chip.specimen.tsx"), "create");

      return { after: readFileSync(stamp, "utf8"), before };
    });

    expect(stamps.after).toBe(stamps.before);
  });

  it("adds each pattern's starting directory to the watcher", async () => {
    const watched: string[] = [];

    await serving(TREE, (plugin, scratch) => {
      Reflect.apply(hookOf(plugin, "configureServer"), undefined, [
        {
          watcher: {
            add: (paths: readonly string[]): void => {
              watched.push(...paths);
            },
          },
        },
      ]);

      return Promise.resolve(scratch.root);
    });

    expect(watched).toHaveLength(1);
  });

  it("reloads the index when a page changed the metadata it declares", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return updating(
        plugin,
        scratch.path("src/badge.specimen.tsx"),
        'export default specimen({ id: "data/chip", scenes: [] });\n',
      );
    });

    expect(held).toHaveLength(1);
  });

  it("leaves the index alone when an edit changed a scene", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return updating(plugin, scratch.path("src/badge.specimen.tsx"), BADGE);
    });

    expect(held).toBeUndefined();
  });

  it("returns undefined when a file the index lists no page for changed", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return updating(plugin, scratch.path("src/badge.ts"), "export const a = 1;\n");
    });

    expect(held).toBeUndefined();
  });

  it("throws when the patterns match no file", async () => {
    await expect(index({ "src/a.ts": "" })).rejects.toThrow(/matched no file/u);
  });

  it("writes a props loader onto every page of the index", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      return (await loaded(plugin, RESOLVED)) ?? "";
    });

    expect(held).toMatch(/props: \(\) => import\("virtual:specimen-props\/badge"\)/u);
  });

  it("serves the parts a page's components accept", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).toMatch(/export const parts = \{"BadgeProps"/u);
  });

  it("serves the dropped counts for each part", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).toMatch(/export const dropped = \{"BadgeProps": \{"conditions": 2/u);
  });

  it("resolves a props specifier to itself", async () => {
    await expect(
      resolved(specimens({ patterns: PATTERNS, props: {} }), `${PROPS}badge`),
    ).resolves.toBe(`${PROPS}badge`);
  });

  it("returns undefined for a props module when the plugin reads no props", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = specimens({ patterns: PATTERNS });

      await configured(plugin, { command: "serve", root: scratch.root });
      await loaded(plugin, RESOLVED);

      return loaded(plugin, `${PROPS}badge`);
    });

    expect(held).toBeUndefined();
  });

  it("reloads every loaded props module when a typed file changed", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);

      return updating(plugin, scratch.path("src/badge/badge.ts"), "", [`${PROPS}badge`]);
    });

    expect(held).toHaveLength(1);
  });

  it("reloads a loaded props module when the index refused another specimen", async () => {
    const broken = { ...kit(), "src/broken.specimen.tsx": "export default 1;\n" };
    const held = await withScratchWorkspaceAsync(broken, async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);

      return updating(plugin, scratch.path("src/badge/badge.ts"), "", [`${PROPS}badge`]);
    });

    expect(held).toHaveLength(1);
  });

  it("stops the compiler when the bundle closes", async () => {
    const closed = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${PROPS}badge`);

      return Reflect.apply(hookOf(plugin, "closeBundle"), undefined, []);
    });

    expect(closed).toBeUndefined();
  });

  it("returns undefined when the bundle closes with no compiler started", async () => {
    const closed = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      return Reflect.apply(hookOf(plugin, "closeBundle"), undefined, []);
    });

    expect(closed).toBeUndefined();
  });
});
