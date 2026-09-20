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
import { FRAGMENTS, ID, PROPS } from "#options.ts";
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
  it("names itself for the factory that built it", () => {
    expect(specimens({ patterns: PATTERNS }).name).toBe("stealth:specimens");
  });

  it("keeps the watcher off a coverage report", () => {
    const plugin = specimens({ patterns: PATTERNS });
    const held: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
      {},
      { command: "serve", mode: "test" },
    ]);

    expect(held).toMatchObject({ server: { watch: { ignored: ["**/coverage/**"] } } });
  });

  it("names the chunk a page's module and its fragments land in after the page", async () => {
    const named = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      const config: unknown = Reflect.apply(hookOf(plugin, "config"), undefined, [
        {},
        { command: "build", mode: "production" },
      ]);
      const group: unknown = (config as UserConfig).build?.rolldownOptions?.output;
      const name = (
        group as { codeSplitting: { groups: [{ name: (id: string) => null | string }] } }
      ).codeSplitting.groups[0].name;

      return [
        name(scratch.path("src/badge.specimen.tsx")),
        name(`${scratch.path("src/badge.specimen.tsx")}?rolldown-lazy=1`),
        name(`${FRAGMENTS}data/badge`),
        name(scratch.path("src/other.ts")),
      ];
    });

    expect(named).toStrictEqual(["data-badge", "data-badge", "data-badge", null]);
  });

  it("resolves the index specifier to an identifier of its own", async () => {
    await expect(resolved(specimens({ patterns: PATTERNS }), ID)).resolves.toBe(RESOLVED);
  });

  it("resolves a fragments specifier to an identifier of its own", async () => {
    await expect(
      resolved(specimens({ patterns: PATTERNS }), `${FRAGMENTS}data/badge`),
    ).resolves.toBe(`${FRAGMENTS}data/badge`);
  });

  it("declines any other specifier", async () => {
    await expect(resolved(specimens({ patterns: PATTERNS }), "react")).resolves.toBeUndefined();
  });

  it("serves the index as an exported list of pages", async () => {
    await expect(index()).resolves.toMatch(/export const pages/u);
  });

  it("makes a listed specimen accept its own hot update and report the page it declares", async () => {
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

  it("makes a page's fragments accept their own hot update", async () => {
    const held = await serving(TREE, async (plugin) => {
      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${FRAGMENTS}data/badge`, hookContext())) ?? "";
    });

    expect(held).toContain('{ detail: { fragments: replaced, id: "data/badge" } }');
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

  it("serves one page's scenes as source", async () => {
    const held = await serving(TREE, async (plugin) => {
      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${FRAGMENTS}data/badge`, hookContext())) ?? "";
    });

    expect(held).toMatch(/export const fragments/u);
  });

  it("cuts the scene a page declares into its own snippet", async () => {
    const held = await serving(TREE, async (plugin) => {
      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${FRAGMENTS}data/badge`, hookContext())) ?? "";
    });

    expect(held).toMatch(/Sizes/u);
  });

  it("watches the page's file from its fragments", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      const context = hookContext();

      await loaded(plugin, RESOLVED);
      await loaded(plugin, `${FRAGMENTS}data/badge`, context);

      return context.watched.map((file) => file.slice(scratch.root.length + 1));
    });

    expect(held).toStrictEqual(["src/badge.specimen.tsx"]);
  });

  it("answers a bundler that hands the update no environment nothing", async () => {
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

  it("reads a typed file afresh after a bundling server reports it changed", async () => {
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

  it("leaves a typed file to the hot update where the server serves a module per file", async () => {
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

  it("returns nothing for a module it does not own", async () => {
    const held = await serving(TREE, (plugin) => loaded(plugin, "virtual:other"));

    expect(held).toBeUndefined();
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

  it("reloads a page's fragments when its file changed", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return updating(plugin, scratch.path("src/badge.specimen.tsx"), BADGE, [
        `${FRAGMENTS}data/badge`,
      ]);
    });

    expect(held).toHaveLength(1);
  });

  it("reaches nothing of its own when a file it lists no page for changed", async () => {
    const held = await serving(TREE, async (plugin, scratch) => {
      await loaded(plugin, RESOLVED);

      return updating(plugin, scratch.path("src/badge.ts"), "export const a = 1;\n");
    });

    expect(held).toBeUndefined();
  });

  it("throws when the patterns match no file", async () => {
    await expect(index({ "src/a.ts": "" })).rejects.toThrow(/matched no file/u);
  });

  it("carries a props loader on every page of the index", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      return (await loaded(plugin, RESOLVED)) ?? "";
    });

    expect(held).toMatch(/props: \(\) => import\("virtual:specimen-props\/badge"\)/u);
  });

  it("serves what a page's components accept", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).toMatch(/export const parts = \{"BadgeProps"/u);
  });

  it("serves what each part resolves to that no table draws", async () => {
    const held = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      await loaded(plugin, RESOLVED);

      return (await loaded(plugin, `${PROPS}badge`)) ?? "";
    });

    expect(held).toMatch(/export const dropped = \{"BadgeProps":\{"conditions":2/u);
  });

  it("resolves a props specifier to an identifier of its own", async () => {
    await expect(
      resolved(specimens({ patterns: PATTERNS, props: {} }), `${PROPS}badge`),
    ).resolves.toBe(`${PROPS}badge`);
  });

  it("declines a props module when the repository reads no props", async () => {
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

  it("reloads nothing for a file the index refused while reading props", async () => {
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

  it("stops without complaint when no compiler was started", async () => {
    const closed = await withScratchWorkspaceAsync(kit(), async (scratch) => {
      const plugin = await reading(scratch);

      return Reflect.apply(hookOf(plugin, "closeBundle"), undefined, []);
    });

    expect(closed).toBeUndefined();
  });
});
