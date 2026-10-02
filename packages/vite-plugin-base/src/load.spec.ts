/**
 * Covers importing a workspace package through Vite, symlinked into a scratch workspace the way a
 * real install links it.
 *
 * @remarks
 *   The fixture package publishes its source under a custom condition and a built copy under
 *   `default`, so which copy comes back is the signal for whether the conditions reached the
 *   resolver. The condition is written first in the export map, because a resolver takes the first
 *   match. The source imports a Node built-in, which the runner externalises, and the statement
 *   imports the package along two paths, so the same fixture also exercises the file list.
 */

import { mkdirSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer, type ViteDevServer } from "vite";
import { describe, expect, it } from "vitest";

import { manifest, type ScratchWorkspace, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { imported, importer } from "#load.ts";

/**
 * The export condition the fixture package publishes its source under.
 */
const SOURCE = "acme-source";

/**
 * The shape of the statement module, whose `from` names the copy of the package that resolved.
 */
interface Statement {
  default: { from: string };
}

/**
 * An application depending on a package that publishes both its source and a built copy.
 */
const TREE = {
  "package.json": manifest({ dependencies: { "@acme/kit": "workspace:*" }, name: "@acme/app" }),
  "packages/kit/dist/index.js": 'export const from = "dist";\n',
  "packages/kit/package.json": manifest({
    exports: { ".": { "acme-source": "./src/index.ts", default: "./dist/index.js" } },
    name: "@acme/kit",
    type: "module",
  }),
  "packages/kit/src/index.ts":
    'import { sep } from "node:path";\n\nexport const from: string = sep.length === 1 ? "source" : "";\n',
  "src/other.ts": 'import { from } from "@acme/kit";\n\nexport const other = from;\n',
  "src/statement.ts":
    'import { from } from "@acme/kit";\n\nimport { other } from "./other.ts";\n\nexport default { from, other };\n',
};

/**
 * Runs a function against {@link TREE} with the package symlinked into `node_modules`, the way a
 * workspace install links it.
 */
function linked<Result>(run: (workspace: ScratchWorkspace) => Promise<Result>): Promise<Result> {
  return withScratchWorkspaceAsync(TREE, (workspace) => {
    mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });
    symlinkSync(workspace.path("packages/kit"), workspace.path("node_modules/@acme/kit"), "dir");

    return run(workspace);
  });
}

/**
 * The package's source after a change, which names its copy differently.
 */
const CHANGED = 'export const from: string = "changed";\n';

/**
 * Imports the statement through one importer, changes the package's source, optionally names it
 * to `invalidate`, and imports the statement again.
 *
 * @param invalidated - The files passed to `invalidate`, or undefined to call it not at all.
 * @returns The copy each import read, and whether the second import returned the first's module.
 */
function importedTwice(
  invalidated: (workspace: ScratchWorkspace) => readonly string[] | undefined,
): Promise<{ readonly from: readonly string[]; readonly same: boolean }> {
  return linked(async (workspace) => {
    const through = await importer({ conditions: [SOURCE, "node"], root: workspace.root });
    const file = workspace.path("src/statement.ts");

    try {
      const first = await through.import<Statement>(file);
      const files = invalidated(workspace);

      writeFileSync(workspace.path("packages/kit/src/index.ts"), CHANGED);

      if (files !== undefined) through.invalidate(files);

      const second = await through.import<Statement>(file);

      return {
        from: [first.module.default.from, second.module.default.from],
        same: first.module === second.module,
      };
    } finally {
      await through.close();
    }
  });
}

/**
 * Imports the statement under the source condition and returns the files behind it, relative to
 * the workspace root.
 */
function behindStatement(): Promise<readonly string[]> {
  return linked(async (workspace) => {
    const { files } = await imported<Statement>(workspace.path("src/statement.ts"), {
      conditions: [SOURCE, "node"],
      root: workspace.root,
    });

    return files.map((file) => file.slice(workspace.root.length + 1));
  });
}

/**
 * Imports the statement under the source condition and returns each loaded module's file,
 * relative to the workspace root, with its namespace.
 */
function loadedBehindStatement(): Promise<
  ReadonlyArray<readonly [string, Readonly<Record<string, unknown>>]>
> {
  return linked(async (workspace) => {
    const { loaded } = await imported<Statement>(workspace.path("src/statement.ts"), {
      conditions: [SOURCE, "node"],
      root: workspace.root,
    });

    return loaded.map(
      ({ exports, file }) => [file.slice(workspace.root.length + 1), exports] as const,
    );
  });
}

