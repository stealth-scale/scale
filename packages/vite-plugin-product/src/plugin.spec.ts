/**
 * Covers the plugin's hooks over the scratch product: the virtual module's id, the composition at
 * the start of a build or a dev server, the faults it reports, and the module it serves.
 */

import { existsSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { build, createServer, normalizePath, type Plugin } from "vite";
import { describe, expect, it, vi } from "vitest";

import {
  changed,
  type Command,
  configured,
  generated,
  hookContext,
  type HookContext,
  loaded,
  resolved,
  type ScratchFiles,
  type ScratchWorkspace,
  started,
} from "@stealthscale/testing";
import { importer } from "@stealthscale/vite-plugin-base";
import { i18n, type Options } from "@stealthscale/vite-plugin-i18n";

import {
  APP,
  catalogued,
  CONDITIONS,
  CONTRACT,
  contractOf,
  DEFINITION,
  EXPENSES,
  MEMBERS,
  PRODUCT,
  STANDALONE,
  TWO_PLUGINS,
  WEB,
  withProduct,
  WORDS,
} from "#compose.fixtures.ts";
import { compose } from "#compose.ts";
import { ID, product, type ProductOptions } from "#plugin.ts";

vi.mock(import("#compose.ts"), async (importOriginal) => {
  const original = await importOriginal();

  return { ...original, compose: vi.fn(original.compose) };
});

vi.mock(import("@stealthscale/vite-plugin-base"), async (importOriginal) => {
  const original = await importOriginal();

  return { ...original, importer: vi.fn(original.importer) };
});

/**
 * The composition without the spy, which a gated composition runs.
 */
const actual = await vi.importActual<{ readonly compose: typeof compose }>("#compose.ts");

/**
 * The importer without the spy, which a case wraps to count its closes.
 */
const base = await vi.importActual<{ readonly importer: typeof importer }>(
  "@stealthscale/vite-plugin-base",
);

/**
 * The id the plugin resolves `virtual:product` to.
 */
const RESOLVED = `\0${ID}`;

/**
 * Describes one run of the plugin over the scratch product.
 */
interface Run {
  /**
   * The context the build start was called with, which recorded the files watched and the
   * warnings.
   */
  readonly context: HookContext;

  /**
   * The scratch workspace's root.
   */
  readonly root: string;

  /**
   * The source the plugin served for `virtual:product`, or the error it threw.
   */
  readonly served: unknown;
}

/**
 * Configures the plugin over the scratch product beside the catalogue plugin, starts it, and loads
 * `virtual:product`.
 *
 * @param command - The command the bundler runs under.
 * @param files - Files that replace or add to the product's.
 * @param options - The plugin's options.
 * @param words - The catalogue plugin's options.
 * @returns The run, or the error the build start threw.
 */
function ran(
  command: Command,
  files: ScratchFiles = {},
  options: ProductOptions = {},
  words: Options = {},
): Promise<Run> {
  return withProduct(files, async (workspace) => {
    const root = workspace.path(APP);
    const plugin = product(options);
    const context = hookContext([], command);

    await configured(plugin, {
      command,
      plugins: [await catalogued(root, words), plugin],
      root,
      ssr: { resolve: { conditions: CONDITIONS } },
    });
    await started(plugin, context);

    const served: unknown = await loaded(plugin, RESOLVED).catch((error: unknown) => error);

    return { context, root: workspace.root, served };
  });
}

/**
 * Describes a file the plugin emitted.
 */
interface Emitted {
  /**
   * The file's path in the build's output.
   */
  readonly fileName: string;

  /**
   * The file's content.
   */
  readonly source: string;
}

/**
 * Composes the scratch product and calls the bundle hook for an environment, recording every file
 * the plugin emits.
 *
 * @param command - The command the bundler runs under.
 * @param consumer - The consumer of the environment the bundle is generated for.
 */
function emittedFor(command: Command, consumer: "client" | "server"): Promise<readonly Emitted[]> {
  return withProduct({}, async (workspace) => {
    const root = workspace.path(APP);
    const plugin = product();
    const emitted: Emitted[] = [];

    await configured(plugin, {
      command,
      plugins: [await catalogued(root), plugin],
      root,
      ssr: { resolve: { conditions: CONDITIONS } },
    });
    await started(plugin, hookContext([], command));
    await generated(plugin, {
      emitFile: (file: Emitted): string => {
        emitted.push(file);

        return file.fileName;
      },
      environment: { config: { consumer } },
    });

    return emitted;
  });
}

/**
 * Describes the output of a real build of the scratch product with two plugins.
 */
interface Built {
  /**
   * The file name of every asset.
   */
  readonly assets: readonly string[];

  /**
   * The modules of each chunk by the chunk's name, as paths from the scratch workspace's root.
   */
  readonly chunks: Readonly<Record<string, readonly string[]>>;
}

/**
 * Builds the scratch product with two plugins through Vite, writing nothing.
 *
 * @throws {@link Error} When the build returns no output.
 */
function builtWithTwoPlugins(): Promise<Built> {
  return withProduct(TWO_PLUGINS, async (workspace) => {
    const root = workspace.path(APP);
    const result = await build({
      build: {
        minify: false,
        outDir: workspace.path(`${APP}/dist`),
        rolldownOptions: {
          input: workspace.path(`${APP}/src/main.ts`),
          output: { codeSplitting: { includeDependenciesRecursively: false } },
        },
        write: false,
      },
      configFile: false,
      envDir: false,
      logLevel: "silent",
      plugins: [i18n({ types: false }), product()],
      resolve: { conditions: [...CONDITIONS] },
      root,
      ssr: { resolve: { conditions: [...CONDITIONS] } },
    });
    const [written] = Array.isArray(result) ? result : [result];

    if (written === undefined || !("output" in written))
      throw new Error("The build wrote nothing.");

    return {
      assets: written.output.flatMap((file) => (file.type === "asset" ? [file.fileName] : [])),
      chunks: Object.fromEntries(
        written.output.flatMap((file) =>
          file.type === "chunk"
            ? [[file.name, file.moduleIds.map((id) => relative(workspace.root, id)).toSorted()]]
            : [],
        ),
      ),
    };
  });
}

/**
 * The real build of the scratch product with two plugins, started by the first case that reads it.
 */
let twoPlugins: Promise<Built> | undefined;

/**
 * Returns the real build of the scratch product with two plugins, built once for every case.
 */
function builtOnce(): Promise<Built> {
  twoPlugins ??= builtWithTwoPlugins();

  return twoPlugins;
}

/**
 * Describes the context of a dev server's environment, which records every payload it sends to
 * the page.
 */
interface Serving extends HookContext {
  /**
   * The environment, with its channel to the page and its name.
   */
  readonly environment: HookContext["environment"] & {
    /**
     * Records each payload.
     */
    readonly hot: { readonly send: (payload: unknown) => void };

    /**
     * Name of the environment.
     */
    readonly name: string;
  };

  /**
   * Every payload sent to the page, in call order.
   */
  readonly sent: unknown[];
}

/**
 * Builds the context of a dev server's environment whose graph contains `virtual:product`.
 *
 * @param bundled - Whether the server bundles.
 * @param name - The environment's name. `client` by default.
 * @param graphed - The ids the module graph contains. `virtual:product` by default.
 */
function serving(
  bundled: boolean,
  name = "client",
  graphed: readonly string[] = [RESOLVED],
): Serving {
  const context = hookContext(graphed, "serve", bundled);
  const sent: unknown[] = [];

  return {
    ...context,
    environment: {
      ...context.environment,
      hot: {
        send: (payload) => {
          sent.push(payload);
        },
      },
      name,
    },
    sent,
  };
}

/**
 * Configures the plugin over a scratch product and starts it, under a command.
 *
 * @param workspace - The scratch workspace.
 * @param command - The command the bundler runs under. Serving by default.
 */
async function startedIn(workspace: ScratchWorkspace, command: Command = "serve"): Promise<Plugin> {
  const root = workspace.path(APP);
  const plugin = product();

  await configured(plugin, {
    command,
    plugins: [await catalogued(root), plugin],
    root,
    ssr: { resolve: { conditions: CONDITIONS } },
  });
  await started(plugin, hookContext([], command));

  return plugin;
}

/**
 * Starts the plugin over a scratch product, then writes a file and reports the change through the
 * watch hook.
 *
 * @param workspace - The scratch workspace.
 * @param path - The file's path from the workspace's root.
 * @param content - The file's new content.
 * @param context - The context the watch hook is called with.
 * @returns The started plugin.
 */
async function changedAfterStart(
  workspace: ScratchWorkspace,
  path: string,
  content: string,
  context: HookContext,
): Promise<Plugin> {
  const plugin = await startedIn(workspace);
  const file = workspace.path(path);

  writeFileSync(file, content);
  await changed(plugin, context, file, "update");

  return plugin;
}

/**
 * Calls the plugin's hook that runs when the bundle closes.
 */
async function bundleClosed(plugin: Plugin): Promise<void> {
  const hook: unknown = plugin.closeBundle;

  if (typeof hook === "function") await Reflect.apply(hook, {}, []);
}

/**
 * Makes the next importer the plugin opens count each close in `closes`.
 */
function countingCloses(closes: number[]): void {
  vi.mocked(importer).mockImplementationOnce(async (loading) => {
    const through = await base.importer(loading);

    return {
      ...through,
      close: async (): Promise<void> => {
        closes.push(closes.length + 1);
        await through.close();
      },
    };
  });
}

/**
 * Calls the plugin's hot update hook for a changed file and returns what the hook returned.
 */
function hotUpdated(plugin: Plugin, context: Serving, file: string): unknown {
  const hook: unknown = plugin.hotUpdate;

  return typeof hook === "function"
    ? Reflect.apply(hook, context, [
        { file, modules: [], read: () => "", timestamp: 0, type: "update" },
      ])
    : undefined;
}

/**
 * Describes a promise the case resolves when it chooses.
 */
interface Gate {
  /**
   * Resolves {@link Gate.opened}.
   */
  readonly open: () => void;

  /**
   * Resolves once the case opens the gate.
   */
  readonly opened: Promise<void>;
}

/**
 * Returns a gate that is closed.
 */
function gate(): Gate {
  const opening: Array<() => void> = [];
  const opened = new Promise<void>((resolve) => {
    opening.push(resolve);
  });

  return {
    open: () => {
      for (const resolve of opening) resolve();
    },
    opened,
  };
}

/**
 * Describes the changes a case reports during a composition.
 */
interface Reported {
  /**
   * The started plugin.
   */
  readonly plugin: Plugin;

  /**
   * The watch hook's calls, one per change, which settle once the plugin followed every change.
   */
  readonly reported: Promise<void[]>;
}

/**
 * Starts the plugin over a scratch product, then writes each definition in turn and reports it as
 * a change. The composition of the first change reads its definition, then waits for `release`.
 *
 * @param workspace - The scratch workspace.
 * @param definitions - The definition's content for each change.
 * @param release - The gate the composition of the first change waits for.
 */
async function changedDuring(
  workspace: ScratchWorkspace,
  definitions: readonly [string, ...string[]],
  release: Gate,
): Promise<Reported> {
  const plugin = await startedIn(workspace);
  const file = workspace.path(`${APP}/${DEFINITION}`);
  const read = gate();
  const [first, ...later] = definitions;

  vi.mocked(compose).mockImplementationOnce(async (input) => {
    const composition = await actual.compose(input);

    read.open();
    await release.opened;

    return composition;
  });
  writeFileSync(file, first);

  const reports = [changed(plugin, serving(false), file, "update")];

  await read.opened;

  for (const definition of later) {
    writeFileSync(file, definition);
    reports.push(changed(plugin, serving(false), file, "update"));
  }

  return { plugin, reported: Promise.all(reports) };
}

/**
 * The definition with the version changed.
 */
const BUMPED = (PRODUCT[`${APP}/${DEFINITION}`] ?? "").replace('"1.0.0"', '"1.1.0"');

/**
 * The definition with a version later than the one {@link BUMPED} states.
 */
const LATER = BUMPED.replace('"1.1.0"', '"1.2.0"');

/**
 * The contract with a command whose label names a key the catalogue lacks.
 */
const UNLABELLED = contractOf(MEMBERS.replace('"commands.request"', '"commands.missing"'));

/**
 * The line the resolver reports for {@link UNLABELLED}.
 */
const MISSING =
  "time-off.commands.request.label: names the key commands.missing, which the fallback catalogue of time-off lacks";

/**
 * Files whose contract binds two commands to the same keys, which the resolver warns about.
 */
const TWICE: ScratchFiles = {
  [`${APP}/node_modules/@acme/time-off/src/manifest.ts`]: [
    'import { definePlugin } from "@stealthscale/sdk-core";',
    'import { contract } from "@acme/time-off-contract";',
    "",
    "export const manifest = definePlugin(contract, {",
    "  commands: {",
    '    request: { run: () => import("./request.ts") },',
    '    review: { run: () => import("./request.ts") },',
    "  },",
    '  routes: { overview: () => import("./overview.ts") },',
    "});",
    "",
  ].join("\n"),
  [`${CONTRACT}/locales/en/time-off.json`]: JSON.stringify({
    ...WORDS,
    commands: { request: "Request time off", review: "Review requests" },
  }),
  [`${CONTRACT}/src/index.ts`]: contractOf(
    [
      "commands: {",
      'request: command({ keys: "Mod+Shift+R", label: "commands.request" }),',
      'review: command({ keys: "Mod+Shift+R", label: "commands.review" }),',
      "},",
      'routes: { overview: route({ navigation: { label: "navigation.overview" }, path: "time-off" }) },',
    ].join(" "),
  ),
};

/**
 * Files whose contract catalogue lacks the key of the route's navigation entry.
 */
const UNNAMED: ScratchFiles = {
  [`${CONTRACT}/locales/en/time-off.json`]: JSON.stringify({ ...WORDS, navigation: {} }),
};

/**
 * The resolved id of a standalone page's entry.
 */
const ENTRY = "\0virtual:standalone";

/**
 * The path of a standalone page's generated definition, from the project root.
 */
const GENERATED = "node_modules/.stealth/standalone/product.ts";

/**
 * Resolves the configuration of a plugin over the standalone scratch product, and returns whether
 * the generated definition exists.
 *
 * @param options - The plugin's options.
 */
function generatedWith(options: ProductOptions): Promise<boolean> {
  return withProduct(STANDALONE, async (workspace) => {
    const root = workspace.path(APP);

    await configured(product(options), { command: "serve", plugins: [], root, ssr: {} });

    return existsSync(`${root}/${GENERATED}`);
  });
}

describe("product", () => {
  it("returns a plugin named stealth:product", () => {
    expect(product().name).toBe("stealth:product");
  });

  it("resolves virtual:product to its resolved id", async () => {
    await expect(resolved(product(), ID)).resolves.toBe(RESOLVED);
  });

  it("leaves every other specifier alone", async () => {
    await expect(resolved(product(), "./main.ts")).resolves.toBeUndefined();
  });

  it("serves no module for an id it did not resolve", async () => {
    await expect(loaded(product(), "/src/main.ts")).resolves.toBeUndefined();
  });

  it("throws when virtual:product loads before the product is composed", async () => {
    await expect(loaded(product(), RESOLVED)).rejects.toThrow(
      "The product has not been composed yet.",
    );
  });

  it("serves a module that imports the definition from the project root", async () => {
    const { served } = await ran("serve");

    expect(served).toContain(`import definition from "/${DEFINITION}";`);
  });

  it("imports the definition the options name", async () => {
    const { served } = await ran(
      "serve",
      { [`${APP}/src/app/product.ts`]: PRODUCT[`${APP}/${DEFINITION}`] ?? "" },
      { definition: "src/app/product.ts" },
    );

    expect(served).toContain('import definition from "/src/app/product.ts";');
  });

  it("watches every file the definition's evaluation read", async () => {
    const { context, root } = await ran("serve");

    expect(context.watched).toContain(`${root}/${APP}/${DEFINITION}`);
    expect(context.watched).toContain(`${root}/${CONTRACT}/src/index.ts`);
  });

  it("reports each warning through the bundler", async () => {
    const { context } = await ran("build", TWICE);

    expect(context.warned).toStrictEqual([
      "time-off.commands.review.keys: binds Mod+Shift+R, as time-off/request does",
    ]);
  });

  it("throws every problem when a build's product does not resolve", async () => {
    await expect(ran("build", UNNAMED)).rejects.toThrow(
      [
        "The product does not resolve:",
        "time-off.routes.overview.navigation.label: names the key navigation.overview, which the fallback catalogue of time-off lacks",
      ].join("\n"),
    );
  });

  it("follows the problems with each hint", async () => {
    await expect(ran("build", {}, {}, { scopes: ["@other"] })).rejects.toThrow(
      [
        "The product does not resolve:",
        "time-off: has no catalogue in the fallback language",
        "@acme/time-off-contract has catalogues the i18n layer does not follow. Add @acme to the scopes of the i18n layer.",
      ].join("\n"),
    );
  });

  it("serves the problems from virtual:product when a dev server's product does not resolve", async () => {
    const { served } = await ran("serve", UNNAMED);

    expect(served).toStrictEqual(
      new Error(
        [
          "The product does not resolve:",
          "time-off.routes.overview.navigation.label: names the key navigation.overview, which the fallback catalogue of time-off lacks",
        ].join("\n"),
      ),
    );
  });

  it("throws when the configuration has no catalogue plugin", async () => {
    const plugin = product();

    await configured(plugin, { command: "build", plugins: [plugin], root: "/", ssr: {} });

    await expect(started(plugin, hookContext([], "build"))).rejects.toThrow(
      "The configuration has no stealth:i18n plugin, whose catalogues the product plugin checks. Add the layers of @stealthscale/vite-config-i18n.",
    );
  });

  it("writes the three catalogues into the client build's output", async () => {
    const emitted = await emittedFor("build", "client");

    expect(emitted.map(({ fileName }) => fileName)).toStrictEqual([
      ".product/access.json",
      ".product/flags.json",
      ".product/operations.json",
    ]);
  });

  it("writes each catalogue as JSON without the members a name leaves out", async () => {
    const [, flags] = await emittedFor("build", "client");
    const written: unknown = JSON.parse(flags?.source ?? "");

    expect(written).toStrictEqual({
      flags: [
        { default: true, description: {}, id: "host/plugin.time-off", kind: "ops", plugin: "host" },
      ],
      product: { id: "people", version: "1.0.0" },
    });
  });

  it("writes no catalogue under a dev server", async () => {
    await expect(emittedFor("serve", "client")).resolves.toStrictEqual([]);
  });

  it("writes no catalogue for an environment other than the client", async () => {
    await expect(emittedFor("build", "server")).resolves.toStrictEqual([]);
  });

  it("builds each plugin's lazy modules into one chunk named after the plugin", async () => {
    const { chunks } = await builtOnce();

    expect([chunks["plugin-time-off"], chunks["plugin-expenses"]]).toStrictEqual([
      [`${WEB}/src/overview.ts`, `${WEB}/src/request.ts`],
      [`${EXPENSES}/src/claims.ts`],
    ]);
  });

  it("keeps each web package's main entry with its manifest alone in the entry chunk", async () => {
    const { chunks } = await builtOnce();
    const packaged = (chunks["main"] ?? []).filter(
      (path) => path.startsWith(`${WEB}/`) || path.startsWith(`${EXPENSES}/`),
    );

    expect(packaged).toStrictEqual([
      `${EXPENSES}/src/index.ts`,
      `${EXPENSES}/src/manifest.ts`,
      `${WEB}/src/index.ts`,
      `${WEB}/src/manifest.ts`,
    ]);
  });

  it("writes the catalogues beside the chunks of a real build", async () => {
    const { assets } = await builtOnce();

    expect(assets.toSorted()).toStrictEqual([
      ".product/access.json",
      ".product/flags.json",
      ".product/operations.json",
    ]);
  });

  it("composes the product once across build starts", async () => {
    const served = await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace);

      writeFileSync(workspace.path(`${APP}/${DEFINITION}`), 'throw new Error("changed");\n');
      await started(plugin, hookContext());

      return loaded(plugin, RESOLVED);
    });

    expect(served).toContain(`import definition from "/${DEFINITION}";`);
  });

  it("composes the product again when a file the composition read changes", async () => {
    const served = await withProduct({}, async (workspace) => {
      const path = `${APP}/${DEFINITION}`;

      return loaded(await changedAfterStart(workspace, path, BUMPED, serving(false)), RESOLVED);
    });

    expect(served).toContain('"version": "1.1.0"');
  });

  it("ignores a change to a file the composition did not read", async () => {
    const served = await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace);

      writeFileSync(workspace.path(`${APP}/${DEFINITION}`), BUMPED);
      await changed(plugin, serving(false), workspace.path(`${APP}/src/other.ts`), "update");

      return loaded(plugin, RESOLVED);
    });

    expect(served).toContain('"version": "1.0.0"');
  });

  it("sends nothing from the watch hook under a server that serves one module per file", async () => {
    const context = serving(false);

    await withProduct({}, (workspace) =>
      changedAfterStart(workspace, `${APP}/${DEFINITION}`, BUMPED, context),
    );

    expect(context.sent).toStrictEqual([]);
  });

  it("reloads the page from the watch hook under a server that bundles", async () => {
    const context = serving(true);

    await withProduct({}, (workspace) =>
      changedAfterStart(workspace, `${APP}/${DEFINITION}`, BUMPED, context),
    );

    expect(context.sent).toStrictEqual([{ path: "*", type: "full-reload" }]);
  });

  it("shows the problems in the error overlay after a change", async () => {
    const context = serving(true);

    await withProduct({}, (workspace) =>
      changedAfterStart(workspace, `${CONTRACT}/src/index.ts`, UNLABELLED, context),
    );

    expect(context.sent).toStrictEqual([
      { err: { message: `The product does not resolve:\n${MISSING}`, stack: "" }, type: "error" },
    ]);
  });

  it("keeps serving the last product that resolved after a change with problems", async () => {
    const served = await withProduct({}, async (workspace) => {
      const path = `${CONTRACT}/src/index.ts`;

      return loaded(await changedAfterStart(workspace, path, UNLABELLED, serving(true)), RESOLVED);
    });

    expect(served).toContain('"version": "1.0.0"');
  });

  it("shows the load error in the error overlay when the definition fails to load", async () => {
    const context = serving(true);
    const broken = 'throw new Error("broken");\n';

    await withProduct({}, (workspace) =>
      changedAfterStart(workspace, `${APP}/${DEFINITION}`, broken, context),
    );

    expect(JSON.stringify(context.sent)).toContain(`${DEFINITION} failed to load in Node: broken.`);
  });

  it("reloads the page of a dev server that serves one module per file after a change", async () => {
    expect.hasAssertions();

    const sent = await withProduct({}, async (workspace) => {
      const server = await createServer({
        configFile: false,
        envDir: false,
        logLevel: "silent",
        plugins: [i18n({ types: false }), product()],
        resolve: { conditions: [...CONDITIONS] },
        root: workspace.path(APP),
        server: { middlewareMode: true, watch: null, ws: false },
        ssr: { resolve: { conditions: [...CONDITIONS] } },
      });

      try {
        const send = vi.spyOn(server.environments.client.hot, "send");
        const file = workspace.path(`${APP}/${DEFINITION}`);

        await server.environments.client.transformRequest(ID);
        writeFileSync(file, BUMPED);
        server.watcher.emit("change", file);
        await vi.waitFor(() => {
          expect(send).toHaveBeenCalledWith({ path: "*", type: "full-reload" });
        });

        return send.mock.calls;
      } finally {
        await server.close();
      }
    });

    expect(sent).toStrictEqual([[{ path: "*", type: "full-reload" }]]);
  });

  it("prints each warning of the composition after a change", async () => {
    const context = serving(true);

    await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace);

      workspace.write(TWICE);
      await changed(plugin, context, workspace.path(`${CONTRACT}/src/index.ts`), "update");
    });

    expect(context.warned).toStrictEqual([
      "time-off.commands.review.keys: binds Mod+Shift+R, as time-off/request does",
    ]);
  });

  it("waits for the running composition before it composes for a later change", async () => {
    const release = gate();
    const during = await withProduct({}, async (workspace) => {
      const { reported } = await changedDuring(workspace, [BUMPED, LATER], release);

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      const calls = vi.mocked(compose).mock.calls.length;

      release.open();
      await reported;

      return calls;
    });

    expect(during).toBe(2);
  });

  it("composes once for all the changes reported during a composition", async () => {
    const release = gate();

    await withProduct({}, async (workspace) => {
      const { reported } = await changedDuring(workspace, [BUMPED, LATER, LATER], release);

      release.open();
      await reported;
    });

    expect(compose).toHaveBeenCalledTimes(3);
  });

  it("serves the product of the last change reported during a composition", async () => {
    const release = gate();
    const served = await withProduct({}, async (workspace) => {
      const { plugin, reported } = await changedDuring(workspace, [BUMPED, LATER], release);

      release.open();
      await reported;

      return loaded(plugin, RESOLVED);
    });

    expect(served).toContain('"version": "1.2.0"');
  });

  it("imports through one importer across the compositions of a dev server", async () => {
    await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace);
      const file = workspace.path(`${APP}/${DEFINITION}`);

      writeFileSync(file, BUMPED);
      await changed(plugin, serving(false), file, "update");
      writeFileSync(file, LATER);
      await changed(plugin, serving(false), file, "update");
    });

    expect(vi.mocked(importer)).toHaveBeenCalledTimes(1);
  });

  it("closes the importer once when the bundle closes", async () => {
    const closes: number[] = [];

    countingCloses(closes);
    await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace);

      await bundleClosed(plugin);
      await bundleClosed(plugin);
    });

    expect(closes).toStrictEqual([1]);
  });

  it("opens no importer when the bundle closes before a composition", async () => {
    await bundleClosed(product());

    expect(vi.mocked(importer)).toHaveBeenCalledTimes(0);
  });

  it("opens a new importer for a composition after the bundle closed", async () => {
    const served = await withProduct({}, async (workspace) => {
      const plugin = await startedIn(workspace, "build");
      const file = workspace.path(`${APP}/${DEFINITION}`);

      await bundleClosed(plugin);
      writeFileSync(file, BUMPED);
      await changed(plugin, hookContext([], "build"), file, "update");
      await started(plugin, hookContext([], "build"));

      return loaded(plugin, RESOLVED);
    });

    expect([
      vi.mocked(importer).mock.calls.length,
      String(served).includes('"version": "1.1.0"'),
    ]).toStrictEqual([2, true]);
  });

  it("composes the product again at the next build start of a watching build", async () => {
    await expect(
      withProduct({}, async (workspace) => {
        const plugin = await startedIn(workspace, "build");
        const file = workspace.path(`${CONTRACT}/src/index.ts`);

        writeFileSync(file, UNLABELLED);
        await changed(plugin, hookContext([], "build"), file, "update");
        await started(plugin, hookContext([], "build"));
      }),
    ).rejects.toThrow(MISSING);
  });

  it("brings the client's page up to date on a hot update", async () => {
    const context = serving(false);
    const returned = await withProduct({}, async (workspace) => {
      const path = `${APP}/${DEFINITION}`;
      const plugin = await changedAfterStart(workspace, path, BUMPED, serving(false));

      return hotUpdated(plugin, context, workspace.path(path));
    });

    expect({ invalidated: context.invalidated, returned, sent: context.sent }).toStrictEqual({
      invalidated: [RESOLVED],
      returned: [],
      sent: [{ path: "*", type: "full-reload" }],
    });
  });

  it("invalidates the product module of another environment without a notice", async () => {
    const context = serving(false, "ssr");

    await withProduct({}, async (workspace) => {
      hotUpdated(await startedIn(workspace), context, workspace.path(`${APP}/${DEFINITION}`));
    });

    expect({ invalidated: context.invalidated, sent: context.sent }).toStrictEqual({
      invalidated: [RESOLVED],
      sent: [],
    });
  });

  it("reloads the client's page when no page loaded the product module", async () => {
    const context = serving(false, "client", []);

    await withProduct({}, async (workspace) => {
      hotUpdated(await startedIn(workspace), context, workspace.path(`${APP}/${DEFINITION}`));
    });

    expect({ invalidated: context.invalidated, sent: context.sent }).toStrictEqual({
      invalidated: [],
      sent: [{ path: "*", type: "full-reload" }],
    });
  });

  it("shows the problems in the client's error overlay on a hot update", async () => {
    const context = serving(false);

    await withProduct({}, async (workspace) => {
      const path = `${CONTRACT}/src/index.ts`;
      const plugin = await changedAfterStart(workspace, path, UNLABELLED, serving(false));

      hotUpdated(plugin, context, workspace.path(path));
    });

    expect(context.sent).toStrictEqual([
      { err: { message: `The product does not resolve:\n${MISSING}`, stack: "" }, type: "error" },
    ]);
  });

  it("leaves a hot update of a file the composition did not read to the server", async () => {
    const returned = await withProduct({}, async (workspace) =>
      hotUpdated(await startedIn(workspace), serving(false), workspace.path(`${APP}/src/other.ts`)),
    );

    expect(returned).toBeUndefined();
  });

  it("watches every file the composition read from virtual:product", async () => {
    const context = hookContext();
    const root = await withProduct({}, async (workspace) => {
      await loaded(await startedIn(workspace), RESOLVED, context);

      return workspace.root;
    });

    expect(context.watched).toContain(`${root}/${CONTRACT}/src/index.ts`);
  });

  it("resolves the document of a standalone page under the project root", async () => {
    await expect(resolved(product({ standalone: {} }), "/index.html")).resolves.toBe(
      `${normalizePath(process.cwd())}/index.html`,
    );
  });

  it("leaves the document alone without a standalone page", async () => {
    await expect(resolved(product(), "/index.html")).resolves.toBeUndefined();
  });

  it("serves the entry of a standalone page", async () => {
    await expect(loaded(product({ standalone: {} }), ENTRY)).resolves.toContain(
      "await renderStandalone({ catalogues, product });",
    );
  });

  it("serves no entry without a standalone page", async () => {
    await expect(loaded(product(), ENTRY)).resolves.toBeUndefined();
  });

  it("writes the definition of a standalone page once the configuration resolves", async () => {
    await expect(generatedWith({ standalone: {} })).resolves.toBe(true);
  });

  it("writes no definition of a standalone page where the options name one", async () => {
    await expect(generatedWith({ definition: DEFINITION, standalone: {} })).resolves.toBe(false);
  });

  it("serves a product that imports a standalone page's definition as a virtual module", async () => {
    const { served } = await ran("serve", STANDALONE, { standalone: {} });

    expect(served).toContain('import definition from "virtual:standalone-product";');
  });

  it("serves a product that imports the definition the options name for a standalone page", async () => {
    const { served } = await ran("serve", {}, { definition: DEFINITION, standalone: {} });

    expect(served).toContain(`import definition from "/${DEFINITION}";`);
  });

  it("serves a standalone page's product under the plugin's id", async () => {
    const { served } = await ran("serve", STANDALONE, { standalone: {} });

    expect(served).toContain('"productId": "time-off"');
  });
});
