import { mkdirSync, rmSync, symlinkSync } from "node:fs";
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

import { layerDeclaration, resolveOptions } from "#options.ts";
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

async function serving(plugin: ReturnType<typeof stylesheet>, watched: string[]): Promise<void> {
  const server = {
    environments: { ssr: {} },
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

  it("loads the virtual stylesheet with the cascade order alone before the compiler starts", async () => {
    const found = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const plugin = stylesheet(OPTIONS);

      await configured(plugin, { ...RESOLVED, root: workspace.root });

      return loaded(plugin, VIRTUAL);
    });

    expect(found).toBe(`${DECLARED}\n`);
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

      return watched;
    });

    expect(added).toStrictEqual([]);
  });

  it("writes nothing into the application but the rendered configuration", async () => {
    const written = await withScratchWorkspaceAsync(APP, async (workspace) => {
      await compiled(workspace);

      return workspace.files().filter((file) => file.startsWith("node_modules/.theme/"));
    });

    expect(written).toStrictEqual(["node_modules/.theme/stylesheet.config.mjs"]);
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

      return workspace.read("node_modules/.theme/stylesheet.config.mjs");
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
      withScratchWorkspaceAsync(files, (workspace) => compiled(workspace)),
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
