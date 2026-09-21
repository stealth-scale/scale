import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { type ViteDevServer } from "vite";
import { describe, expect, it } from "vitest";

import {
  changed,
  configured,
  created,
  hookContext,
  loaded,
  manifest,
  packageFiles,
  removed,
  resolved,
  type ScratchFiles,
  type ScratchWorkspace,
  started,
  transformed,
  updated,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";

import { layerDeclaration, resolveOptions, scratchDir } from "#options.ts";
import { stylesheet } from "#theme/stylesheet.ts";

const OPTIONS = { systemPackage: "@acme/design" };

const DECLARED = layerDeclaration(resolveOptions().layers);

const VIRTUAL = "virtual:stealth-theme.css";

const RESOLVED = { ssr: {} };

function page(color: string): string {
  return `import { css } from "@acme/design";\n\nexport const Page = () => css({ color: "${color}" });\n`;
}

function statement(fonts = "[]"): string {
  return `export default { themes: [{ fonts: ${fonts}, name: "acme", variant: {} }] };\n`;
}

const DESIGN = packageFiles(
  "node_modules/@acme/design",
  { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/design", type: "module" },
  { "index.js": "export {};\n", "theme.js": 'export default { name: "@acme/design" };\n' },
);

const KIT = packageFiles(
  "node_modules/@acme/kit",
  {
    exports: { ".": "./index.js", "./theme": "./theme.js" },
    name: "@acme/kit",
    peerDependencies: { "@acme/design": "*" },
    type: "module",
  },
  {
    "index.js": "export {};\n",
    "theme.js":
      'export default { name: "@acme/kit", theme: { extend: { recipes: { badge: { className: "badge", base: { outlineOffset: "11px" } } } } } };\n',
  },
);

const APP: ScratchFiles = {
  ...DESIGN,
  "package.json": manifest({
    dependencies: { "@acme/design": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "src/page.tsx": page("red"),
  "theme.config.ts": statement(),
};

const LINKED: ScratchFiles = {
  ...DESIGN,
  ...packageFiles(
    "packages/kit",
    {
      exports: { ".": "./index.js", "./theme": "./theme.js" },
      name: "@acme/kit",
      peerDependencies: { "@acme/design": "*" },
      type: "module",
    },
    { "index.js": "export {};\n", "theme.js": 'export default { name: "@acme/kit" };\n' },
  ),
  "package.json": manifest({
    dependencies: { "@acme/design": "*", "@acme/kit": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "src/page.tsx": page("red"),
  "theme.config.ts": statement(),
};

function linked(workspace: ScratchWorkspace): void {
  mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });
  symlinkSync(workspace.path("packages/kit"), workspace.path("node_modules/@acme/kit"), "dir");
}

/**
 * The part of an update a specification chooses: the file, the modules the server resolved for
 * it, and the time the server reports it under.
 */
interface Report {
  readonly file: string;
  readonly modules?: ReadonlyArray<{ id: string }>;
  readonly timestamp?: number;
}

/**
 * Reports an update to the plugin under a time of the specification's choosing, the way a server
 * reports one change to each of its environments.
 */
function reported(
  plugin: ReturnType<typeof stylesheet>,
  context: object,
  report: Report,
): Promise<unknown> {
  const hook: unknown = plugin.hotUpdate;

  if (typeof hook !== "function") throw new Error("the plugin has no hotUpdate hook");

  return Promise.resolve(
    Reflect.apply(hook, context, [
      {
        file: report.file,
        modules: report.modules ?? [],
        read: (): Promise<string> => Promise.resolve(""),
        timestamp: report.timestamp,
        type: "update",
      },
    ]),
  );
}

/**
 * Names the environment of a context, the way a server names each of its environments.
 */
function named(
  context: ReturnType<typeof hookContext>,
  name: string,
): ReturnType<typeof hookContext> {
  Object.assign(context.environment, { name });

  return context;
}

const COLLIDING = packageFiles(
  "node_modules/@acme/design",
  { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/design", type: "module" },
  {
    "index.js": "export {};\n",
    "theme.js":
      'export default { name: "@acme/design", theme: { extend: { tokens: { colors: { A: { value: "#111" }, a: { value: "#222" } } } } } };\n',
  },
);

const COLLISION: ScratchFiles = {
  ...APP,
  ...COLLIDING,
  "src/page.tsx":
    'import { css } from "@acme/design";\n\nexport const Page = () => [css({ color: "A" }), css({ color: "a" })];\n',
};

/**
 * Strips the environment off a context, the way a server that bundles calls a hook.
 *
 * @remarks
 *   Typed as the context it was built from, because the drivers take one, and the plugin under
 *   test reads the environment as absent either way.
 */
function bundling(context: ReturnType<typeof hookContext>): ReturnType<typeof hookContext> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a bundling server hands the hook a context typed as carrying an environment and carrying none, which is the case under test
  return { ...context, environment: undefined } as unknown as ReturnType<typeof hookContext>;
}

async function serving(
  plugin: ReturnType<typeof stylesheet>,
  watched: string[],
  invalidated: string[] = [],
): Promise<void> {
  const server = {
    environments: {
      ssr: {
        moduleGraph: {
          onFileChange(file: string): void {
            invalidated.push(file);
          },
        },
      },
    },
    watcher: {
      add(paths: readonly string[]): void {
        watched.push(...paths);
      },
    },
  } as unknown as ViteDevServer;
  const hook = plugin.configureServer as (server: ViteDevServer) => unknown;

  await hook(server);
}

interface Compiled {
  readonly context: ReturnType<typeof hookContext>;
  readonly plugin: ReturnType<typeof stylesheet>;
  readonly sheet: string;
}

async function compiled(workspace: ScratchWorkspace, graphed = false): Promise<Compiled> {
  const plugin = stylesheet(OPTIONS);
  const sheet = workspace.path("styles.css");
  const context = hookContext(graphed ? [sheet] : []);

  await configured(plugin, { ...RESOLVED, root: workspace.root });
  await started(plugin, context);

  return { context, plugin, sheet };
}

describe("stylesheet", () => {
  it("names the plugin for its factory", () => {
    expect(stylesheet().name).toBe("stealth:theme.stylesheet");
  });

  it("runs before the bundler's own plugins", () => {
    expect(stylesheet().enforce).toBe("pre");
  });

  it("resolves the stylesheet subpath to a module of its own", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { plugin } = await compiled(workspace);

      return [
        await resolved(plugin, "@acme/design/styles.css"),
        await resolved(plugin, "some-other/styles.css"),
      ];
    });

    expect(found).toStrictEqual([VIRTUAL, undefined]);
  });

  it("keeps the query of a request when resolving the stylesheet", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { plugin } = await compiled(workspace);

      return resolved(plugin, "@acme/design/styles.css?direct");
    });

    expect(found).toBe(`${VIRTUAL}?direct`);
  });

  it("loads the virtual stylesheet with the cascade order and nothing else", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { plugin } = await compiled(workspace);

      return [await loaded(plugin, VIRTUAL), await loaded(plugin, "some-other.css")];
    });

    expect(found).toStrictEqual([`${DECLARED}\n`, undefined]);
  });

  it("loads the virtual stylesheet and starts the compiler where nothing has yet", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);

      await configured(plugin, { ...RESOLVED, root: workspace.root });

      return loaded(plugin, VIRTUAL);
    });

    expect(found).toBe(`${DECLARED}\n`);
  });

  it("starts the compiler without waiting for it under a dev server", async () => {
    const found = await withScratchWorkspaceAsync(LINKED, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const watched: string[] = [];

      linked(workspace);
      await serving(plugin, watched);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext());

      const before = watched.length;

      await loaded(plugin, VIRTUAL);

      return { after: watched.length, before };
    });

    expect(found).toStrictEqual({ after: 1, before: 0 });
  });

  it("waits for the compiler under a build", async () => {
    const found = await withScratchWorkspaceAsync(LINKED, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const watched: string[] = [];

      linked(workspace);
      await serving(plugin, watched);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext([], "build"));

      return watched.length;
    });

    expect(found).toBe(1);
  });

  it("tries the assembly again after it failed", async () => {
    const files = { ...APP, "package.json": manifest({ name: "@acme/app", type: "module" }) };
    const found = await withScratchWorkspaceAsync(files, async (workspace) => {
      const plugin = stylesheet(OPTIONS);

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext());

      const failed = await loaded(plugin, VIRTUAL).then(
        () => "loaded",
        (error: unknown) => (error instanceof Error ? error.message : "failed"),
      );

      workspace.write({ "package.json": APP["package.json"] ?? "" });

      return [failed, await loaded(plugin, VIRTUAL)];
    });

    expect(found[0]).toContain("does not depend on @acme/design");
    expect(found[1]).toBe(`${DECLARED}\n`);
  });

  it("compiles through an environment of its own when the server's runner is absent", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);

      await serving(plugin, []);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext());

      return loaded(plugin, VIRTUAL);
    });

    expect(found).toBe(`${DECLARED}\n`);
  });

  it("hands the source directory of every workspace package to the server's watcher", async () => {
    const added = await withScratchWorkspaceAsync(LINKED, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const watched: string[] = [];

      linked(workspace);
      await serving(plugin, watched);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext());
      await loaded(plugin, VIRTUAL);

      return watched.map((at) => at.slice(workspace.root.length + 1));
    });

    expect(added).toStrictEqual(["packages/kit/src"]);
  });

  it("hands nothing to the watcher when the graph holds no workspace package", async () => {
    const added = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const watched: string[] = [];

      await serving(plugin, watched);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, hookContext());
      await loaded(plugin, VIRTUAL);

      return watched;
    });

    expect(added).toStrictEqual([]);
  });

  it("writes nothing into the application and renders the configuration under its scratch", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { plugin } = await compiled(workspace);

      await loaded(plugin, VIRTUAL);

      return {
        rendered: existsSync(join(scratchDir(workspace.root), "stylesheet.config.mjs")),
        written: workspace.files().filter((file) => file.startsWith("node_modules/.")),
      };
    });

    expect(written).toStrictEqual({ rendered: true, written: [] });
  });

  it("appends the compiled rules to a stylesheet that declares the cascade order", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain(DECLARED);
    expect(written).toContain("c-red");
  });

  it("appends the compiled rules to a stylesheet whose declaration has no spaces", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      return transformed(plugin, context, "@layer reset,base,tokens,recipes,utilities;\n", sheet);
    });

    expect(written).toContain("c-red");
  });

  it("passes over a stylesheet without the declaration", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin } = await compiled(workspace);

      return transformed(plugin, context, ".a { color: red }", workspace.path("other.css"));
    });

    expect(written).toBeUndefined();
  });

  it("passes over a file that is not a stylesheet", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin } = await compiled(workspace);

      return transformed(plugin, context, DECLARED, workspace.path("src/page.tsx"));
    });

    expect(written).toBeUndefined();
  });

  it("watches the statement and the source it compiled from", async () => {
    const watched = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);

      return context.watched.map((file) => file.slice(workspace.root.length + 1));
    });

    expect(watched).toContain("theme.config.ts");
    expect(watched).toContain("src/page.tsx");
    expect(watched).toContain("package.json");
    expect(watched).toContain("node_modules/@acme/design/package.json");
  });

  it("warns when no package beside the system package contributes a preset", async () => {
    const warned = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);

      return context.warned;
    });

    expect(warned).toHaveLength(1);
    expect(warned[0]).toContain("no component's rules");
  });

  it("compiles once for every stylesheet that declares the cascade order", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const first = await transformed(plugin, context, DECLARED, sheet);
      const second = await transformed(plugin, context, DECLARED, workspace.path("more.css"));

      return { same: first === second, warned: context.warned.length };
    });

    expect(found).toStrictEqual({ same: true, warned: 1 });
  });

  it("compiles a contributor's recipe and stays quiet", async () => {
    const files = {
      ...APP,
      ...KIT,
      "package.json": manifest({
        dependencies: { "@acme/design": "*", "@acme/kit": "*" },
        name: "@acme/app",
        type: "module",
      }),
      "theme.config.ts":
        'export default { static: "*", themes: [{ name: "acme", variant: {} }] };\n',
    };
    const found = await withScratchWorkspaceAsync(files, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const written = await transformed(plugin, context, DECLARED, sheet);

      return { badge: written?.includes(".badge"), warned: context.warned };
    });

    expect(found).toStrictEqual({ badge: true, warned: [] });
  });

  it("recompiles from disk when a source file changes without restarting the compiler", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain("c-blue");
  });

  it("compiles a source file that appears under the scanned globs", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/more.tsx": page("green") });
      await created(plugin, context, workspace.path("src/more.tsx"));

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain("c-green");
  });

  it("invalidates the stylesheet when a source file is deleted", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);
      const file = workspace.path("src/page.tsx");

      await transformed(plugin, context, DECLARED, sheet);
      rmSync(file);
      await removed(plugin, context, file);

      return context.invalidated.map((each) => each.slice(workspace.root.length + 1));
    });

    expect(invalidated).toStrictEqual(["styles.css"]);
  });

  it("restarts the compiler when the statement changes", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "theme.config.ts": statement().replace('"acme"', '"forged"') });
      await updated(plugin, context, workspace.path("theme.config.ts"));

      return readFileSync(join(scratchDir(workspace.root), "stylesheet.config.mjs"), "utf8");
    });

    expect(written).toContain('"forged"');
  });

  it("serves the rules of the restarted compiler rather than the ones compiled before", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({
        "theme.config.ts":
          'export default { themes: [{ fonts: [], name: "acme", variant: { tokens: { colors: { late: { value: "#abc" } } } } }] };\n',
      });
      await updated(plugin, context, workspace.path("theme.config.ts"));

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain("--colors-late");
  });

  it("invalidates the stylesheet it compiled into when a source file changes", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("green") });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return context.invalidated.map((file) => file.slice(workspace.root.length + 1));
    });

    expect(invalidated).toStrictEqual(["styles.css"]);
  });

  it("applies a change once however many times the server reports it and invalidates each graph", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);
      const other = hookContext([sheet]);
      const file = workspace.path("src/page.tsx");

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("green") });

      const compiles = context.warned.length;

      await reported(plugin, context, { file, timestamp: 7 });
      await reported(plugin, other, { file, timestamp: 7 });

      return {
        compiles: context.warned.length + other.warned.length - compiles,
        invalidated: [...context.invalidated, ...other.invalidated].map((each) =>
          each.slice(workspace.root.length + 1),
        ),
      };
    });

    expect(found).toStrictEqual({ compiles: 1, invalidated: ["styles.css", "styles.css"] });
  });

  it("applies every change a server that reports no time makes to one file", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const file = workspace.path("src/page.tsx");

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("green") });
      await reported(plugin, bundling(context), { file });
      workspace.write({ "src/page.tsx": page("blue") });
      await reported(plugin, bundling(context), { file });

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain("c-blue");
  });

  it("invalidates nothing when a change compiles to the rules the stylesheet already holds", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": `// a comment\n${page("red")}` });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return context.invalidated;
    });

    expect(found).toStrictEqual([]);
  });

  it("applies a change a bundling server reports with no environment and leaves the modules alone", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });

      const answered = await reported(plugin, bundling(context), {
        file: workspace.path("src/page.tsx"),
        timestamp: 9,
      });

      return { answered, written: await transformed(plugin, context, DECLARED, sheet) };
    });

    expect(found.answered).toStrictEqual([]);
    expect(found.written).toContain("c-blue");
  });

  it("leaves a watch change alone under a bundling server with no environment", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });
      await changed(plugin, bundling(context), workspace.path("src/page.tsx"), "update");

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).not.toContain("c-blue");
  });

  it("compiles from the changed source after a bundling server reports the change", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const bundled = hookContext([], "serve", true);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });
      await changed(plugin, bundled, workspace.path("src/page.tsx"), "update");

      return transformed(plugin, bundled, DECLARED, sheet);
    });

    expect(written).toContain("c-blue");
  });

  it("invalidates the server runner's copy of a file a bundling server reports changed", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const invalidated: string[] = [];
      const bundled = hookContext([], "serve", true);

      await serving(plugin, [], invalidated);
      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, bundled);
      await loaded(plugin, VIRTUAL);
      await changed(plugin, bundled, workspace.path("src/page.tsx"), "update");

      return invalidated.map((at) => at.slice(workspace.root.length + 1));
    });

    expect(found).toStrictEqual(["src/page.tsx"]);
  });

  it("applies a change reported while the first assembly is under way", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const context = hookContext();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, context);
      workspace.write({ "src/page.tsx": page("blue") });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return transformed(plugin, context, DECLARED, workspace.path("styles.css"));
    });

    expect(written).toContain("c-blue");
    expect(written).not.toContain("c-red");
  });

  it("assembles again when the statement changes while the first assembly is under way", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const context = hookContext();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, context);
      workspace.write({ "theme.config.ts": statement().replace('"acme"', '"forged"') });
      await updated(plugin, context, workspace.path("theme.config.ts"));

      return readFileSync(join(scratchDir(workspace.root), "stylesheet.config.mjs"), "utf8");
    });

    expect(written).toContain('"forged"');
  });

  it("keeps a change reported after a failed assembly for the assembly that follows", async () => {
    const files = { ...APP, "package.json": manifest({ name: "@acme/app", type: "module" }) };
    const written = await withScratchWorkspaceAsync(files, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const context = hookContext();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, context);
      await loaded(plugin, VIRTUAL).catch(() => {});
      workspace.write({ "package.json": APP["package.json"] ?? "", "src/page.tsx": page("blue") });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return transformed(plugin, context, DECLARED, workspace.path("styles.css"));
    });

    expect(written).toContain("c-blue");
  });

  it("keeps another environment's stylesheet when one environment's graph lacks it", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const sheet = workspace.path("styles.css");
      const client = named(hookContext([sheet]), "client");
      const ssr = named(hookContext([]), "ssr");
      const file = workspace.path("src/page.tsx");

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, client);
      await transformed(plugin, client, DECLARED, sheet);
      await transformed(plugin, ssr, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("green") });
      await reported(plugin, ssr, { file, timestamp: 21 });
      await reported(plugin, client, { file, timestamp: 21 });

      return {
        client: client.invalidated.map((each) => each.slice(workspace.root.length + 1)),
        ssr: ssr.invalidated,
      };
    });

    expect(invalidated).toStrictEqual({ client: ["styles.css"], ssr: [] });
  });

  it("leaves the stylesheet out of the changed modules when the rules did not change", async () => {
    const answered = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);
      const file = workspace.path("src/page.tsx");

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": `// a comment\n${page("red")}` });

      const modules = await reported(plugin, context, {
        file,
        modules: [{ id: sheet }, { id: file }],
        timestamp: 31,
      });

      return { file, modules };
    });

    expect(answered.modules).toStrictEqual([{ id: answered.file }]);
  });

  it("fails a build on a class two names collide on", async () => {
    await expect(
      withScratchWorkspaceAsync(COLLISION, async (workspace) => {
        const plugin = stylesheet(OPTIONS);
        const context = hookContext([], "build");

        await configured(plugin, { ...RESOLVED, root: workspace.root });
        await started(plugin, context);

        return transformed(plugin, context, DECLARED, workspace.path("styles.css"));
      }),
    ).rejects.toThrow("the stylesheet did not compile");
  });

  it("serves the rules and reports the collision under a dev server", async () => {
    const found = await withScratchWorkspaceAsync(COLLISION, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const written = await transformed(plugin, context, DECLARED, sheet);

      return { warned: context.warned.join("\n"), written: written?.includes("c-a") };
    });

    expect(found.written).toBe(true);
    expect(found.warned).toContain("naming/collision");
  });

  it("keeps the rules compiled before an error under a dev server", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);
      const before = await transformed(plugin, context, DECLARED, sheet);

      workspace.write({ ...COLLIDING, "src/page.tsx": COLLISION["src/page.tsx"] ?? "" });
      await updated(plugin, context, workspace.path("node_modules/@acme/design/theme.js"));

      const after = await transformed(plugin, context, DECLARED, sheet);

      return { same: before === after, warned: context.warned.join("\n") };
    });

    expect(found.same).toBe(true);
    expect(found.warned).toContain("keeps the rules compiled before");
  });

  it("forgets a stylesheet the graph no longer holds", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, false);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("green") });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return context.invalidated;
    });

    expect(invalidated).toStrictEqual([]);
  });

  it("leaves an update alone before anything was compiled", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const context = hookContext([workspace.path("styles.css")]);

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await updated(plugin, context, workspace.path("src/page.tsx"));

      return context.invalidated;
    });

    expect(invalidated).toStrictEqual([]);
  });

  it("leaves an update to a file outside the scanned globs alone", async () => {
    const invalidated = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace, true);

      await transformed(plugin, context, DECLARED, sheet);
      await updated(plugin, context, workspace.path("README.md"));

      return context.invalidated;
    });

    expect(invalidated).toStrictEqual([]);
  });

  it("compiles from the changed source after a watched build reports the change", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);
      const context = hookContext([], "build");
      const sheet = workspace.path("styles.css");

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, context);
      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });
      await changed(plugin, context, workspace.path("src/page.tsx"), "update");

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).toContain("c-blue");
  });

  it("leaves a watch change to the hot update under a dev server", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const { context, plugin, sheet } = await compiled(workspace);

      await transformed(plugin, context, DECLARED, sheet);
      workspace.write({ "src/page.tsx": page("blue") });
      await changed(plugin, context, workspace.path("src/page.tsx"), "update");

      return transformed(plugin, context, DECLARED, sheet);
    });

    expect(written).not.toContain("c-blue");
  });

  it("throws when the application does not depend on the system package", async () => {
    const files = { ...APP, "package.json": manifest({ name: "@acme/app", type: "module" }) };

    await expect(
      withScratchWorkspaceAsync(files, async (workspace) => {
        const { plugin } = await compiled(workspace);

        return loaded(plugin, VIRTUAL);
      }),
    ).rejects.toThrow("does not depend on @acme/design");
  });

  it("resolves each font package a theme names to its file", async () => {
    const files = {
      ...APP,
      ...packageFiles(
        "node_modules/@f/face",
        { exports: { ".": "./index.css" }, name: "@f/face" },
        { "index.css": "@font-face { font-family: X; }\n" },
      ),
      "package.json": manifest({
        dependencies: { "@acme/design": "*", "@f/face": "*" },
        name: "@acme/app",
        type: "module",
      }),
      "theme.config.ts": statement('["@f/face"]'),
    };
    const found = await withScratchWorkspaceAsync(files, async (workspace) => {
      const { plugin } = await compiled(workspace);
      const at = workspace.path("node_modules/@f/face/index.css");

      return {
        imported: (await loaded(plugin, VIRTUAL))?.includes(`@import "${at}";`),
        resolved: (await resolved(plugin, "@f/face")) === at,
      };
    });

    expect(found).toStrictEqual({ imported: true, resolved: true });
  });

  it("imports a face nothing installed by its name", async () => {
    const files = { ...APP, "theme.config.ts": statement('["@f/absent"]') };
    const found = await withScratchWorkspaceAsync(files, async (workspace) => {
      const { plugin } = await compiled(workspace);

      return {
        imported: (await loaded(plugin, VIRTUAL))?.includes('@import "@f/absent";'),
        resolved: await resolved(plugin, "@f/absent"),
      };
    });

    expect(found).toStrictEqual({ imported: true, resolved: undefined });
  });
});