describe("load", () => {
  it("resolves a linked package to its source when conditions names that condition", async () => {
    const { module } = await linked((workspace) =>
      imported<Statement>(workspace.path("src/statement.ts"), {
        conditions: [SOURCE, "node"],
        root: workspace.root,
      }),
    );

    expect(module.default.from).toBe("source");
  });

  it("resolves a linked package under its default condition when conditions is absent", async () => {
    const { module } = await linked((workspace) =>
      imported<Statement>(workspace.path("src/statement.ts"), { root: workspace.root }),
    );

    expect(module.default.from).toBe("dist");
  });

  it("lists the files behind a module in the order the runner imported them", async () => {
    await expect(behindStatement()).resolves.toStrictEqual([
      "src/statement.ts",
      "packages/kit/src/index.ts",
      "src/other.ts",
    ]);
  });

  it("lists a file once when two modules import it", async () => {
    const files = await behindStatement();

    expect(files.filter((file) => file === "packages/kit/src/index.ts")).toHaveLength(1);
  });

  it("lists every loaded module but the built-in in the order the runner evaluated them", async () => {
    const loaded = await loadedBehindStatement();

    expect(loaded.map(([file]) => file)).toStrictEqual([
      "packages/kit/src/index.ts",
      "src/other.ts",
      "src/statement.ts",
    ]);
  });

  it("returns the namespace each loaded module's evaluation produced", async () => {
    const loaded = new Map(await loadedBehindStatement());

    expect({ ...loaded.get("packages/kit/src/index.ts") }).toStrictEqual({ from: "source" });
  });

  it("imports a package by its bare specifier rather than by file path", async () => {
    const { module } = await linked((workspace) =>
      imported<{ from: string }>("@acme/kit", {
        conditions: [SOURCE, "node"],
        root: workspace.root,
      }),
    );

    expect(module.from).toBe("source");
  });

  it("returns no files for a module the runner externalises", async () => {
    const { files, module } = await linked((workspace) =>
      imported<{ sep: string }>("node:path", { root: workspace.root }),
    );

    expect(module.sep).toHaveLength(1);
    expect(files).toStrictEqual([]);
  });

  it("returns no loaded module for an imported built-in", async () => {
    const { loaded } = await linked((workspace) =>
      imported<{ sep: string }>("node:path", { root: workspace.root }),
    );

    expect(loaded).toStrictEqual([]);
  });

  it("rejects with an error naming the specifier when nothing resolves it", async () => {
    await expect(
      linked((workspace) => imported("@acme/absent", { root: workspace.root })),
    ).rejects.toThrow("@acme/absent");
  });

  it("imports through the dev server's ssr environment when it is runnable", async () => {
    const seen = await linked(async (workspace) => {
      const file = workspace.path("src/statement.ts");
      const server = await createServer({
        configFile: false,
        envDir: false,
        environments: {
          ssr: { resolve: { conditions: [SOURCE, "node"], noExternal: true } },
        },
        logLevel: "silent",
        root: workspace.root,
        server: { middlewareMode: true, watch: null },
      });

      try {
        const { files, module } = await imported<Statement>(file, { root: workspace.root }, server);

        return {
          first: files[0] === file,
          from: module.default.from,
          graphed: server.environments["ssr"]?.moduleGraph.getModuleById(file) !== undefined,
        };
      } finally {
        await server.close();
      }
    });

    expect(seen).toStrictEqual({ first: true, from: "source", graphed: true });
  });

  it("builds its own environment when the server's ssr environment is not runnable", async () => {
    const server = { environments: { ssr: {} } } as unknown as ViteDevServer;
    const { module } = await linked((workspace) =>
      imported<Statement>(
        workspace.path("src/statement.ts"),
        { conditions: [SOURCE, "node"], root: workspace.root },
        server,
      ),
    );

    expect(module.default.from).toBe("source");
  });

  it("imports a second module through an importer already used once", async () => {
    const seen = await linked(async (workspace) => {
      const through = await importer({ conditions: [SOURCE, "node"], root: workspace.root });

      try {
        const statement = await through.import<Statement>(workspace.path("src/statement.ts"));
        const kit = await through.import<{ from: string }>("@acme/kit");

        return [statement.module.default.from, kit.module.from];
      } finally {
        await through.close();
      }
    });

    expect(seen).toStrictEqual(["source", "source"]);
  });

  it("returns the module it evaluated first when nothing is invalidated", async () => {
    await expect(importedTwice(() => {})).resolves.toStrictEqual({
      from: ["source", "source"],
      same: true,
    });
  });

  it("transforms a file again after invalidate names it", async () => {
    const { from } = await importedTwice((workspace) => [
      workspace.path("packages/kit/src/index.ts"),
    ]);

    expect(from).toStrictEqual(["source", "changed"]);
  });

  it("evaluates every module again after invalidate names no file", async () => {
    await expect(importedTwice(() => [])).resolves.toStrictEqual({
      from: ["source", "source"],
      same: false,
    });
  });

  it("drops nothing when it imports through the dev server's environment", async () => {
    const same = await linked(async (workspace) => {
      const file = workspace.path("src/statement.ts");
      const server = await createServer({
        configFile: false,
        envDir: false,
        environments: {
          ssr: { resolve: { conditions: [SOURCE, "node"], noExternal: true } },
        },
        logLevel: "silent",
        root: workspace.root,
        server: { middlewareMode: true, watch: null },
      });

      try {
        const through = await importer({ root: workspace.root }, server);
        const first = await through.import<Statement>(file);

        through.invalidate([file]);

        return first.module === (await through.import<Statement>(file)).module;
      } finally {
        await server.close();
      }
    });

    expect(same).toBe(true);
  });

  it("keeps the dev server's environment usable after an importer over it is closed", async () => {
    const seen = await linked(async (workspace) => {
      const file = workspace.path("src/statement.ts");
      const server = await createServer({
        configFile: false,
        envDir: false,
        environments: {
          ssr: { resolve: { conditions: [SOURCE, "node"], noExternal: true } },
        },
        logLevel: "silent",
        root: workspace.root,
        server: { middlewareMode: true, watch: null },
      });

      try {
        const through = await importer({ root: workspace.root }, server);

        await through.close();

        return (await imported<Statement>(file, { root: workspace.root }, server)).module.default
          .from;
      } finally {
        await server.close();
      }
    });

    expect(seen).toBe("source");
  });
});
